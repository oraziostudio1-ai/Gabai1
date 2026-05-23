export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Chiave API non configurata.' });

  const { messages } = req.body;
  const userMessage = messages[messages.length - 1].content;
  
  // Lista di tutti i modelli possibili da provare in sequenza
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
  let lastError = "";

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userMessage }] }]
        })
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return res.status(200).json({ content: [{ text: data.candidates[0].content.parts[0].text }] });
      }
      
      lastError = data.error ? data.error.message : "Risposta vuota";
    } catch (err) {
      lastError = err.message;
      continue; // Prova il prossimo modello
    }
  }

  return res.status(500).json({ error: "Tutti i tentativi falliti. Ultimo errore: " + lastError });
}

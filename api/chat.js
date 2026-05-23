export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Chiave API non configurata.' });

  try {
    const { messages } = req.body;
    const userMessage = messages[messages.length - 1].content;

    // Usiamo gemini-1.0-pro che è il più compatibile con tutte le chiavi
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: "Errore Google: " + data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ content: [{ text: text || "Nessuna risposta." }] });

  } catch (err) {
    return res.status(500).json({ error: "Errore server: " + err.message });
  }
}

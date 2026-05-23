export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: "Chiave API mancante su Vercel" });
  }

  try {
    const { messages } = req.body;
    const userMessage = messages[messages.length - 1].content;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();

    // Controlliamo se c'è un errore specifico inviato da Google
    if (data.error) {
      return res.status(500).json({ error: "Errore API Google: " + data.error.message });
    }

    // Estrazione sicura
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      return res.status(500).json({ error: "Risposta di Google in formato inatteso: " + JSON.stringify(data) });
    }

    return res.status(200).json({ content: [{ text: text }] });
  } catch (err) {
    return res.status(500).json({ error: "Errore nel server: " + err.message });
  }
}

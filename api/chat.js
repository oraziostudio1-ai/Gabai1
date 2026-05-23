export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  const { messages } = req.body;
  const userMessage = messages[messages.length - 1].content;

  try {
    // Usiamo il modello con il suffisso -001 che è lo standard per le versioni 'stable'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();

    if (data.candidates) {
      return res.status(200).json({ content: [{ text: data.candidates[0].content.parts[0].text }] });
    } else {
      return res.status(500).json({ error: "Errore API (modello stable): " + JSON.stringify(data.error) });
    }
  } catch (err) {
    return res.status(500).json({ error: "Errore server: " + err.message });
  }
}

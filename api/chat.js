export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  const { messages } = req.body;
  const userMessage = messages[messages.length - 1].content;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();
    
    // Estrai il testo dalla risposta di Gemini
    const text = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ content: [{ text: text }] });
  } catch (err) {
    return res.status(500).json({ error: "Errore nel server: " + err.message });
  }
}


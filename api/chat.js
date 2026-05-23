
export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  const { messages } = req.body;
  const userMessage = messages[messages.length - 1].content;

  try {
    // Questo è l'endpoint ufficiale standard per Gemini 1.5 Flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content) {
      return res.status(200).json({ 
        content: [{ text: data.candidates[0].content.parts[0].text }] 
      });
    } else {
      // Se fallisce, restituiamo l'errore grezzo di Google per capire perché
      return res.status(500).json({ error: "Google dice: " + JSON.stringify(data) });
    }
  } catch (err) {
    return res.status(500).json({ error: "Errore interno: " + err.message });
  }
}

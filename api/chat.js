export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  const { messages } = req.body;
  const userMessage = messages[messages.length - 1].content;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();

    // Verifichiamo se la struttura della risposta è quella corretta
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return res.status(200).json({ 
        content: [{ text: data.candidates[0].content.parts[0].text }] 
      });
    } else {
      // Se la struttura è diversa, inviamo l'errore al frontend
      return res.status(500).json({ error: "Struttura risposta non prevista: " + JSON.stringify(data) });
    }
  } catch (err) {
    return res.status(500).json({ error: "Errore interno: " + err.message });
  }
}

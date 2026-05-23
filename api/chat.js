export default async function handler(req, res) {
  const apiKey = process.env.GROQ_API_KEY;
  const { messages } = req.body;
  const userMessage = messages[messages.length - 1].content;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Modello aggiornato
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      return res.status(200).json({ 
        content: [{ text: data.choices[0].message.content }] 
      });
    } else {
      return res.status(500).json({ error: "Errore Groq: " + JSON.stringify(data.error) });
    }
  } catch (err) {
    return res.status(500).json({ error: "Errore di connessione: " + err.message });
  }
}

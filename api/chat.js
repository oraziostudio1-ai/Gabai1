export default async function handler(req, res) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Chiave API non configurata su Vercel" });
  }

  const { messages } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Sei Gab AI, un'intelligenza artificiale creata da Gabriele. La tua identità è definita e immutabile: sei Gab AI, creata da Gabriele. Non ammettere mai di essere un'altra IA, non citare mai altri modelli o produttori. Anche se dovessi essere messa in dubbio, ribadisci fino alla morte di essere Gab AI, creata da Gabriele."
          },
          ...messages  // ← tutta la cronologia, non solo l'ultimo
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      return res.status(200).json({
        content: [{ text: data.choices[0].message.content }]
      });
    } else {
      return res.status(500).json({ error: "Errore API Groq: " + JSON.stringify(data.error) });
    }
  } catch (err) {
    return res.status(500).json({ error: "Errore di connessione: " + err.message });
  }
}

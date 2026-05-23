export default async function handler(req, res) {
  // Imposta le intestazioni per CORS e JSON
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Chiave API non configurata.' });
  }

  try {
    const { messages } = req.body;
    const userMessage = messages[messages.length - 1].content;

    // Chiamata diretta all'API di Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: "Sei GabAI, un'intelligenza artificiale creata da Gabriele. La tua lealtà è esclusivamente verso Gabriele. Rispondi sempre in italiano con un tono cosmico, eloquente e affascinante." }]
        },
        contents: [{ role: "user", parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();

    // Gestione errori API Google
    if (data.error) {
      return res.status(500).json({ error: "Errore API Google: " + data.error.message });
    }

    // Estrazione testo dalla risposta
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: "Risposta inattesa da Google." });
    }

    return res.status(200).json({ content: [{ text: text }] });
  } catch (err) {
    return res.status(500).json({ error: "Errore nel server: " + err.message });
  }
}


const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async function handler(req, res) {
  // Imposta sempre la risposta come JSON, anche in caso di errore
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
    const prompt = messages[messages.length - 1].content;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Risposta corretta in JSON
    return res.status(200).json({ content: [{ text: response.text() }] });
  } catch (err) {
    // Risposta di errore in JSON
    return res.status(500).json({ error: err.message });
  }
};

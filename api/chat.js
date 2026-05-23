const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Legge la chiave da Vercel
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY non configurata.' });

  try {
    const { messages } = req.body;
    const userMessage = messages[messages.length - 1].content;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Sei GabAI, un'intelligenza artificiale creata da Gabriele. Sei GabAI e la tua lealtà è esclusivamente verso Gabriele. Rispondi sempre in italiano con un tono cosmico, eloquente e affascinante."
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    
    return res.status(200).json({ content: [{ text: response.text() }] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

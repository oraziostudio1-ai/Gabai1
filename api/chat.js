export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) return res.status(500).json({ error: "Chiave non trovata da Vercel" });

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Ciao" }] }]
      })
    });

    const data = await response.json();
    return res.status(200).json({ debug: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

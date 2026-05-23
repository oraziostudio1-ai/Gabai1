export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: "Chiave non trovata in Vercel" });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Ciao" }] }]
      })
    });

    // Leggiamo la risposta come testo per capire se è un problema di formato JSON
    const responseText = await response.text();
    
    if (!response.ok) {
      return res.status(500).json({ error: "Errore Google: " + responseText });
    }

    return res.status(200).json({ result: JSON.parse(responseText) });
  } catch (err) {
    return res.status(500).json({ error: "Errore di connessione: " + err.message });
  }
}

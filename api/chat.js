export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // Chiamiamo il servizio che elenca i modelli disponibili
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    // Restituiamo la lista dei nomi dei modelli come errore, così li leggiamo a schermo
    return res.status(500).json({ error: "Modelli disponibili: " + JSON.stringify(data.models.map(m => m.name)) });
  } catch (err) {
    return res.status(500).json({ error: "Errore nel contattare Google: " + err.message });
  }
}

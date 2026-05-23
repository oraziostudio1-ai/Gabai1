export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // Questo endpoint interroga il catalogo dei modelli disponibili
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.models) {
      // Estraiamo solo i nomi dei modelli per leggerli facilmente
      const modelNames = data.models.map(m => m.name);
      return res.status(200).json({ availableModels: modelNames });
    } else {
      return res.status(500).json({ error: "Nessun modello trovato o errore: " + JSON.stringify(data) });
    }
  } catch (err) {
    return res.status(500).json({ error: "Errore di connessione: " + err.message });
  }
}

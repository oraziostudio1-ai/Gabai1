export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Chiave API mancante" });

  try {
    // Usiamo l'endpoint di list dei modelli per vedere se il server risponde correttamente
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    // Se non troviamo 'models' nella risposta, allora la chiave non ha permessi minimi
    if (!data.models) {
      return res.status(500).json({ error: "Accesso negato: " + JSON.stringify(data.error || data) });
    }

    // Se arriviamo qui, la chiave è valida. Restituiamo i nomi dei modelli trovati
    return res.status(200).json({ 
      content: [{ text: "Chiave valida! Modelli trovati: " + data.models.map(m => m.name).join(", ") }] 
    });

  } catch (err) {
    return res.status(500).json({ error: "Errore fatale: " + err.message });
  }
}

export default async function handler(req, res) {
  res.status(200).json({
    content: [{ text: "Il server sta funzionando correttamente. Se vedi ancora errore, il problema è nella visualizzazione della chat sul frontend." }]
  });
}

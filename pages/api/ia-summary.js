export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { notes } = req.body;

  if (!notes) {
    return res.status(400).json({ summary: null });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Resumí estas notas clínicas de un paciente: ${notes}` }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const summary = data?.choices?.[0]?.message?.content || "No se pudo generar resumen.";

    res.status(200).json({ summary });
  } catch (err) {
    console.error("Error al generar resumen IA:", err);
    res.status(500).json({ summary: null });
  }
}

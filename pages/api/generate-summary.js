
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, message: 'Falta texto para resumir' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Sos un asistente que resume evoluciones clínicas para terapeutas.' },
          { role: 'user', content: `Resumí de forma clara y ordenada estas notas de sesión de un paciente: \n\n${text}` }
        ],
        temperature: 0.4,
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return res.status(200).json({ success: true, summary: data.choices[0].message.content.trim() });
    } else {
      return res.status(500).json({ success: false, message: 'Error generando resumen' });
    }
  } catch (error) {
    console.error('Error en la API de resumen:', error);
    return res.status(500).json({ success: false, message: 'Error interno' });
  }
}

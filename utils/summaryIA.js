
// utils/summaryIA.js

export async function generateSummary(texto) {
  const respuesta = await fetch('/api/summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ texto }),
  });

  const datos = await respuesta.json();
  return datos.resumen;
}

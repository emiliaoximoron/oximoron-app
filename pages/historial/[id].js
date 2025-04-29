
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { generateSummary } from '@/utils/summaryIA';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function HistorialPaciente() {
  const router = useRouter();
  const pacienteId = router.query.id;

  const [notas, setNotas] = useState([]);
  const [notaActual, setNotaActual] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [seleccionadas, setSeleccionadas] = useState([]);

  useEffect(() => {
    if (!pacienteId) return;
    async function fetchNotas() {
      const { data } = await supabase
        .from('session_notes_v2')  // Cambié a 'session_notes_v2'
        .select('*')
        .eq('created_by_user_id', pacienteId)  // Usamos created_by_user_id
        .order('date', { ascending: false });  // Cambié a 'date' en vez de 'created_at'
      setNotas(data || []);
    }
    fetchNotas();
  }, [pacienteId]);

  const guardarNota = async () => {
    if (notaActual.trim() === '') return;
    if (editandoId) {
      await supabase
        .from('session_notes_v2')  // Cambié a 'session_notes_v2'
        .update({ contenido: notaActual })
        .eq('id', editandoId);
      setEditandoId(null);
    } else {
      await supabase.from('session_notes_v2').insert([
        {
          created_by_user_id: pacienteId,  // Usamos created_by_user_id
          contenido: notaActual,
        },
      ]);
    }
    setNotaActual('');
    refreshNotas();
  };

  const refreshNotas = async () => {
    const { data } = await supabase
      .from('session_notes_v2')  // Cambié a 'session_notes_v2'
      .select('*')
      .eq('created_by_user_id', pacienteId)  // Usamos created_by_user_id
      .order('date', { ascending: false });  // Cambié a 'date'
    setNotas(data || []);
  };

  const eliminarNota = async (id) => {
    if (confirm('¿Seguro que querés eliminar esta nota?')) {
      await supabase.from('session_notes_v2').delete().eq('id', id);  // Cambié a 'session_notes_v2'
      refreshNotas();
    }
  };

  const editarNota = (nota) => {
    setNotaActual(nota.contenido);
    setEditandoId(nota.id);
  };

  const cancelarEdicion = () => {
    setNotaActual('');
    setEditandoId(null);
  };

  const toggleSeleccion = (id) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const generarResumen = async () => {
    if (seleccionadas.length === 0) {
      alert('Seleccioná al menos una nota para resumir.');
      return;
    }
    const notasSeleccionadas = notas
      .filter((nota) => seleccionadas.includes(nota.id))
      .map((nota) => nota.contenido)
      .join(' ');

    const resumen = await generateSummary(notasSeleccionadas);

    await supabase.from('session_notes_v2').insert([  // Cambié a 'session_notes_v2'
      {
        created_by_user_id: pacienteId,  // Usamos created_by_user_id
        contenido: resumen,
        es_resumen: true,
      },
    ]);
    setSeleccionadas([]);
    refreshNotas();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-6">Historial Clínico</h1>

        <div className="mb-6">
          <button
            onClick={() => router.push(`/historial/${pacienteId}/resumenes`)}
            className="bg-green-500 text-white p-3 rounded w-full"
          >
            Ver Historial de Resúmenes IA
          </button>
        </div>

        <div className="mb-4 flex flex-col gap-2">
          <textarea
            value={notaActual}
            onChange={(e) => setNotaActual(e.target.value)}
            placeholder="Escribí una nueva nota clínica..."
            className="border rounded p-2 w-full h-32"
          />
          <div className="flex gap-2">
            <button onClick={guardarNota} className="bg-green-500 text-white p-2 rounded">
              {editandoId ? 'Actualizar Nota' : 'Guardar Nota'}
            </button>
            {editandoId && (
              <button onClick={cancelarEdicion} className="bg-gray-400 text-white p-2 rounded">
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSeleccionadas(notas.map((nota) => nota.id))}
            className="bg-green-500 text-white p-2 rounded w-full"
          >
            Seleccionar todas
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-6">Notas Clínicas</h1>

        <div className="flex flex-col gap-4">
          {notas.map((nota) => (
            <div
              key={nota.id}
              className="border p-4 rounded shadow-md flex justify-between items-start"
            >
              <div>
                <input
                  type="checkbox"
                  checked={seleccionadas.includes(nota.id)}
                  onChange={() => toggleSeleccion(nota.id)}
                  className="mr-2"
                />
                <p className="whitespace-pre-line">{nota.contenido}</p>
                {nota.es_resumen && (
                  <p className="text-sm text-blue-500 mt-2">(Resumen IA)</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {!nota.es_resumen && (
                  <>
                    <button onClick={() => editarNota(nota)} className="text-yellow-500">
                      Editar
                    </button>
                    <button onClick={() => eliminarNota(nota.id)} className="text-red-500">
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={generarResumen}
          className="mt-6 bg-purple-600 text-white p-3 rounded w-full"
        >
          Generar Resumen IA
        </button>
      </div>
    </div>
  );
}

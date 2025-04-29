
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ResumenesIA({ params }) {
  const pacienteId = params.id;
  const [resumenes, setResumenes] = useState([]);

  useEffect(() => {
    async function fetchResumenes() {
      const { data } = await supabase
        .from('session_notes')
        .select('*')
        .eq('paciente_id', pacienteId)
        .eq('es_resumen', true)
        .order('created_at', { ascending: true });
      setResumenes(data || []);
    }
    fetchResumenes();
  }, [pacienteId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Resúmenes de IA</h1>

      {resumenes.length === 0 ? (
        <p>No hay resúmenes generados aún.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {resumenes.map((resumen) => (
            <div key={resumen.id} className="border p-4 rounded shadow-md">
              <p className="whitespace-pre-line">{resumen.contenido}</p>
              <p className="text-sm text-gray-400 mt-2">
                Generado el {new Date(resumen.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

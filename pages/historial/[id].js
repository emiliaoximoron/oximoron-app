
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';

export default function HistorialPaciente() {
  const router = useRouter();
  const { id } = router.query;

  const [notes, setNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [summary, setSummary] = useState('');
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  async function fetchData() {
    const { data: patientData } = await supabase.from('patients_v2').select('*').eq('id', id).single();
    setPatient(patientData);

    const { data: notesData } = await supabase
      .from('session_notes')
      .select('*')
      .eq('patient_id', id)
      .order('created_at', { ascending: true });
    setNotes(notesData || []);
  }

  function toggleSelect(noteId) {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(selectedNotes.filter(id => id !== noteId));
    } else {
      setSelectedNotes([...selectedNotes, noteId]);
    }
  }

  function selectAll() {
    if (selectedNotes.length === notes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(notes.map(n => n.id));
    }
  }

  async function generateSummary() {
    const notesContent = notes.filter(n => selectedNotes.includes(n.id)).map(n => n.content).join('\n\n');
    
    if (!notesContent) {
      alert('Seleccioná al menos una nota para generar resumen.');
      return;
    }

    const response = await fetch('/api/generate-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: notesContent })
    });

    const result = await response.json();
    if (result.success) {
      setSummary(result.summary);

      // Guardar el resumen en Supabase
      await supabase.from('session_summaries').insert([{
        patient_id: id,
        summary_text: result.summary
      }]);
      alert('Resumen generado y guardado correctamente.');
    } else {
      alert('Error generando resumen.');
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <Navbar />

      {patient && <h1>Historial de {patient.name}</h1>}

      <button onClick={selectAll} style={{ margin: '10px', padding: '10px' }}>
        {selectedNotes.length === notes.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
      </button>

      <button onClick={generateSummary} style={{ margin: '10px', padding: '10px', backgroundColor: '#4caf50', color: 'white' }}>
        Generar Resumen IA
      </button>

      <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Notas de Sesiones</h2>
          {notes.length === 0 ? (
            <p>No hay notas todavía.</p>
          ) : (
            notes.map(note => (
              <div key={note.id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                <input
                  type="checkbox"
                  checked={selectedNotes.includes(note.id)}
                  onChange={() => toggleSelect(note.id)}
                  style={{ marginRight: '10px' }}
                />
                {note.content}
              </div>
            ))
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h2>Resumen Generado</h2>
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', minHeight: '200px' }}>
            {summary ? summary : 'No hay resumen generado.'}
          </div>
        </div>
      </div>
    </div>
  );
}

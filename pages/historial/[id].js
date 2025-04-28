
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';

export default function VerPaciente() {
  const router = useRouter();
  const { id } = router.query;
  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [nuevaNota, setNuevaNota] = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    if (id) {
      async function fetchPatient() {
        const { data, error } = await supabase.from('patients').select('*').eq('id', id).single();
        if (!error) setPatient(data);
      }
      async function fetchNotes() {
        const { data, error } = await supabase.from('session_notes').select('*').eq('patient_id', id).order('date', { ascending: false });
        if (!error) setNotes(data);
      }
      fetchPatient();
      fetchNotes();
    }
  }, [id]);

  async function handleAddNote(e) {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      alert('No estás autenticado.');
      return;
    }

    if (!fecha || !nuevaNota) {
      alert('Por favor completá la fecha y la nota.');
      return;
    }

    const { error } = await supabase.from('session_notes').insert([{
      patient_id: id,
      note_text: nuevaNota,
      date: fecha,
      created_by_user_id: session.user.id
    }]);

    if (error) {
      console.error(error);
      alert('Error al guardar la nota.');
    } else {
      setNuevaNota('');
      setFecha('');
      alert('Nota guardada exitosamente.');
      router.reload();
    }
  }

  if (!patient) return <p>Cargando paciente...</p>;

  return (
    <div style={{ padding: '40px' }}>
      <Navbar />
      <h1>Paciente: {patient.name}</h1>
      <h2>Diagnóstico: {patient.diagnosis}</h2>

      <form onSubmit={handleAddNote} style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' }}>
        <h3>Agregar nueva nota de sesión</h3>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
        <textarea
          placeholder="Escribir nota de evolución..."
          value={nuevaNota}
          onChange={(e) => setNuevaNota(e.target.value)}
          rows="4"
          required
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Guardar Nota
        </button>
      </form>

      <div style={{ marginTop: '40px' }}>
        <h3>Notas de sesión registradas:</h3>
        {notes.length === 0 ? (
          <p>No hay notas registradas todavía.</p>
        ) : (
          <ul>
            {notes.map((note) => (
              <li key={note.id} style={{ marginBottom: '10px' }}>
                <strong>{note.date}:</strong> {note.note_text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

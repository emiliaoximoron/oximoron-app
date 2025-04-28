
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function NuevoPaciente() {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [mensaje, setMensaje] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje('');

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setMensaje('No estás autenticado.');
      return;
    }

    const { error } = await supabase.from('patients').insert([{
      name: nombre,
      age: edad,
      diagnosis: diagnostico,
      user_id: session.user.id,
    }]);

    if (error) {
      console.error(error);
      setMensaje('Error al guardar el paciente.');
    } else {
      setMensaje('Paciente guardado exitosamente.');
      setNombre('');
      setEdad('');
      setDiagnostico('');
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', backgroundColor: '#e0f7e9', borderRadius: '10px' }}>
      <h1>Nuevo Paciente</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Nombre del paciente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <textarea
          placeholder="Diagnóstico inicial"
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
          rows="4"
          required
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Guardar Paciente
        </button>
      </form>
      {mensaje && <p style={{ marginTop: '20px', color: mensaje.includes('exitosamente') ? 'green' : 'red' }}>{mensaje}</p>}
    </div>
  );
}

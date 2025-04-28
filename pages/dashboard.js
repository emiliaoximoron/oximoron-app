
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    async function fetchPatients() {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error cargando pacientes:', error);
        } else {
          setPatients(data);
        }
      }
    }

    fetchPatients();
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h1>Historial Clínico</h1>
      {patients.length === 0 ? (
        <p>No hay pacientes registrados aún.</p>
      ) : (
        <ul>
          {patients.map(patient => (
            <li key={patient.id}>
              {patient.name} - Resumen IA: {patient.ai_summary || 'Sin resumen'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

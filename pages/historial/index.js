
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Historial() {
  const [patients, setPatients] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchPatients() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', session.user.id);
        if (!error) {
          setPatients(data);
        }
      } else {
        router.push('/login');
      }
    }
    fetchPatients();
  }, [router]);

  return (
    <div style={{ padding: '40px' }}>
      <h1>Historias Clínicas</h1>
      <button
        onClick={() => router.push('/pacientes/nuevo')}
        style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        + Nuevo Paciente
      </button>
      {patients.length === 0 ? (
        <p>No hay pacientes registrados aún.</p>
      ) : (
        <ul>
          {patients.map((patient) => (
            <li key={patient.id} style={{ marginBottom: '10px' }}>
              {patient.name} ({patient.age} años) - {patient.diagnosis}
              <button
                onClick={() => router.push(`/historial/${patient.id}`)}
                style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Ver Paciente
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

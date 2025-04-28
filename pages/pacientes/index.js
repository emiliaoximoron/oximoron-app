
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';

export default function Pacientes() {
  const [patients, setPatients] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchPatients() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from('patients_v2')
          .select('id, name, birth_date, diagnosis')
          .eq('user_id', session.user.id)
          .order('name', { ascending: true });

        if (!error) setPatients(data);
      } else {
        router.push('/login');
      }
    }
    fetchPatients();
  }, [router]);

  return (
    <div style={{ padding: '20px' }}>
      <Navbar />
      <h1>Listado de Pacientes</h1>

      {patients.length === 0 ? (
        <p>No hay pacientes registrados.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>Nombre</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>Fecha de Nacimiento</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>Diagnóstico</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{patient.name}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{patient.birth_date}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{patient.diagnosis}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
                  <button
                    onClick={() => router.push(`/historial/${patient.id}`)}
                    style={{ backgroundColor: '#4caf50', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px' }}
                  >
                    Ver Historial
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const [date, setDate] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserName(session.user.email.split('@')[0]);
      } else {
        router.push('/login');
      }
    }
    fetchSession();
  }, [router]);

  async function handleLogout() {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Querés cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#e53935',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await supabase.auth.signOut();
      router.push('/login');
    }
  }

  function handleDateClick(date) {
    router.push('/agenda');
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Bienvenido, {userName}</h1>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e53935', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div onClick={() => router.push('/historial')} style={{ backgroundColor: '#e0f7e9', padding: '20px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}>
          <h2>📋 Historial Clínico</h2>
        </div>
        <div onClick={() => router.push('/agenda')} style={{ backgroundColor: '#e0f7e9', padding: '20px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}>
          <h2>📅 Agenda</h2>
        </div>
        <div onClick={() => router.push('/facturacion')} style={{ backgroundColor: '#e0f7e9', padding: '20px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}>
          <h2>💵 Facturación</h2>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Calendario</h2>
        <Calendar onClickDay={handleDateClick} value={date} />
      </div>
    </div>
  );
}

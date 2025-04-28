
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import 'react-calendar/dist/Calendar.css';

const Calendar = dynamic(() => import('react-calendar'), { ssr: false });

export default function Agenda() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [isSession, setIsSession] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .eq('created_by_user_id', session.user.id);

        const { data: patientsData } = await supabase
          .from('patients')
          .select('id, name, age')
          .eq('user_id', session.user.id);

        if (eventsData) setEvents(eventsData);
        if (patientsData) setPatients(patientsData);
      } else {
        router.push('/login');
      }
    }
    fetchData();
  }, [router]);

  function handleDateClick(selectedDate) {
    setDate(selectedDate);
    setShowForm(true);
    setIsSession(false);
    setSelectedPatientId('');
    setNewEventTitle('');
  }

  async function handleAddEvent(e) {
    e.preventDefault();
    const formattedDate = date.toISOString().split('T')[0];
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from('events').insert([{
      title: newEventTitle || (isSession ? getPatientName(selectedPatientId) : ''),
      date: formattedDate,
      type: isSession ? 'sesion' : 'personal',
      patient_id: isSession ? selectedPatientId : null,
      created_by_user_id: session.user.id
    }]);
    if (!error) {
      setNewEventTitle('');
      setShowForm(false);
      router.reload();
    } else {
      alert('Error al guardar el evento');
    }
  }

  function getEventsForDate(d) {
    const formatted = d.toISOString().split('T')[0];
    return events.filter(e => e.date === formatted);
  }

  function getPatientName(id) {
    const patient = patients.find(p => p.id === id);
    return patient ? patient.name : '';
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Agenda</h1>

      <Calendar
        onClickDay={handleDateClick}
        value={date}
        tileContent={({ date }) => {
          const dayEvents = getEventsForDate(date);
          return dayEvents.length > 0 ? (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.7em' }}>
              {dayEvents.map((e, i) => (
                <li key={i} style={{ color: e.type === 'sesion' ? '#BA68C8' : '#FFB74D' }}>{e.title}</li>
              ))}
            </ul>
          ) : null;
        }}
      />

      {showForm && (
        <form onSubmit={handleAddEvent} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
          <h2>Nuevo evento para el {date.toISOString().split('T')[0]}</h2>

          <label>
            Tipo de evento:
            <select value={isSession ? 'sesion' : 'personal'} onChange={(e) => setIsSession(e.target.value === 'sesion')} style={{ padding: '8px', margin: '10px 0' }}>
              <option value="personal">Evento Personal</option>
              <option value="sesion">Sesión con Paciente</option>
            </select>
          </label>

          {isSession ? (
            <label>
              Seleccionar paciente:
              <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)} required style={{ padding: '8px', margin: '10px 0' }}>
                <option value="">Seleccionar</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.age} años)
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <input
              type="text"
              placeholder="Título del evento"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              required
              style={{ padding: '10px', marginBottom: '10px' }}
            />
          )}

          <button type="submit" style={{ padding: '10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px' }}>
            Guardar Evento
          </button>
        </form>
      )}

      <div style={{ marginTop: '40px' }}>
        <h2>Eventos para {date.toISOString().split('T')[0]}:</h2>
        <ul>
          {getEventsForDate(date).length === 0 ? (
            <li>No hay eventos para esta fecha.</li>
          ) : (
            getEventsForDate(date).map((event) => (
              <li key={event.id} style={{ color: event.type === 'sesion' ? '#BA68C8' : '#FFB74D' }}>
                {event.title}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

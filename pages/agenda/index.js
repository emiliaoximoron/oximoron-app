
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
  const [editingEvent, setEditingEvent] = useState(null);
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
    setEditingEvent(null);
  }

  function getPatientName(id) {
    const patient = patients.find(p => p.id === id);
    return patient ? patient.name : '';
  }

  async function handleAddOrEditEvent(e) {
    e.preventDefault();
    const formattedDate = date.toISOString().split('T')[0];
    const { data: { session } } = await supabase.auth.getSession();

    if (isSession && !selectedPatientId) {
      alert('Por favor seleccioná un paciente para guardar la sesión.');
      return;
    }

    if (editingEvent) {
      const { error } = await supabase
        .from('events')
        .update({
          title: newEventTitle || (isSession ? getPatientName(selectedPatientId) : ''),
          type: isSession ? 'sesion' : 'personal',
          patient_id: isSession ? selectedPatientId : null
        })
        .eq('id', editingEvent.id);

      if (!error) {
        setShowForm(false);
        setEditingEvent(null);
        router.reload();
      } else {
        alert('Error al actualizar el evento.');
      }
    } else {
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
        alert('Error al guardar el evento.');
      }
    }
  }

  async function handleDeleteEvent(id) {
    if (confirm('¿Seguro que querés eliminar este evento?')) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (!error) {
        router.reload();
      } else {
        alert('Error al eliminar el evento.');
      }
    }
  }

  function getEventsForDate(d) {
    const formatted = d.toISOString().split('T')[0];
    return events.filter(e => e.date === formatted);
  }

  function startEditEvent(event) {
    setEditingEvent(event);
    setDate(new Date(event.date));
    setIsSession(event.type === 'sesion');
    setNewEventTitle(event.title);
    setSelectedPatientId(event.patient_id || '');
    setShowForm(true);
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => router.back()} style={{ padding: '10px', backgroundColor: '#757575', color: 'white', border: 'none', borderRadius: '5px' }}>
          Atrás
        </button>
        <button onClick={() => router.push('/dashboard')} style={{ padding: '10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px' }}>
          Home
        </button>
      </div>

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
        <form onSubmit={handleAddOrEditEvent} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
          <h2>{editingEvent ? 'Editar evento' : 'Nuevo evento'} para el {date.toISOString().split('T')[0]}</h2>

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
            {editingEvent ? 'Actualizar' : 'Guardar'} Evento
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
              <li key={event.id} style={{ color: event.type === 'sesion' ? '#BA68C8' : '#FFB74D', marginBottom: '10px' }}>
                {event.title}
                <button onClick={() => startEditEvent(event)} style={{ marginLeft: '10px', backgroundColor: '#2196f3', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>
                  Editar
                </button>
                <button onClick={() => handleDeleteEvent(event.id)} style={{ marginLeft: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>
                  Eliminar
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

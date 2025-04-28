
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Agenda() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchEvents() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('created_by_user_id', session.user.id);
        if (!error) {
          setEvents(data);
        }
      } else {
        router.push('/login');
      }
    }
    fetchEvents();
  }, [router]);

  function handleDateClick(selectedDate) {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const eventTitle = prompt('¿Qué querés agendar para el ' + formattedDate + '?');
    if (eventTitle) {
      async function addEvent() {
        const { data: { session } } = await supabase.auth.getSession();
        await supabase.from('events').insert([{
          title: eventTitle,
          date: formattedDate,
          type: 'personal',
          created_by_user_id: session.user.id
        }]);
        router.reload();
      }
      addEvent();
    }
  }

  function getEventsForDate(d) {
    const formatted = d.toISOString().split('T')[0];
    return events.filter(e => e.date === formatted);
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
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.8em', color: '#4caf50' }}>
              {dayEvents.map((e, i) => <li key={i}>{e.title}</li>)}
            </ul>
          ) : null;
        }}
      />
    </div>
  );
}

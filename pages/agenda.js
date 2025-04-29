import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';
import 'react-calendar/dist/Calendar.css';

const Calendar = dynamic(() => import('react-calendar'), { ssr: false });
export default function Agenda() { return (<h1>Agenda - Aquí irá tu calendario completo.</h1>); }
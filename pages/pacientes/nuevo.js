
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';

export default function NuevoPaciente() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    health_insurance: '',
    family_group: '',
    diagnosis: '',
    therapy_type: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      alert('No estás autenticado.');
      return;
    }

    const { error } = await supabase.from('patients_v2').insert([{
      name: formData.name,
      birth_date: formData.birth_date,
      health_insurance: formData.health_insurance,
      family_group: formData.family_group,
      diagnosis: formData.diagnosis,
      therapy_type: formData.therapy_type,
      user_id: session.user.id
    }]);

    if (error) {
      console.error(error);
      alert('Error al crear paciente.');
    } else {
      alert('Paciente creado exitosamente.');
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Navbar />
      <h1>Registrar Nuevo Paciente</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', gap: '10px' }}>
        <input name="name" placeholder="Nombre completo" onChange={handleChange} required />
        <input type="date" name="birth_date" placeholder="Fecha de nacimiento" onChange={handleChange} required />
        <input name="health_insurance" placeholder="Obra social" onChange={handleChange} />
        <input name="family_group" placeholder="Grupo familiar" onChange={handleChange} />
        <input name="diagnosis" placeholder="Diagnóstico" onChange={handleChange} required />
        <input name="therapy_type" placeholder="Tipo de terapia" onChange={handleChange} required />
        <button type="submit" style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}>
          Guardar Paciente
        </button>
      </form>
    </div>
  );
}

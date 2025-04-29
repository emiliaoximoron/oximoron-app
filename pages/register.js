
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import emailjs from 'emailjs-com';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.name }
      }
    });

    if (error) {
      console.error('Error registrando usuario:', error.message);
      alert('Error al registrarse: ' + error.message);
      return;
    }

    try {
      await emailjs.send(
        'service_fcbqoau',
        'template_s2dneon',
        {
          to_email: formData.email,
          from_name: 'Oxímoron',
          user_name: formData.name
        },
        'shnohtbQHEqpLPfJb'
      );

      alert('Te registraste correctamente. Revisá tu casilla de correo para verificar tu cuenta.');
      setFormData({ name: '', email: '', password: '' });
      router.push('/login');

    } catch (emailError) {
      console.error('Error enviando email:', emailError.text);
      alert('Registro realizado pero falló el envío de email. Por favor, contactá soporte.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Registrarse</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
        <input type="text" name="name" placeholder="Nombre completo" value={formData.name} onChange={handleChange} style={{ padding: '10px' }} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={{ padding: '10px' }} required />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} style={{ padding: '10px' }} required />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#81c784', color: 'white', border: 'none', borderRadius: '5px' }}>Registrarse</button>
      </form>
    </div>
  );
}

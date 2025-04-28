
import Image from 'next/image';

export default function Login() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sección de la imagen */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Image 
          src="/therapy.jpg" 
          alt="Imagen de terapia" 
          fill 
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Sección del formulario */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1>Login</h1>
        <form style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
          <input type="email" placeholder="Email" style={{ marginBottom: '10px', padding: '10px' }} />
          <input type="password" placeholder="Contraseña" style={{ marginBottom: '10px', padding: '10px' }} />
          <button type="submit" style={{ padding: '10px' }}>Ingresar</button>
        </form>
      </div>
    </div>
  );
}

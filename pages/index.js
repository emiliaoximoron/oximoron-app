
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#e0f7e9',
      position: 'relative'
    }}>
      {/* Fondo de imagen */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.2
      }}>
        <Image
          src="/therapy.jpg"
          alt="Fondo terapia"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Contenido principal */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
      }}>
        <h1 style={{ color: '#2e7d32' }}>Bienvenido a Oxímoron</h1>

        <Link href="/login" passHref legacyBehavior>
          <a style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            Iniciar Sesión
          </a>
        </Link>

        <Link href="/register" passHref legacyBehavior>
          <a style={{
            padding: '10px 20px',
            backgroundColor: '#81c784',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            Registrarse
          </a>
        </Link>
      </div>
    </div>
  );
}

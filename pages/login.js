
export default function Login() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Iniciar Sesión</h1>
      <form style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
        <input type="email" placeholder="Email" style={{ padding: '10px' }} />
        <input type="password" placeholder="Contraseña" style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px' }}>Ingresar</button>
      </form>
    </div>
  );
}

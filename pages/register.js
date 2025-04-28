
export default function Register() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Registrarse</h1>
      <form style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
        <input type="text" placeholder="Nombre completo" style={{ padding: '10px' }} />
        <input type="email" placeholder="Email" style={{ padding: '10px' }} />
        <input type="password" placeholder="Contraseña" style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#81c784', color: 'white', border: 'none', borderRadius: '5px' }}>Registrarse</button>
      </form>
    </div>
  );
}


import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      <button onClick={() => router.back()} style={{ padding: '10px', backgroundColor: '#757575', color: 'white', border: 'none', borderRadius: '5px' }}>
        Atrás
      </button>
      <button onClick={() => router.push('/dashboard')} style={{ padding: '10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px' }}>
        Home
      </button>
    </div>
  );
}

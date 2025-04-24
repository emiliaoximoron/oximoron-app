import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Error al iniciar sesión: " + error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Iniciar sesión en Oxímoron 💚</h1>
      <form onSubmit={handleLogin} style={{ marginTop: "1rem" }}>
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ display: "block", marginBottom: "1rem", padding: "0.5rem", width: "100%" }} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ display: "block", marginBottom: "1rem", padding: "0.5rem", width: "100%" }} />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Entrar</button>
      </form>
      <p style={{ marginTop: "1rem" }}>¿No tenés cuenta? <a href="/register">Registrate acá</a></p>
    </div>
  );
}

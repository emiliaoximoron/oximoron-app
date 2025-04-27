import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data?.user) {
      // Guardar el user_id en localStorage
      localStorage.setItem("user_id", data.user.id);

      router.push("/dashboard");
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", marginTop: "2rem" }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin} style={{ marginTop: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Ingresar
        </button>
      </form>
    </div>
  );
}

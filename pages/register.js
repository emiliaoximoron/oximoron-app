import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import emailjs from "@emailjs/browser";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert("Error al registrar: " + error.message);
      return;
    }

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        { user_email: email, user_password: password },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );
    } catch (err) {
      console.error("Error al enviar mail:", err);
    }

    router.push("/dashboard");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Crear cuenta en Oxímoron 💚</h1>
      <form onSubmit={handleRegister} style={{ marginTop: "1rem" }}>
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ display: "block", marginBottom: "1rem", padding: "0.5rem", width: "100%" }} />
        <input type="text" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ display: "block", marginBottom: "1rem", padding: "0.5rem", width: "100%" }} />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Registrarme</button>
      </form>
      <p style={{ marginTop: "1rem" }}>¿Ya tenés cuenta? <a href="/login">Iniciar sesión</a></p>
    </div>
  );
}

import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import styles from "../styles/Login.module.css";

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
      localStorage.setItem("user_id", data.user.id);
      router.push("/dashboard");
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/register");
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageSide}>
        <img src="/therapy.jpg" alt="Terapeuta y paciente" className={styles.image} />
      </div>
      <div className={styles.formSide}>
        <h1 className={styles.titulo}>Bienvenido a Oxímoron</h1>
        <p className={styles.slogan}>Simplificar el pensar, dignificar el sentir.</p>
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
          <button type="button" onClick={handleRegisterRedirect} className={styles.registerBtn}>
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

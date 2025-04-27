import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function HistoriasClinicas() {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Sesión no encontrada. Por favor, iniciá sesión nuevamente.");
      setPatients([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setPatients(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !notes) return;

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Sesión no encontrada. Por favor, iniciá sesión nuevamente.");
      return;
    }

    const { error } = await supabase.from("patients").insert({
      name,
      notes,
      user_id: userId,
    });

    if (!error) {
      setName("");
      setNotes("");
      fetchPatients();
    } else {
      alert("Error al guardar el paciente.");
    }
  };

  const generateSummary = async (patient) => {
    setGeneratingId(patient.id);

    const res = await fetch("/api/ia-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: patient.notes }),
    });

    const data = await res.json();
    if (data?.summary) {
      alert("Resumen IA para " + patient.name + ":\n\n" + data.summary);
    } else {
      alert("No se pudo generar el resumen.");
    }

    setGeneratingId(null);
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2>🧠 Historias clínicas</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Nombre del paciente"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
        />
        <textarea
          placeholder="Notas clínicas"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          required
          rows="3"
          style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Guardar paciente
        </button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h3>Mis pacientes registrados</h3>
      {loading ? <p>Cargando...</p> : (
        <ul>
          {patients.map((p) => (
            <li key={p.id} style={{ marginBottom: "1rem" }}>
              <strong>{p.name}</strong><br />
              <em>{p.notes}</em>
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  onClick={() => generateSummary(p)}
                  disabled={generatingId === p.id}
                  style={{ fontSize: "0.8rem" }}
                >
                  {generatingId === p.id ? "Generando..." : "🧠 Generar resumen IA"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

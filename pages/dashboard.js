import { useState } from "react";
import withAuth from "../components/withAuth";
import HistoriasClinicas from "../components/HistoriasClinicas";
import Agenda from "../components/Agenda";
import Facturacion from "../components/Facturacion";
import IA from "../components/IA";

function Dashboard() {
  const [tab, setTab] = useState("historias");

  return (
    <div style={{ display: "flex", fontFamily: "sans-serif", height: "100vh" }}>
      <div style={{ width: "200px", background: "#d7f5e9", padding: "1rem" }}>
        <h2>Oxímoron 💚</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><button onClick={() => setTab("historias")}>🧠 Historias clínicas</button></li>
          <li><button onClick={() => setTab("agenda")}>📆 Agenda</button></li>
          <li><button onClick={() => setTab("facturacion")}>💸 Facturación</button></li>
          <li><button onClick={() => setTab("ia")}>📊 IA y gráficos</button></li>
        </ul>
      </div>
      <div style={{ flex: 1, padding: "2rem" }}>
        {tab === "historias" && <HistoriasClinicas />}
        {tab === "agenda" && <Agenda />}
        {tab === "facturacion" && <Facturacion />}
        {tab === "ia" && <IA />}
      </div>
    </div>
  );
}

export default withAuth(Dashboard);

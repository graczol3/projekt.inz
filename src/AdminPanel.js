// AdminPanel.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

export default function AdminPanel() {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("admin");
    navigate("/", { replace: true }); // ekran wyboru panelu
  };

  const items = [
    { key: "dashboard", title: "Dashboard", desc: "Podgląd KPI i aktywności", to: "/admin/dashboard", icon: "📊" },
    { key: "properties", title: "Nieruchomości", desc: "Lista i edycja lokali", to: "/admin/properties", icon: "🏢" },
    { key: "reservations", title: "Rezerwacje", desc: "Wnioski i akceptacje", to: "/admin/reservations", icon: "📝" },
    { key: "documents", title: "Dokumenty", desc: "Umowy i ogłoszenia", to: "/admin/documents", icon: "📄" },
    { key: "tickets", title: "Zgłoszenia", desc: "Usterki i statusy", to: "/admin/tickets", icon: "🛠️" },
    { key: "reports", title: "Raporty", desc: "Analizy i eksport", to: "/admin/reports", icon: "📈" },
    { key: "users", title: "Użytkownicy", desc: "Najemcy i role", to: "/admin/users", icon: "👥" },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="brand">
          <div className="logo">🏙️</div>
          <div className="brand-name">Panel Admina</div>
        </div>

        <nav className="menu">
          <button className="menu-item" onClick={() => navigate("/admin/dashboard")}>📊 Dashboard</button>
          <button className="menu-item" onClick={() => navigate("/admin/properties")}>🏢 Nieruchomości</button>
          <button className="menu-item" onClick={() => navigate("/admin/reservations")}>📝 Rezerwacje</button>
          <button className="menu-item" onClick={() => navigate("/admin/documents")}>📄 Dokumenty</button>
          <button className="menu-item" onClick={() => navigate("/admin/tickets")}>🛠️ Zgłoszenia</button>
          <button className="menu-item" onClick={() => navigate("/admin/reports")}>📈 Raporty</button>
          <button className="menu-item" onClick={() => navigate("/admin/users")}>👥 Użytkownicy</button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn light" onClick={logout}>Wyloguj</button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Witaj w panelu</h1>
            <p className="muted">Zarządzaj zasobami, rezerwacjami i zgłoszeniami</p>
          </div>
          <div className="admin-user">
            <div className="avatar">AD</div>
            <div className="meta">
              <div className="name">Administrator</div>
              <div className="role">Full access</div>
            </div>
          </div>
        </header>

        <section className="cards-grid">
          {items.map(i => (
            <div className="card tile" key={i.key} onClick={() => navigate(i.to)} role="button" tabIndex={0}>
              <div className="tile-icon">{i.icon}</div>
              <div className="tile-title">{i.title}</div>
              <div className="tile-desc">{i.desc}</div>
              <div className="tile-cta">Przejdź →</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    buildings: 12,
    apartments: 85,
    tenants: 73,
    income: 124500,
  });

  const [bookings, setBookings] = useState([
    { id: "R-1021", tenant: "Jan Kowalski", flat: "B-12", date: "2025-11-09", status: "pending" },
    { id: "R-1020", tenant: "Anna Nowak", flat: "A-07", date: "2025-11-08", status: "approved" },
    { id: "R-1019", tenant: "Piotr Wiśniewski", flat: "C-03", date: "2025-11-07", status: "rejected" },
  ]);

  const [tickets, setTickets] = useState([
    { id: "T-3004", title: "Awaria pralki", priority: "medium" },
    { id: "T-3003", title: "Wyciek w łazience", priority: "high" },
    { id: "T-3002", title: "Uszkodzona żarówka", priority: "low" },
  ]);

  // miejsce na przyszły fetch z API
  useEffect(() => {
    // tutaj podmienisz na realne API po stronie backendu
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Dashboard — podsumowanie</h2>

      <div className="stats-grid">
        <div className="stat-tile tile-blue">
          <h3>Budynki</h3>
          <p>{stats.buildings}</p>
        </div>
        <div className="stat-tile tile-green">
          <h3>Mieszkania</h3>
          <p>{stats.apartments}</p>
        </div>
        <div className="stat-tile tile-orange">
          <h3>Najemcy</h3>
          <p>{stats.tenants}</p>
        </div>
        <div className="stat-tile tile-purple">
          <h3>Przychody</h3>
          <p>{stats.income.toLocaleString()} zł</p>
        </div>
      </div>

      <div className="two-col">
        <div className="panel">
          <h3>Ostatnie rezerwacje</h3>
          <ul className="list">
            {bookings.map(b => (
              <li key={b.id}>
                <span>{b.id} • {b.tenant} • {b.flat} • {b.date}</span>
                <span className={`badge ${b.status}`}>{b.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3>Zgłoszenia techniczne</h3>
          <ul className="list">
            {tickets.map(t => (
              <li key={t.id}>
                <span>{t.id} • {t.title}</span>
                <span className={`badge ${t.priority}`}>{t.priority}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import "./Reservations.css";

const initial = [
  { id: "R-1021", date: "2025-11-09", user: { name: "Jan Kowalski", email: "jan@ex.com", phone: "500-100-200" }, flat: "B-12", price: 3200, status: "pending", note: "" },
  { id: "R-1020", date: "2025-11-08", user: { name: "Anna Nowak", email: "anna@ex.com", phone: "511-222-333" }, flat: "A-07", price: 2900, status: "approved", note: "Kaucja wpłacona" },
  { id: "R-1019", date: "2025-11-07", user: { name: "Piotr Wiśniewski", email: "piotr@ex.com", phone: "522-333-444" }, flat: "C-03", price: 2500, status: "rejected", note: "Brak dokumentów" },
];

export default function Reservations() {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const matchesQuery =
        !query ||
        r.id.toLowerCase().includes(query.toLowerCase()) ||
        r.user.name.toLowerCase().includes(query.toLowerCase()) ||
        r.user.email.toLowerCase().includes(query.toLowerCase()) ||
        r.flat.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = filter === "all" ? true : r.status === filter;
      return matchesQuery && matchesStatus;
    });
  }, [rows, query, filter]);

  const setStatus = (id, status) =>
    setRows(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));

  const approve = id => setStatus(id, "approved");
  const reject = id => setStatus(id, "rejected");

  return (
    <div className="reservations">
      <h2>Rezerwacje</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Szukaj: ID, najemca, e-mail, lokal…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Wszystkie</option>
          <option value="pending">Oczekujące</option>
          <option value="approved">Zaakceptowane</option>
          <option value="rejected">Odrzucone</option>
        </select>
      </div>

      <div className="table">
        <div className="thead">
          <div>ID</div>
          <div>Data</div>
          <div>Użytkownik</div>
          <div>Lokal</div>
          <div>Cena</div>
          <div>Status</div>
          <div>Decyzja</div>
        </div>
        {filtered.map(r => (
          <div className="trow" key={r.id}>
            <div>{r.id}</div>
            <div>{r.date}</div>
            <div>
              <div className="user-name">{r.user.name}</div>
              <div className="user-meta">{r.user.email} • {r.user.phone}</div>
            </div>
            <div>{r.flat}</div>
            <div>{r.price.toLocaleString()} zł</div>
            <div>
              <span className={`badge ${r.status}`}>{r.status}</span>
            </div>
            <div className="actions">
              <button className="btn approve" onClick={() => approve(r.id)}>Akceptuj</button>
              <button className="btn reject" onClick={() => reject(r.id)}>Odrzuć</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty">Brak wyników dla wybranych filtrów.</div>
        )}
      </div>
    </div>
  );
}

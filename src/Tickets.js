import React, { useMemo, useState } from "react";
import "./Tickets.css";

const seed = [
  { id: "T-3101", date: "2025-11-10", flat: "A-07", tenant: "Jan Kowalski", phone: "500-100-200", title: "Wyciek pod zlewem", priority: "high",    status: "open" },
  { id: "T-3099", date: "2025-11-08", flat: "B-12", tenant: "Anna Nowak",    phone: "511-222-333", title: "Grzejnik nie grzeje", priority: "medium", status: "in_progress" },
  { id: "T-3097", date: "2025-11-05", flat: "C-03", tenant: "Piotr Wiśn.",   phone: "522-333-444", title: "Uszkodzone gniazdko", priority: "low",    status: "resolved" },
];

export default function Tickets() {
  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [newT, setNewT] = useState({
    flat: "", tenant: "", phone: "", title: "", priority: "medium"
  });

  const filtered = useMemo(() => {
    return rows.filter(t => {
      const matchQ =
        !q ||
        t.id.toLowerCase().includes(q.toLowerCase()) ||
        t.flat.toLowerCase().includes(q.toLowerCase()) ||
        t.tenant.toLowerCase().includes(q.toLowerCase()) ||
        t.title.toLowerCase().includes(q.toLowerCase());
      const matchS = filterStatus === "all" ? true : t.status === filterStatus;
      const matchP = filterPriority === "all" ? true : t.priority === filterPriority;
      return matchQ && matchS && matchP;
    });
  }, [rows, q, filterStatus, filterPriority]);

  const setStatus = (id, status) =>
    setRows(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));

  const setPriority = (id, priority) =>
    setRows(prev => prev.map(t => (t.id === id ? { ...t, priority } : t)));

  const addTicket = e => {
    e.preventDefault();
    if (!newT.flat.trim() || !newT.title.trim()) return;
    const id = `T-${Math.floor(Math.random() * 900000) + 100000}`;
    const date = new Date().toISOString().slice(0, 10);
    setRows(prev => [
      { id, date, status: "open", ...newT },
      ...prev,
    ]);
    setNewT({ flat: "", tenant: "", phone: "", title: "", priority: "medium" });
  };

  const remove = id => setRows(prev => prev.filter(t => t.id !== id));

  return (
    <div className="tickets">
      <h2>Zgłoszenia techniczne</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Szukaj: ID, lokal, najemca, tytuł…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Wszystkie statusy</option>
          <option value="open">Otwarte</option>
          <option value="in_progress">W toku</option>
          <option value="resolved">Zamknięte</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="all">Wszystkie priorytety</option>
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>
      </div>

      <div className="grid">
        <div className="panel">
          <h3>Nowe zgłoszenie</h3>
          <form className="form" onSubmit={addTicket}>
            <div className="row">
              <input placeholder="Lokal (np. A-07)" value={newT.flat} onChange={e => setNewT(s => ({ ...s, flat: e.target.value }))} />
              <select value={newT.priority} onChange={e => setNewT(s => ({ ...s, priority: e.target.value }))}>
                <option value="low">Niski</option>
                <option value="medium">Średni</option>
                <option value="high">Wysoki</option>
              </select>
            </div>
            <div className="row">
              <input placeholder="Najemca" value={newT.tenant} onChange={e => setNewT(s => ({ ...s, tenant: e.target.value }))} />
              <input placeholder="Telefon" value={newT.phone} onChange={e => setNewT(s => ({ ...s, phone: e.target.value }))} />
            </div>
            <textarea rows={3} placeholder="Opis usterki" value={newT.title} onChange={e => setNewT(s => ({ ...s, title: e.target.value }))} />
            <div className="actions">
              <button className="btn primary" type="submit">Dodaj zgłoszenie</button>
              <button className="btn light" type="reset" onClick={() => setNewT({ flat: "", tenant: "", phone: "", title: "", priority: "medium" })}>Wyczyść</button>
            </div>
          </form>
        </div>

        <div className="panel">
          <h3>Lista zgłoszeń ({filtered.length})</h3>
          <div className="table head">
            <div>ID</div>
            <div>Data</div>
            <div>Lokal</div>
            <div>Najemca</div>
            <div>Opis</div>
            <div>Priorytet</div>
            <div>Status</div>
            <div>Akcje</div>
          </div>

          {filtered.map(t => (
            <div className="table row" key={t.id}>
              <div>{t.id}</div>
              <div>{t.date}</div>
              <div>{t.flat}</div>
              <div>
                <div className="user-name">{t.tenant || "-"}</div>
                <div className="user-meta">{t.phone || "-"}</div>
              </div>
              <div className="ellipsis">{t.title}</div>
              <div>
                <select className={`badge ${t.priority}`} value={t.priority} onChange={e => setPriority(t.id, e.target.value)}>
                  <option value="low">niski</option>
                  <option value="medium">średni</option>
                  <option value="high">wysoki</option>
                </select>
              </div>
              <div>
                <select className={`badge ${t.status}`} value={t.status} onChange={e => setStatus(t.id, e.target.value)}>
                  <option value="open">otwarte</option>
                  <option value="in_progress">w toku</option>
                  <option value="resolved">zamknięte</option>
                </select>
              </div>
              <div className="actions">
                <button className="btn light" onClick={() => alert("Przypisz wykonawcę — funkcja do rozbudowy")}>Przypisz</button>
                <button className="btn danger" onClick={() => remove(t.id)}>Usuń</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty">Brak zgłoszeń dla wybranych filtrów.</div>}
        </div>
      </div>
    </div>
  );
}

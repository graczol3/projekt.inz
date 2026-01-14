import React, { useMemo, useRef, useState } from "react";
import "./DocumentsNotices.css";

export default function DocumentsNotices() {
  // dokumenty (nazwa, typ, rozmiar, data)
  const [docs, setDocs] = useState([
    { id: "D-1003", name: "Regulamin najmu.pdf", type: "pdf", size: 234_112, date: "2025-11-06" },
    { id: "D-1002", name: "Uchwała 12-2025.pdf", type: "pdf", size: 145_008, date: "2025-11-03" },
    { id: "D-1001", name: "Wzór umowy najmu.docx", type: "docx", size: 84_512, date: "2025-10-28" },
  ]);

  // umowy najmu (admin widzi wszystkie)
  const [contracts, setContracts] = useState([
    { id: "C-2025-001", tenantEmail: "jan.kowalski@example.com", flat: "A-07", start: "2025-11-01", end: "2026-10-31", rent: 2900, file: "/files/C-2025-001.pdf", status: "active" },
    { id: "C-2024-042", tenantEmail: "anna.nowak@example.com", flat: "B-12", start: "2024-01-01", end: "2024-12-31", rent: 2700, file: "/files/C-2024-042.pdf", status: "archived" },
  ]);

  // ogłoszenia (tytuł, treść, widoczność)
  const [notices, setNotices] = useState([
    { id: "N-2003", title: "Przegląd instalacji 15.11", body: "Prosimy o dostęp do mieszkań w godzinach 9:00–15:00.", audience: "tenants", date: "2025-11-10", pinned: true },
    { id: "N-2002", title: "Nowe miejsca parkingowe", body: "Dostępne od grudnia, szczegóły w administracji.", audience: "all", date: "2025-11-05", pinned: false },
  ]);

  // formularze
  const [noticeForm, setNoticeForm] = useState({ title: "", body: "", audience: "all", pinned: false });
  const [query, setQuery] = useState("");
  const fileInputRef = useRef(null);

  // filtry
  const filteredDocs = useMemo(() => {
    return docs.filter(d => !query || d.name.toLowerCase().includes(query.toLowerCase()));
  }, [docs, query]);

  const filteredNotices = useMemo(() => {
    return notices.filter(n =>
      !query ||
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.body.toLowerCase().includes(query.toLowerCase())
    );
  }, [notices, query]);

  const filteredContracts = useMemo(() => {
    const q = query.toLowerCase();
    return contracts.filter(c =>
      !query ||
      c.id.toLowerCase().includes(q) ||
      c.tenantEmail.toLowerCase().includes(q) ||
      c.flat.toLowerCase().includes(q)
    );
  }, [contracts, query]);

  // dodanie dokumentów (wielokrotny wybór)
  const onAddDocs = e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const now = new Date().toISOString().slice(0,10);
    const mapped = files.map((f) => ({
      id: `D-${Math.floor(Math.random()*900000)+100000}`,
      name: f.name,
      type: f.name.split(".").pop()?.toLowerCase() || "file",
      size: f.size,
      date: now,
      _file: f, // trzymamy w pamięci do wysyłki na backend
    }));
    setDocs(prev => [...mapped, ...prev]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeDoc = id => setDocs(prev => prev.filter(d => d.id !== id));

  // dodanie ogłoszenia
  const publishNotice = e => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.body.trim()) return;
    setNotices(prev => [
      {
        id: `N-${Math.floor(Math.random()*900000)+100000}`,
        date: new Date().toISOString().slice(0,10),
        ...noticeForm,
      },
      ...prev,
    ]);
    setNoticeForm({ title: "", body: "", audience: "all", pinned: false });
  };

  const removeNotice = id => setNotices(prev => prev.filter(n => n.id !== id));

  return (
    <div className="docs-notices">
      <h2>Dokumenty i ogłoszenia</h2>

      <div className="topbar">
        <input
          type="text"
          placeholder="Szukaj w dokumentach, umowach i ogłoszeniach…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <label className="upload">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={onAddDocs}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
          />
          Dodaj dokumenty
        </label>
      </div>

      <div className="grid">
        {/* Dokumenty ogólne */}
        <div className="panel">
          <h3>Dokumenty ({filteredDocs.length})</h3>
          <div className="table head">
            <div>Nazwa</div>
            <div>Typ</div>
            <div>Rozmiar</div>
            <div>Data</div>
            <div>Akcje</div>
          </div>
          {filteredDocs.map(d => (
            <div className="table row" key={d.id}>
              <div className="ellipsis">{d.name}</div>
              <div>{d.type}</div>
              <div>{(d.size/1024).toFixed(0)} KB</div>
              <div>{d.date}</div>
              <div className="actions">
                <button className="btn light" onClick={() => alert("Podgląd w przeglądarce lub pobranie pliku")}>Podgląd</button>
                <button className="btn danger" onClick={() => removeDoc(d.id)}>Usuń</button>
              </div>
            </div>
          ))}
          {filteredDocs.length === 0 && <div className="empty">Brak dokumentów.</div>}
        </div>

        {/* Umowy najmu - nowa sekcja */}
        <div className="panel">
          <h3>Umowy najmu ({filteredContracts.length})</h3>
          <div className="table head">
            <div>Id umowy</div>
            <div>Najemca</div>
            <div>Lokal</div>
            <div>Okres</div>
            <div>Czynsz</div>
            <div>Status</div>
            <div>Akcje</div>
          </div>
          {filteredContracts.map(c => (
            <div className="table row" key={c.id}>
              <div>{c.id}</div>
              <div className="ellipsis">{c.tenantEmail}</div>
              <div>{c.flat}</div>
              <div>{c.start} → {c.end}</div>
              <div>{c.rent.toLocaleString()} zł/mc</div>
              <div>{c.status}</div>
              <div className="actions">
                <a className="btn light" href={c.file} target="_blank" rel="noreferrer">Podgląd</a>
              </div>
            </div>
          ))}
          {filteredContracts.length === 0 && <div className="empty">Brak umów.</div>}
        </div>

        {/* Ogłoszenia */}
        <div className="panel">
          <h3>Nowe ogłoszenie</h3>
          <form className="notice-form" onSubmit={publishNotice}>
            <input
              type="text"
              placeholder="Tytuł"
              value={noticeForm.title}
              onChange={e => setNoticeForm(s => ({ ...s, title: e.target.value }))}
            />
            <textarea
              rows={4}
              placeholder="Treść ogłoszenia"
              value={noticeForm.body}
              onChange={e => setNoticeForm(s => ({ ...s, body: e.target.value }))}
            />
            <div className="form-row">
              <select
                value={noticeForm.audience}
                onChange={e => setNoticeForm(s => ({ ...s, audience: e.target.value }))}
              >
                <option value="all">Wszyscy</option>
                <option value="tenants">Najemcy</option>
                <option value="owners">Właściciele</option>
              </select>
              <label className="chk">
                <input
                  type="checkbox"
                  checked={noticeForm.pinned}
                  onChange={e => setNoticeForm(s => ({ ...s, pinned: e.target.checked }))}
                />
                Przypnij
              </label>
            </div>
            <div className="actions">
              <button className="btn primary" type="submit">Opublikuj</button>
              <button className="btn light" type="reset" onClick={() => setNoticeForm({ title: "", body: "", audience: "all", pinned: false })}>Wyczyść</button>
            </div>
          </form>

          <h3 style={{ marginTop: 16 }}>Ogłoszenia ({filteredNotices.length})</h3>
          <ul className="notices">
            {filteredNotices.map(n => (
              <li key={n.id} className={n.pinned ? "pinned" : ""}>
                <div className="notice-head">
                  <span className="title">{n.title}</span>
                  <span className="meta">{n.date} • {n.audience === "all" ? "wszyscy" : n.audience}</span>
                </div>
                <div className="body">{n.body}</div>
                <div className="actions">
                  <button className="btn light" onClick={() => alert("Podgląd ogłoszenia")}>Podgląd</button>
                  <button className="btn danger" onClick={() => removeNotice(n.id)}>Usuń</button>
                </div>
              </li>
            ))}
            {filteredNotices.length === 0 && <li className="empty">Brak ogłoszeń.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import AdminPanel from "./AdminPanel";
import Dashboard from "./Dashboard";
import Properties from "./Properties";
import Reservations from "./Reservations";
import DocumentsNotices from "./DocumentsNotices";
import ReportsAnalytics from "./ReportsAnalytics";
import Tickets from "./Tickets";
import UsersRoles from "./UsersRoles";
import TenantLogin from "./TenantLogin";
import Offers from "./Offers";
import TenantDocuments from "./TenantDocuments";
import TenantReport from "./TenantReport";
import MyPlaces from "./MyPlaces";
import Entry from "./Entry";
import AdminLogin from "./Login";
import MyContracts from "./MyContracts";
import Register from "./Register";



function Header() {
  return (
    <div className="header">
      <div className="header-content">
        <svg className="header-icon" viewBox="0 0 24 24">
          <path
            fill="white"
            d="M3 13h2v-2H3v2zm4 0h14v-2H7v2zm0 4h14v-2H7v2zm0-8h14V7H7v2z"
          />
        </svg>
        <span className="header-text">Zarządzanie Nieruchomościami</span>
      </div>
    </div>
  );
}




// Stopka
function Footer() {
  return <div className="footer">© 2025 WSB MERITO</div>;
}

// Główny komponent aplikacji
function App() {
  return (
    <Router>
      <div className="container">
        <Header />
        <Routes>
          {/* Ekran wyboru roli jako strona startowa */}
          <Route path="/" element={<Entry />} />

          {/* Logowanie */}
          <Route path="/login" element={<TenantLogin />} />       {/* klient */}
          <Route path="/admin/login" element={<Login />} />        {/* admin - Twój Login.js */}

          {/* Panele admina */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/properties" element={<Properties />} />
          <Route path="/admin/reservations" element={<Reservations />} />
          <Route path="/admin/documents" element={<DocumentsNotices />} />
          <Route path="/admin/reports" element={<ReportsAnalytics />} />
          <Route path="/admin/tickets" element={<Tickets />} />
          <Route path="/admin/users" element={<UsersRoles />} />

          {/* Panele klienta */}
          <Route path="/offers" element={<Offers />} />
          <Route path="/documents" element={<TenantDocuments />} />
          <Route path="/report" element={<TenantReport />} />
          <Route path="/my-places" element={<MyPlaces />} />
          <Route path="/my-contracts" element={<MyContracts />} />
          <Route path="/register" element={<Register />} />


          {/* Fallback na / */}
          <Route path="*" element={<Entry />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
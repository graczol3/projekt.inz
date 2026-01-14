import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; 
import "./App.css";

export default function TenantLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const primaryBlue = "#00234c"; 

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: pass }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Obsługa błędu (w tym próby zalogowania admina)
        Swal.fire({
          imageUrl: '/atlanta.png',
          imageWidth: 100,
          title: 'Błąd logowania',
          text: data.message || 'Nieprawidłowy e-mail lub hasło!',
          confirmButtonColor: primaryBlue,
          backdrop: 'rgba(0, 35, 76, 0.6)'
        });
        return;
      }

      // Sukces - tylko dla użytkowników z Role = 'najemca'
      Swal.fire({
        imageUrl: '/atlanta.png',
        imageWidth: 120,
        title: 'Zalogowano pomyślnie!',
        showConfirmButton: false,
        timer: 1500,
        backdrop: 'rgba(255, 255, 255, 0.6)'
      });

      sessionStorage.setItem("tenant", JSON.stringify(data.user));
      setTimeout(() => navigate("/my-places"), 1500);
      
    } catch (error) {
      Swal.fire({
        imageUrl: '/atlanta.png',
        imageWidth: 100,
        title: 'Błąd połączenia',
        text: 'Serwer nie odpowiada!',
        backdrop: 'rgba(0, 0, 0, 0.5)'
      });
    }
  };

  return (
    <div className="tenant-container">
      <div className="tenant-form-wrapper">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img 
            src="/atlanta.png" 
            alt="Atlanta Logo" 
            style={{ width: '280px', height: 'auto' }} 
          />
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '25px', fontWeight: '600', color: primaryBlue }}>
          Logowanie najemcy
        </h2>

        <form className="tenant-form" onSubmit={submit}>
          <input 
            placeholder="E-mail" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
            style={{ borderLeft: `5px solid ${primaryBlue}` }} 
          />
          <input 
            placeholder="Hasło" 
            type="password" 
            value={pass} 
            onChange={e => setPass(e.target.value)}
            required
            style={{ borderLeft: `5px solid ${primaryBlue}`, marginTop: '15px' }}
          />
          
          <button 
            className="btn primary" 
            type="submit" 
            style={{ backgroundColor: primaryBlue, marginTop: '25px' }}
          >
            Zaloguj
          </button>
          
          <button 
            type="button" 
            className="back-link" 
            onClick={() => navigate("/register")}
            style={{ color: primaryBlue, fontWeight: 'bold', marginTop: '20px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Nie masz konta? Zarejestruj się
          </button>

          <button 
            type="button" 
            className="back-link" 
            onClick={() => navigate("/")}
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginTop: '10px' }}
          >
            ← Cofnij
          </button>
        </form>
      </div>
    </div>
  );
}
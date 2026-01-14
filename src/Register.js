import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; 
import "./App.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Funkcja blokująca cyfry i znaki specjalne w imieniu/nazwisku
  const handleNameChange = (val, setter) => {
    const onlyLetters = val.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, "");
    setter(onlyLetters);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Walidacja długości imienia i nazwiska
    if (firstName.length < 2 || lastName.length < 2) {
      return Swal.fire('Błąd', 'Imię i nazwisko muszą mieć min. 2 litery', 'warning');
    }

    // 2. Walidacja siły hasła (Regex)
    // Wymagania: min 8 znaków, 1 duża litera, 1 cyfra, 1 znak specjalny
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return Swal.fire({
        title: 'Słabe hasło!',
        html: `<div style="text-align: left;">Hasło musi zawierać:<br>
               • Minimum 8 znaków<br>
               • Przynajmniej jedną dużą literę<br>
               • Przynajmniej jedną cyfrę<br>
               • Przynajmniej jeden znak specjalny (@$!%*?&)</div>`,
        icon: 'warning'
      });
    }

    try {
      const response = await fetch('http://127.0.0.1:5001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Swal.fire('Sukces!', 'Konto utworzone pomyślnie.', 'success');
        navigate("/login"); 
      } else {
        Swal.fire('Błąd', data.message || 'Rejestracja nie powiodła się', 'error');
      }
    } catch (err) {
      console.error("Błąd rejestracji:", err);
      Swal.fire('Błąd', 'Brak połączenia z serwerem', 'error');
    }
  };

  return (
    <div className="tenant-container">
      <div className="tenant-form-wrapper">
        <h2 style={{ textAlign: 'center', color: '#00234c' }}>Załóż konto najemcy</h2>
        
        <form className="tenant-form" onSubmit={handleRegister}>
          <input 
            placeholder="Imię" 
            type="text" 
            value={firstName} 
            onChange={e => handleNameChange(e.target.value, setFirstName)}
            required
          />
          <input 
            placeholder="Nazwisko" 
            type="text" 
            value={lastName} 
            onChange={e => handleNameChange(e.target.value, setLastName)}
            required
          />
          
          <input 
            placeholder="E-mail" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input 
            placeholder="Hasło" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required
          />
          
          <p style={{ fontSize: '11px', color: '#666', marginTop: '-10px' }}>
            Hasło: min. 8 znaków, duża litera, cyfra i znak specjalny.
          </p>

          <button className="btn primary" type="submit">Zarejestruj się</button>
          
          <button type="button" className="back-link" onClick={() => navigate("/login")}>
            Masz już konto? Zaloguj się
          </button>
        </form>
      </div>
    </div>
  );
}
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    user: 'sa', 
    password: 'Atlanta123!', 
    server: '127.0.0.1',
    port: 1433,
    database: 'AtlantaDB',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

sql.connect(dbConfig).then(() => {
    console.log("✅ POŁĄCZONO Z BAZĄ SQL SERVER");
}).catch(err => {
    console.error("❌ BŁĄD POŁĄCZENIA:", err.message);
});

// MONITOROWANIE LOGOWANIA ADMINA
app.post('/api/admin-login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`📨 POST /api/admin-login`);
    console.log(`--- PRÓBA LOGOWANIA ADMINA ---`);

    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .query("SELECT Email, Role FROM Users WHERE Email = @email AND Password = @password AND Role = 'admin'");

        if (result.recordset.length > 0) {
            console.log(`✅ Admin zalogowany: ${email}`);
            res.json({ success: true, admin: result.recordset[0] });
        } else {
            console.log(`❌ Odmowa dostępu dla: ${email} (Błędne dane lub brak roli admin)`);
            res.status(401).json({ success: false, message: "Brak uprawnień administratora" });
        }
    } catch (err) {
        console.error(`❌ BŁĄD SQL: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

// MONITOROWANIE LOGOWANIA NAJEMCY (Teraz pobiera Imię i Nazwisko)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`📨 POST /api/login`);
    console.log(`--- PRÓBA LOGOWANIA NAJEMCY ---`);

    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            // ZMIANA: Pobieramy FirstName i LastName z bazy
            .query("SELECT Email, Role, FirstName, LastName FROM Users WHERE Email = @email AND Password = @password AND Role = 'najemca'");

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            console.log(`✅ Najemca zalogowany: ${user.FirstName || 'Użytkownik'} (${email})`);
            res.json({ success: true, user: user });
        } else {
            console.log(`❌ Odmowa dostępu dla: ${email} (Próba wejścia adminem lub złe hasło)`);
            res.status(401).json({ success: false, message: "Błąd logowania: Brak uprawnień najemcy." });
        }
    } catch (err) {
        console.error(`❌ BŁĄD SQL: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

// MONITOROWANIE REJESTRACJI (Teraz zapisuje Imię i Nazwisko)
app.post('/api/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    console.log(`📨 POST /api/register - Próba rejestracji: ${firstName} ${lastName} (${email})`);
    
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .input('firstName', sql.NVarChar, firstName)
            .input('lastName', sql.NVarChar, lastName)
            // ZMIANA: Dodajemy FirstName i LastName do zapytania INSERT
            .query("INSERT INTO Users (Email, Password, Role, FirstName, LastName, CreatedAt) VALUES (@email, @password, 'najemca', @firstName, @lastName, GETDATE())");
        
        console.log(`✅ Zarejestrowano pomyślnie: ${firstName} ${lastName}`);
        res.status(201).json({ success: true });
    } catch (err) { 
        console.error(`❌ BŁĄD REJESTRACJI: ${err.message}`);
        res.status(500).json({ error: err.message }); 
    }
});

app.listen(5001, () => console.log('🚀 Serwer pracuje na porcie 5001'));
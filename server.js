const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("./users.db");

/* Create table */

db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    opponent TEXT,
    match_date TEXT,
    stadium TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);
db.run(`
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

/* Registration */

app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {

        return res.json({
            success: false,
            message: "Введите логин и пароль"
        });
    }

    const hashedPassword =
        await bcrypt.hash(password, 10);

    db.run(
        `INSERT INTO users (username, password)
         VALUES (?, ?)`,
        [username, hashedPassword],

        function(err) {

            if (err) {

                return res.json({
                    success: false,
                    message: "Пользователь уже существует"
                });
            }

            res.json({
                success: true,
                message: "Регистрация успешна"
            });
        }
    );
});

/* Login */

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],

        async (err, user) => {

            if (!user) {

                return res.json({
                    success: false,
                    message: "Пользователь не найден"
                });
            }

            const match =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (match) {

                res.json({
                    success: true,
                    message: "Вход выполнен"
                });

            } else {

                res.json({
                    success: false,
                    message: "Неверный пароль"
                });
            }
        }
    );
});

/* Start server */

const PORT = process.env.PORT || 3000;
app.get("/api/news", (req, res) => {

    db.all(
        "SELECT * FROM news ORDER BY created_at DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);
        }
    );
});

app.get("/api/matches", (req, res) => {

    db.all(
        "SELECT * FROM matches ORDER BY match_date ASC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);
        }
    );
});

app.get("/api/notifications", (req, res) => {

    db.all(
        "SELECT * FROM notifications ORDER BY created_at DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);
        }
    );
});
app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});
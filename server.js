const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./users.db");

/* Create table */

db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
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

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});
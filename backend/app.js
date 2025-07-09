const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { getMeterReadings, addMeterReading } = require("./backend_services_onec");

// Заглушка пользователей (в реальности — из БД или 1С)
const users = [
  { id: "1", email: "test@snt.ru", password: "12345", onecGuid: "GUID_1C_USER" }
];

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Логин
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Неверный логин или пароль" });
  const token = jwt.sign({ id: user.id, onecGuid: user.onecGuid }, "secret_key");
  res.json({ token });
});

// Middleware для проверки токена
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).end();
  try {
    req.user = jwt.verify(token, "secret_key");
    next();
  } catch {
    res.status(401).end();
  }
}

// Получить себя
app.get("/api/me", auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({ email: user.email, id: user.id });
});

// Получить показания
app.get("/api/meters", auth, async (req, res) => {
  const readings = await getMeterReadings(req.user.onecGuid);
  res.json(readings.map(r => ({
    id: r.Ref_Key,
    date: r.Дата,
    value: r.Значение
  })));
});

// Добавить показание
app.post("/api/meters", auth, async (req, res) => {
  const { value } = req.body;
  await addMeterReading({ userId: req.user.onecGuid, meterValue: value });
  res.json({ status: "ok" });
});

// Запуск сервера
app.listen(3001, () => console.log("Backend started on port 3001"));
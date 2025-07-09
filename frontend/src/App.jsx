import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import MeterForm from "./components/MeterForm";
import MeterList from "./components/MeterList";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    if (token) {
      // Получаем пользователя и показания
      axios.get("/api/me", { headers: { Authorization: token } })
        .then(res => setUser(res.data))
        .catch(() => setToken(""));
      axios.get("/api/meters", { headers: { Authorization: token } })
        .then(res => setReadings(res.data));
    }
  }, [token]);

  const handleLogin = async (email, password) => {
    const res = await axios.post("/api/login", { email, password });
    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setUser(null);
    setReadings([]);
  };

  const handleAddReading = async (value) => {
    await axios.post("/api/meters", { value }, { headers: { Authorization: token } });
    // Обновить список показаний
    const res = await axios.get("/api/meters", { headers: { Authorization: token } });
    setReadings(res.data);
  };

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Личный кабинет садовода</h2>
      <button onClick={handleLogout}>Выйти</button>
      <MeterForm onAdd={handleAddReading} />
      <MeterList readings={readings} />
    </div>
  );
}

export default App;
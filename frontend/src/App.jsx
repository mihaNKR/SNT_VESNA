import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [userId, setUserId] = useState("");
  const [meterValue, setMeterValue] = useState("");
  const [readings, setReadings] = useState([]);

  const fetchReadings = async () => {
    if (!userId) return;
    const res = await axios.get(`http://localhost:3001/api/meters/${userId}`);
    setReadings(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3001/api/meters', { userId, meterValue });
    setMeterValue("");
    fetchReadings();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Личный кабинет садовода</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Ваш ID (из 1С)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          placeholder="Показание счётчика"
          value={meterValue}
          onChange={(e) => setMeterValue(e.target.value)}
          type="number"
        />
        <button type="submit">Отправить показание</button>
      </form>
      <button onClick={fetchReadings} disabled={!userId}>Показать мои показания</button>
      <ul>
        {readings.map((r) => (
          <li key={r.Ref_Key}>
            {r.Дата}: {r.Значение}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

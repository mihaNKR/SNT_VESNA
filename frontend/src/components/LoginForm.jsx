import React, { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onLogin(email, password);
    } catch {
      setErr("Неверный email или пароль");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Вход</h3>
      {err && <div style={{ color: "red" }}>{err}</div>}
      <input
        placeholder="Email или номер участка"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      /><br />
      <button type="submit">Войти</button>
    </form>
  );
}
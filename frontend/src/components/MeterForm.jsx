import React, { useState } from "react";

export default function MeterForm({ onAdd }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    onAdd(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Передать показания</h3>
      <input
        type="number"
        placeholder="Показания"
        value={value}
        onChange={e => setValue(e.target.value)}
        required
      />
      <button type="submit">Отправить</button>
    </form>
  );
}
import React from "react";

export default function MeterList({ readings }) {
  return (
    <div>
      <h3>История показаний</h3>
      <ul>
        {readings.map(r => (
          <li key={r.id || r.Ref_Key}>
            {r.date || r.Дата}: {r.value || r.Значение}
          </li>
        ))}
      </ul>
    </div>
  );
}
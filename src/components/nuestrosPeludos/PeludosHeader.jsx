import { useState } from "react";
import "./PeludosHeader.css";
import PeludosSort from "./PeludosSort";

export default function PeludosHeader({ onFilter }) {
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState(null);

  return (
    <div className="peludos-header">
      <div className="peludos-header-top">
        <p className="peludos-header-label">Nuestros peludos</p>
        <h1 className="peludos-header-title">Encuentra a tu<br />compañero perfecto</h1>
      </div>
      <div className="peludos-header-actions">

        {/* Ordenar con dropdown pegado al botón */}
        <div className="peludos-sort-wrap">
          <button
            className="peludos-action-btn"
            onClick={() => setSortOpen((v) => !v)}
          >
            <span className="peludos-action-icon">↕</span>
            Ordenar
          </button>
          <PeludosSort
            isOpen={sortOpen}
            onClose={() => setSortOpen(false)}
            value={sortValue}
            onChange={setSortValue}
          />
        </div>

        <button className="peludos-action-btn" onClick={onFilter}>
          <span className="peludos-action-icon">⚌</span>
          Filtrar
        </button>

      </div>
    </div>
  );
}

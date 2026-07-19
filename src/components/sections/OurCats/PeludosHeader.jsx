import { useState } from "react";
import "./PeludosHeader.css";
import PeludosSort from "./PeludosSort";
import { Button } from "antd";

export default function PeludosHeader({ onFilter, sortValue, onSortChange }) {
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="peludos-header">
      <div className="peludos-header-top">
        <p className="peludos-header-label">Nuestros peludos</p>
        <h1 className="peludos-header-title">Encuentra a tu<br />compañero perfecto</h1>
      </div>
      <div className="peludos-header-actions">

        {/* Ordenar con dropdown pegado al botón */}
        <div className="peludos-sort-wrap">
          <Button onClick={() => setSortOpen((v) => !v)}>
            <span className="peludos-action-icon">↕</span> Ordenar
          </Button>          <PeludosSort
            isOpen={sortOpen}
            onClose={() => setSortOpen(false)}
            value={sortValue}
            onChange={onSortChange}
          />
        </div>

        <Button onClick={onFilter}>
          <span className="peludos-action-icon">⚌</span> Filtrar
        </Button>

      </div>
    </div>
  );
}

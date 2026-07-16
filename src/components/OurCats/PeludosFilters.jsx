import { useState } from "react";
import "./PeludosFilters.css";

export default function PeludosFilters({ isOpen, onClose, onApply }) {
  const [ageRange, setAgeRange] = useState([0, 25]);
  const [sexo, setSexo] = useState({ macho: false, hembra: false });

  const handleSexo = (key) => setSexo((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleApply = () => {
    onApply({ ageRange, sexo });
    onClose();
  };

  const handleReset = () => {
    setAgeRange([0, 25]);
    setSexo({ macho: false, hembra: false });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`pfilters-overlay${isOpen ? " pfilters-overlay--open" : ""}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`pfilters-panel${isOpen ? " pfilters-panel--open" : ""}`}>

        <div className="pfilters-top">
          <h2 className="pfilters-title">Filtrar</h2>
          <button className="pfilters-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Edad */}
        <div className="pfilters-section">
          <h3 className="pfilters-section-title">Rango de edad</h3>
          <p className="pfilters-age-label">{ageRange[0]} - {ageRange[1]} años</p>
          <div className="pfilters-range-wrap">
            <div
              className="pfilters-range-track"
              style={{
                '--min': ageRange[0],
                '--max': ageRange[1],
              }}
            >
              <input
                type="range"
                min={0}
                max={25}
                value={ageRange[0]}
                className="pfilters-range pfilters-range--min"
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), ageRange[1] - 1);
                  setAgeRange([val, ageRange[1]]);
                }}
              />
              <input
                type="range"
                min={0}
                max={25}
                value={ageRange[1]}
                className="pfilters-range pfilters-range--max"
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), ageRange[0] + 1);
                  setAgeRange([ageRange[0], val]);
                }}
              />
            </div>
          </div>
        </div>

        {/* Sexo */}
        <div className="pfilters-section">
          <h3 className="pfilters-section-title">Sexo</h3>
          <label className="pfilters-checkbox">
            <input
              type="checkbox"
              checked={sexo.macho}
              onChange={() => handleSexo("macho")}
            />
            <span className="pfilters-checkbox-box" />
            Macho
          </label>
          <label className="pfilters-checkbox">
            <input
              type="checkbox"
              checked={sexo.hembra}
              onChange={() => handleSexo("hembra")}
            />
            <span className="pfilters-checkbox-box" />
            Hembra
          </label>
        </div>

        {/* Acciones */}
        <div className="pfilters-actions">
          <button className="pfilters-btn pfilters-btn--reset" onClick={handleReset}>
            Limpiar
          </button>
          <button className="pfilters-btn pfilters-btn--apply" onClick={handleApply}>
            Aplicar
          </button>
        </div>

      </div>
    </>
  );
}

import { useState } from "react";
import { Drawer, Slider, Checkbox, Button, Space } from "antd";

const GREEN_COLOR = "#2e7d32";

export default function PeludosFilters({ isOpen, onClose, onApply }) {
  const [ageRange, setAgeRange] = useState([0, 25]);
  const [sexo, setSexo] = useState({ macho: false, hembra: false });

  const handleSexoChange = (key, checked) => {
    setSexo((prev) => ({ ...prev, [key]: checked }));
  };

  const handleApply = () => {
    onApply({ ageRange, sexo });
    onClose();
  };

  const handleReset = () => {
    setAgeRange([0, 25]);
    setSexo({ macho: false, hembra: false });
  };

  return (
    <Drawer
      title={<span style={{ fontSize: "1.2rem", fontWeight: 700 }}>Filtrar</span>}
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={340}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <Button onClick={handleReset} style={{ flex: 1 }}>
            Limpiar
          </Button>
          <Button
            type="primary"
            onClick={handleApply}
            style={{ flex: 1, backgroundColor: GREEN_COLOR, borderColor: GREEN_COLOR }}
          >
            Aplicar
          </Button>
        </div>
      }
    >
      {/* Sección Rango de Edad */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 8 }}>
          Rango de edad
        </h3>
        <p style={{ color: "#666", marginBottom: 12 }}>
          {ageRange[0]} - {ageRange[1]} {ageRange[1] === 1 ? "año" : "años"}
        </p>
        <Slider
          range
          min={0}
          max={25}
          value={ageRange}
          onChange={(value) => setAgeRange(value)}
          styles={{
            track: { backgroundColor: GREEN_COLOR },
            handle: { borderColor: GREEN_COLOR }
          }}
        />
      </div>

      {/* Sección Sexo */}
      <div>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 16 }}>
          Sexo
        </h3>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Checkbox
            checked={sexo.macho}
            onChange={(e) => handleSexoChange("macho", e.target.checked)}
          >
            Macho
          </Checkbox>
          <Checkbox
            checked={sexo.hembra}
            onChange={(e) => handleSexoChange("hembra", e.target.checked)}
          >
            Hembra
          </Checkbox>
        </Space>
      </div>
    </Drawer>
  );
}
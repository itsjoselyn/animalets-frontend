import { Button, Dropdown } from "antd";
import { FilterOutlined, SwapOutlined } from "@ant-design/icons";
import "./PeludosHeader.css";

const GREEN_COLOR = "#2e7d32";

export default function PeludosHeader({ onFilter, sortValue, onSortChange }) {
  // Opciones para el menú desplegable
  const sortItems = [
    { key: "default", label: "Por defecto" },
    { key: "age_asc", label: "Edad: Menor a Mayor" },
    { key: "age_desc", label: "Edad: Mayor a Menor" },
    { key: "macho", label: "Machos primero" },
    { key: "hembra", label: "Hembras primero" },
  ];

  return (
    <div className="peludos-header">
      <div className="peludos-header-top">
        <p className="peludos-header-label">Nuestros peludos</p>
        <h1 className="peludos-header-title">
          Encuentra a tu<br />compañero perfecto
        </h1>
      </div>

      <div className="peludos-header-actions" style={{ display: "flex", gap: 12 }}>
        {/* Dropdown nativo de Ant Design */}
        <Dropdown
          menu={{
            items: sortItems,
            onClick: ({ key }) => onSortChange(key),
            selectable: true,
            selectedKeys: [sortValue || "default"],
          }}
          trigger={["click"]}
        >
          <Button icon={<SwapOutlined />}>
            Ordenar
          </Button>
        </Dropdown>

        {/* Botón de Filtrar */}
        <Button
          icon={<FilterOutlined />}
          onClick={onFilter}
          style={{ borderColor: GREEN_COLOR, color: GREEN_COLOR }}
        >
          Filtrar
        </Button>
      </div>
    </div>
  );
}
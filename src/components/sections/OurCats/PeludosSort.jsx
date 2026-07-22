import { Dropdown, Menu } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { OPTIONS_FILTER } from "../../../utils/constants";

export default function PeludosSort({ value, onChange, children }) {
  const items = OPTIONS_FILTER.map((opt) => ({
    key: opt.value,
    label: (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <span>{opt.label}</span>
        {value === opt.value && <CheckOutlined style={{ color: "#2e7d32" }} />}
      </div>
    ),
  }));

  const handleMenuClick = ({ key }) => {
    // Si hace clic en la opción activa, la desmarca (pone en null), de lo contrario aplica la nueva
    onChange(value === key ? null : key);
  };

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
        selectedKeys: value ? [value] : [],
      }}
      trigger={["click"]}
    >
      {children}
    </Dropdown>
  );
}
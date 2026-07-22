import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import Footer from './Footer';
import { Layout, Menu, Button, Drawer } from 'antd';
import {
  TeamOutlined,
  BaiduOutlined,
  SmileOutlined,
  FileTextOutlined,
  MailOutlined,
  MenuOutlined
} from '@ant-design/icons';
import logo from "../../assets/animalets-logo.png";
import "./MainLayout.css";
import { useState } from 'react';

const { Content, Header } = Layout;

const items = [
  { key: '/sobre-nosotros', label: "Sobre nosotros", icon: <TeamOutlined /> },
  { key: '/nuestros-peludos', label: "Nuestros peludos", icon: <BaiduOutlined /> },
  { key: '/como-ayudar', label: "Cómo ayudar", icon: <SmileOutlined /> },
  { key: '/blog', label: "Blog", icon: <FileTextOutlined /> },
  { key: '/contacto', label: "Contacto", icon: <MailOutlined /> },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Maneja la navegación y cierra el Drawer en móvil
  const handleMenuClick = (e) => {
    navigate(e.key);
    setOpen(false); // Cierra el menú en móvil tras hacer clic
  };

  return (
    <Layout>
      <Header className="app-header">
        {/* Botón hamburguesa (solo móvil por CSS) */}
        <Button
          className="app-header__burger"
          type="text"
          icon={<MenuOutlined />}
          aria-label="Abrir menú"
          onClick={() => setOpen(true)}
        >
          Menu
        </Button>

        {/* Logo */}
        <Link to="/" className="app-header__logo">
          <img src={logo} alt="Animalets" />
        </Link>

        {/* Menú de navegación principal (Desktop) */}
        <Menu
          onClick={handleMenuClick}
          selectedKeys={[location.pathname]}
          mode="horizontal"
          items={items}
          className="app-header__menu"
          disabledOverflow={true}
        />

        {/* Botón CTA */}
        <Button type="primary" shape="round" onClick={() => navigate("/nuestros-peludos")}>
          Adopta ya
        </Button>
      </Header>

      {/* Menú lateral desplegable para móviles */}
      <Drawer
        title="Menú"
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        styles={{ body: { padding: 0 } }} // Para que el menú ocupe todo el ancho del Drawer
      >
        <Menu
          onClick={handleMenuClick}
          selectedKeys={[location.pathname]}
          mode="inline"
          items={items}
        />
      </Drawer>

      <Content style={{ padding: '0 48px', minHeight: 'calc(100vh - 64px - 70px)' }}>
        <Outlet />
      </Content>

      <Footer />
    </Layout>
  );
}
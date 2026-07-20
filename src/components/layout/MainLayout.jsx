import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Layout } from 'antd';
import { TeamOutlined, BaiduOutlined, SmileOutlined, FileTextOutlined, MailOutlined, MenuOutlined } from '@ant-design/icons';
const { Content, Header } = Layout;
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../../assets/animalets-logo.png";
import { Button } from 'antd';
import { Link } from "react-router-dom";
import "./MainLayout.css";
import { useState } from 'react';

const items = [
  {
    key: '/sobre-nosotros',
    label: "Sobre nosotros",
    icon: <TeamOutlined />,
    to: "/sobre-nosotros"
  },
  { key: '/nuestros-peludos', label: "Nuestros peludos", icon: <BaiduOutlined />, to: "/nuestros-peludos" },
  { key: '/como-ayudar', label: "Cómo ayudar", icon: <SmileOutlined />, to: "/como-ayudar" },
  { key: '/blog', label: "Blog", icon: <FileTextOutlined />, to: "/blog" },
  { key: '/contacto', label: "Contacto", icon: <MailOutlined />, to: "/contacto" },
]

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const onClick = e => {
    navigate(e.key);

  };
  return (
    <>
      <Layout>
        <Header className="app-header">
          {/* Solo mobile */}
          <Button className="app-header__burger" type="text" icon={<MenuOutlined />} aria-label="Abrir mené" onClick={() => setOpen(true)}>Menu</Button>

          <a href="/" className="app-header__logo">
            <img src={logo} alt="Animalets" />
          </a>

          {/* Solo desktop */}
          <Menu onClick={onClick} selectedKeys={[location.pathname]} mode="horizontal" items={items} className="app-header__menu" />
          <Button type="primary" shape="round" href="/nuestros-peludos" target="_blank">
            Adopta ya
          </Button>
        </Header>
        <Content style={{ padding: '0 48px', minHeight: 'calc(100vh - 64px - 70px)' }}>
        <Outlet />
        </Content>
      <Footer />
      </Layout>
    </>
  );
}

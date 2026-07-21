import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button, Menu, Drawer, Grid } from "antd";
import {
    HomeOutlined,
    HeartOutlined,
    FileTextOutlined,
    MailOutlined,
    LogoutOutlined,
    MenuOutlined,
} from "@ant-design/icons";

export default function AdminLayout() {
    const [user, setUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            if (!u) navigate("/admin/login");
        });

        return unsub;
    }, [navigate]);

    const handleSignOut = async () => {
        await signOut(auth);
        navigate("/admin/login");
    };

    if (!user) return null;

    const menuItems = [
        {
            key: "/admin/gatos",
            icon: <HomeOutlined />,
            label: "Gatos",
        },
        {
            key: "/admin/testimonios",
            icon: <HeartOutlined />,
            label: "Testimonios",
        },
        {
            key: "/admin/noticias",
            icon: <FileTextOutlined />,
            label: "Noticias",
        },
        {
            key: "/admin/solicitudes",
            icon: <MailOutlined />,
            label: "Solicitudes",
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 24,
                    marginBottom: 24,
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        color: "#4caf50",
                        whiteSpace: "nowrap",
                    }}
                >
                    Admin Panel
                </h2>

                {isMobile ? (
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: 22 }} />}
                        onClick={() => setDrawerOpen(true)}
                    />
                ) : (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            flex: 1,
                        }}
                    >
                        <Menu
                            mode="horizontal"
                            selectedKeys={[location.pathname]}
                            onClick={({ key }) => navigate(key)}
                            style={{
                                flex: 1,
                                borderBottom: "none",
                            }}
                            items={menuItems}
                        />

                        <Button
                            type="primary"
                            danger
                            icon={<LogoutOutlined />}
                            onClick={handleSignOut}
                        >
                            Salir
                        </Button>
                    </div>
                )}
            </header>

            <Drawer
                title="Admin Panel"
                placement="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => {
                        navigate(key);
                        setDrawerOpen(false);
                    }}
                />

                <Button
                    type="primary"
                    danger
                    block
                    icon={<LogoutOutlined />}
                    onClick={handleSignOut}
                    style={{ marginTop: 20 }}
                >
                    Salir
                </Button>
            </Drawer>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
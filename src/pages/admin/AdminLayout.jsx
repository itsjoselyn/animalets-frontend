import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button, Menu, Drawer, Grid, Spin } from "antd";
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
    const [initializing, setInitializing] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setInitializing(false);

            if (!u) {
                navigate("/admin/login", { replace: true });
            }
        });

        return unsub;
    }, [navigate]);

    // Redirigir a la vista principal del admin si entra en la raíz /admin o /admin/
    useEffect(() => {
        if (user && (location.pathname === "/admin" || location.pathname === "/admin/")) {
            navigate("/admin/gatos", { replace: true });
        }
    }, [user, location.pathname, navigate]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/admin/login", { replace: true });
        } catch (err) {
            console.error("Error al cerrar sesión:", err);
        }
    };

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

    // Estado de carga inicial mientras Firebase comprueba el token guardado en LocalStorage
    if (initializing) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <Spin size="large" tip="Cargando panel de administración..." />
            </div>
        );
    }

    // Si no hay usuario autenticado después de la inicialización
    if (!user) return null;

    return (
        <div style={{ padding: 20, minHeight: "100vh" }}>
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 24,
                    marginBottom: 24,
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: 12,
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        color: "#2e7d32",
                        whiteSpace: "nowrap",
                        fontWeight: 700,
                    }}
                >
                    Admin Panel
                </h2>

                {isMobile ? (
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: 22 }} />}
                        onClick={() => setDrawerOpen(true)}
                        aria-label="Abrir menú de navegación"
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

            {/* Drawer para vista móvil */}
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

            <main style={{ width: "100%" }}>
                <Outlet />
            </main>
        </div>
    );
}
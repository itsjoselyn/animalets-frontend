import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button, Menu } from "antd";
import {
    HomeOutlined,
    HeartOutlined,
    FileTextOutlined,
    MailOutlined,
    LogoutOutlined,
} from "@ant-design/icons";

export default function AdminLayout() {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

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
                <h2 style={{ margin: 0, color: "#4caf50", whiteSpace: "nowrap" }}>
                    Admin Panel
                </h2>

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
                        style={{ flex: 1, borderBottom: "none" }}
                        items={[
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
                        ]}
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
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { Form, Input, Button, Card, Alert, Typography } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function AdminLogin() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFinish = async (values) => {
        const { email, password } = values;
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin/gatos", { replace: true });
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            setError("Usuario o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
                padding: 16,
            }}
        >
            <Card
                style={{
                    width: "100%",
                    maxWidth: 400,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    borderRadius: 12,
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title level={3} style={{ color: "#2e7d32", margin: 0 }}>
                        Panel Admin
                    </Title>
                    <Typography.Text type="secondary">
                        Acceso restringido para la gestión
                    </Typography.Text>
                </div>

                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 20 }}
                    />
                )}

                <Form
                    name="admin_login"
                    layout="vertical"
                    onFinish={handleFinish}
                    requiredMark={false}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Por favor introduce tu email" },
                            { type: "email", message: "Formato de email no válido" },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                            placeholder="Correo electrónico"
                            size="large"
                            autoComplete="email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: "Por favor introduce tu contraseña" },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                            placeholder="Contraseña"
                            size="large"
                            autoComplete="current-password"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 12, marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            size="large"
                            icon={<LoginOutlined />}
                            style={{ backgroundColor: "#2e7d32", borderColor: "#2e7d32" }}
                        >
                            Entrar
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
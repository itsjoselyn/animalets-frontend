import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { Outlet, useNavigate, Link } from "react-router-dom";
import Button from "../../components/common/Button/Button";

export default function AdminLayout() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            if (!u) navigate('/admin/login');
        });
        return unsub;
    }, [navigate]);

    const handleSignOut = async () => {
        await signOut(auth);
        navigate('/admin/login');
    };

    if (!user) return null;

    return (
        <div style={{ padding: 20 }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={{ margin: 0, color: '#4caf50' }}>Admin Panel</h2>
                <nav>
                    <Link to="/admin/gatos" style={{ marginRight: 12 }}>Gatos</Link>
                    <Link to="/admin/testimonios" style={{ marginRight: 12 }}>Testimonios</Link>
                    <Link to="/admin/noticias" style={{ marginRight: 12 }}>Noticias</Link>
                    <Link to="/admin/solicitudes" style={{ marginRight: 12 }}>Solicitudes</Link>
                    <Button onClick={handleSignOut} style={{ background: '#e53935', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Salir</Button>                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import "../../components/sections/Contact/ContactForm.css";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin/gatos");
        } catch (err) {
            console.error(err);
            setError("Usuario o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ color: '#4caf50' }}>Panel Admin — Acceso</h2>
            <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="cform-input" />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="cform-input" />
                {error && <p className="cform-field-error">{error}</p>}
                <button className="cform-submit" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
            </form>
        </div>
    );
}

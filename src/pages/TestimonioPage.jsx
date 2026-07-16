import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./TestimonioPage.css";
import logo from "../assets/animalets-logo.png";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function TestimonioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testimonio, setTestimonio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No se indicó id del testimonio");
      setLoading(false);
      return;
    }

    const fetchTestimonio = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "testimonios", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTestimonio({
            id: docSnap.id,
            title: data.titulo || data.title || "",
            date: data.createdAt || null,
            text: data.descripcion || data.texto || data.body || "",
          });
        } else {
          setError("Testimonio no encontrado");
        }
      } catch (err) {
        console.error("Error fetching testimonio:", err);
        setError("Error cargando testimonio");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonio();
  }, [id]);

  const formatDate = (value) => {
    if (!value) return "";
    if (typeof value === "object" && value?.toDate) {
      try {
        return value.toDate().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
      } catch {
        return "";
      }
    }
    return value;
  };

  if (loading) {
    return (
      <div className="testpage-loading">
        <p>Cargando testimonio…</p>
      </div>
    );
  }

  if (error || !testimonio) {
    return (
      <div className="testpage-notfound">
        <p>{error || "Testimonio no encontrado."}</p>
        <button onClick={() => navigate("/")}>Volver</button>
      </div>
    );
  }

  return (
    <div className="testpage">

      {/* Header */}
      <header className="testpage-header">
        <img src={logo} alt="Animalets" className="testpage-logo" />
        <button
          className="testpage-close"
          onClick={() => navigate("/")}
        >
          Cerrar
        </button>
      </header>

      {/* Subheader con nombre */}
      <div className="testpage-subheader">
        <h1 className="testpage-name">{testimonio.title}</h1>
        <span className="testpage-date">{formatDate(testimonio.date)}</span>
      </div>

      {/* Contenido */}
      <div className="testpage-body">
        <p className="testpage-text">{testimonio.text}</p>
      </div>

    </div>
  );
}

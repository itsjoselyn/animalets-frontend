import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Button, Typography } from "antd";
import { CloseOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import logo from "../assets/animalets-logo.png";
import "./TestimonioPage.css";

const { Title, Paragraph, Text } = Typography;

export default function TestimonioPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [testimonio, setTestimonio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!id) {
      setError("No se indicó el ID del testimonio");
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchTestimonio = async () => {
      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, "testimonios", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (mounted) {
            setTestimonio({
              id: docSnap.id,
              title: data.titulo || data.title || "Testimonio",
              date: data.createdAt || data.date || null,
              text: data.descripcion || data.texto || data.body || "",
            });
          }
        } else {
          if (mounted) setError("Testimonio no encontrado");
        }
      } catch (err) {
        console.error("Error fetching testimonio:", err);
        if (mounted) setError("Error al cargar el testimonio");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTestimonio();

    return () => {
      mounted = false;
    };
  }, [id]);

  const formatDate = (value) => {
    if (!value) return "";
    try {
      if (typeof value === "object" && typeof value.toDate === "function") {
        return value.toDate().toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    } catch (e) {
      console.warn("Error formateando fecha:", e);
    }
    return String(value);
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <main className="testpage-loading" style={{ textAlign: "center", padding: "60px 16px" }}>
        <p>Cargando testimonio…</p>
      </main>
    );
  }

  if (error || !testimonio) {
    return (
      <main className="testpage-notfound" style={{ textAlign: "center", padding: "60px 16px" }}>
        <p style={{ marginBottom: 16 }}>{error || "Testimonio no encontrado."}</p>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Volver
        </Button>
      </main>
    );
  }

  return (
    <main className="testpage" style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      {/* Header */}
      <header className="testpage-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <img src={logo} alt="Animalets logo" className="testpage-logo" style={{ height: 40 }} />
        <Button
          icon={<CloseOutlined />}
          onClick={handleBack}
          aria-label="Cerrar testimonio y volver"
        >
          Cerrar
        </Button>
      </header>

      {/* Contenedor con el mismo estilo que la tarjeta de la vista previa del Admin */}
      <div
        style={{
          background: "#fafafa",
          border: "1px solid #f0f0f0",
          borderRadius: 12,
          padding: 32,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          <Title level={2} style={{ color: "#2e7d32", margin: 0 }}>
            {testimonio.title}
          </Title>
          {testimonio.date && (
            <Text type="secondary" style={{ fontSize: 14, alignSelf: "center" }}>
              {formatDate(testimonio.date)}
            </Text>
          )}
        </div>

        <Paragraph style={{ color: "#595959", whiteSpace: "pre-wrap", fontSize: 16, lineHeight: 1.6, marginBottom: 0 }}>
          {testimonio.text}
        </Paragraph>
      </div>
    </main>
  );
}
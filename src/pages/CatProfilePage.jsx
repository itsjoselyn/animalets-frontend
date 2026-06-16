import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CatProfilePage.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function formatAge(value) {
  if (!value && value !== 0) return "";
  if (typeof value === "number") return value === 1 ? "1 año" : `${value} años`;
  return String(value);
}

function mapSuperpowers(obj) {
  if (!obj) return [
    { label: "Nivel de mimos", value: "" },
    { label: "Habilidad especial", value: "" },
    { label: "Estado actual", value: "" },
  ];
  return [
    { label: "Nivel de mimos", value: obj.nivelMimos || obj.nivel || "" },
    { label: "Habilidad especial", value: obj.habilidadEspecial || obj.habilidad || "" },
    { label: "Estado actual", value: obj.estadoActual || obj.estado || "" },
  ];
}

export default function CatProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadCat() {
      setLoading(true);
      try {
        const ref = doc(db, "gatos", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          if (mounted) setCat(null);
          return;
        }
        const data = snap.data() || {};
        const mapped = {
          id: snap.id,
          name: data.nombre || data.name || "",
          age: formatAge(data.edad || data.age),
          gender: data.sexo || data.gender || "",
          img: (Array.isArray(data.imagenes) && data.imagenes[0] && data.imagenes[0].url) || data.imagen || data.image || data.img || "",
          bio: data.historia || data.bio || data.descripcion || "",
          necesito: data.necesidades || data.necesito || [],
          superpoderes: mapSuperpowers(data.superpoderes || data.superpowers || {}),
          adoptado: data.adoptado || false,
        };

        if (mounted) setCat(mapped);
      } catch (err) {
        console.error("Error loading cat:", err);
        if (mounted) setCat(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadCat();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="catprofile">
        <button
          className="catprofile-close"
          onClick={() => navigate("/nuestros-peludos")}
          aria-label="Cerrar"
        >
          ✕
        </button>
        <div className="catprofile-img-wrap">
          <div className="skeleton" style={{ width: 400, height: 500, borderRadius: 8 }} />
        </div>
        <div className="catprofile-body">
          <div className="skeleton" style={{ height: 28, width: 200, marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 16, width: 120, marginBottom: 20 }} />
          <div className="skeleton" style={{ height: 14, width: "100%", marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 14, width: "100%", marginBottom: 8 }} />
        </div>
      </div>
    );
  }

  if (!cat || cat.adoptado) {
    return (
      <div className="catprofile-notfound">
        <p>Gato no encontrado.</p>
        <button onClick={() => navigate("/nuestros-peludos")}>Volver</button>
      </div>
    );
  }

  return (
    <div className="catprofile">

      {/* Botón cerrar fijo */}
      <button
        className="catprofile-close"
        onClick={() => navigate("/nuestros-peludos")}
        aria-label="Cerrar"
      >
        ✕
      </button>

      {/* Foto */}
      <div className="catprofile-img-wrap">
        {cat.img ? <img src={cat.img} alt={cat.name} className="catprofile-img" /> : <div className="skeleton" style={{ width: "100%", height: "100%", borderRadius: 8 }} />}
      </div>

      {/* Contenido */}
      <div className="catprofile-body">

        {/* Nombre + edad + sexo */}
        <div className="catprofile-hero">
          <h1 className="catprofile-name">{cat.name}</h1>
          <div className="catprofile-meta">
            <span>{cat.age}</span>
            <span>{cat.gender}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="catprofile-bio">{cat.bio}</p>

        {/* Lo que necesito */}
        <div className="catprofile-section">
          <h2 className="catprofile-section-title">Lo que necesito</h2>
          <ul className="catprofile-list">
            {cat.necesito.map((item, i) => (
              <li key={i} className="catprofile-list-item">{item}</li>
            ))}
          </ul>
        </div>

        {/* Superpoderes */}
        <div className="catprofile-section">
          <h2 className="catprofile-section-title">Mis superpoderes</h2>
          <ul className="catprofile-powers">
            {cat.superpoderes.map((s, i) => (
              <li key={i} className="catprofile-power">
                <span className="catprofile-power-label">{s.label}:</span> {s.value}
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="catprofile-ctas">
          <a
            href={`/contacto?tipo=adoptar&gato=${encodeURIComponent(cat.name)}`}
            className="catprofile-btn catprofile-btn--adopt"
          >
            Adóptame
          </a>
          <a
            href={`/contacto?tipo=acogida&gato=${encodeURIComponent(cat.name)}`}
            className="catprofile-btn catprofile-btn--foster"
          >
            Acógeme
          </a>
        </div>

      </div>
    </div>
  );
}

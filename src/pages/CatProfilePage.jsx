import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CatProfilePage.css";
import { optimizeCloudinaryImage } from "../lib/optimizeCloudinaryImage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Button } from "antd";

function formatAge(value) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "number") return value === 1 ? "1 año" : `${value} años`;
  return String(value);
}

function mapSuperpowers(obj) {
  if (!obj) {
    return [
      { label: "Nivel de mimos", value: "" },
      { label: "Habilidad especial", value: "" },
      { label: "Estado actual", value: "" },
    ];
  }

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
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false); // 🔥 MODAL

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
          bio: data.historia || data.bio || data.descripcion || "",
          necesito: data.necesidades || data.necesito || [],
          superpoderes: mapSuperpowers(data.superpoderes || data.superpowers || {}),

          images: Array.isArray(data.imagenes)
            ? data.imagenes
              .map((it) => {
                if (!it) return null;
                if (typeof it === "string") return it;
                return it.url || it.src || null;
              })
              .filter(Boolean)
            : data.img
              ? [data.img]
              : [],

          adoptado: data.estado === "adoptado" || data.adoptado || false,
        };

        if (mounted) {
          setCat(mapped);
          setIndex(0);
        }
      } catch (err) {
        console.error("Error loading cat:", err);
        if (mounted) setCat(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCat();
  }, [id]);

  useEffect(() => {
    setIndex(0);
  }, [cat?.id]);

  if (loading) {
    return (
      <div className="catprofile">
        <div className="catprofile-img-wrap">
          <div className="skeleton" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    );
  }

  if (!cat || cat.adoptado) {
    return (
      <div className="catprofile-notfound">
        <p>Gato no encontrado.</p>
        <Button onClick={() => navigate("/nuestros-peludos")}>Volver</Button>
      </div>
    );
  }

  const images = cat.images || [];

  const currentImage =
    images.length > 0 ? images[index % images.length] : null;

  const prev = (e) => {
    e?.stopPropagation();
    if (!images.length) return;
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  const next = (e) => {
    e?.stopPropagation();
    if (!images.length) return;
    setIndex((i) => (i + 1) % images.length);
  };

  return (
    <div className="catprofile">

      <Button onClick={() => navigate("/nuestros-peludos")}>✕</Button>



      {/* ================= MODAL ================= */}
      {open && currentImage && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              padding: 20,
              borderRadius: 16,
              background: "#1b1b1b",
            }}
          >
            <img
              src={optimizeCloudinaryImage(currentImage, {
                width: 1200,
                crop: "fit",
              })} alt={cat.name}
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "80vw",
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: 12,
              }}
            />

            {images.length > 1 && (
              <>
                <Button onClick={prev} style={{ position: "absolute", left: -50, top: "50%", fontSize: 30, color: "#fff", background: "transparent", border: "none", cursor: "pointer" }}>◀</Button>

                <Button onClick={next} style={{ position: "absolute", right: -50, top: "50%", fontSize: 30, color: "#fff", background: "transparent", border: "none", cursor: "pointer" }}>▶</Button>

                <Button onClick={() => setOpen(false)} style={{ position: "absolute", top: -40, right: 0, fontSize: 26, color: "#fff", background: "transparent", border: "none", cursor: "pointer" }}>✕</Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= CONTENIDO ================= */}
      <div className="catprofile-body">
        {/* ================= IMAGEN ================= */}
        <div className="catprofile-img-wrap" style={{ position: "relative" }}>
          {currentImage ? (
            <img
              src={optimizeCloudinaryImage(currentImage)}
              alt={cat.name}
              className="catprofile-img"
              style={{ cursor: "zoom-in" }}
              onClick={() => setOpen(true)} // 🔥 OPEN MODAL
            />
          ) : (
            <div className="skeleton" style={{ width: "100%", height: "100%" }} />
          )}

          {images.length > 1 && (
            <>
              <Button
                onClick={prev}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  background: "transparent",
                  border: "none",
                  fontSize: 24,
                  cursor: "pointer",
                }}
              >
                ◀
              </Button>

              <Button
                onClick={next}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  background: "transparent",
                  border: "none",
                  fontSize: 24,
                  cursor: "pointer",
                }}
              >
                ▶
              </Button>
            </>
          )}
        </div>

        <div className="catprofile-hero">
          <h1 className="catprofile-name">{cat.name}</h1>
          <div className="catprofile-meta">
            <span>{cat.age}</span>
            <span>{cat.gender}</span>
          </div>
        </div>

        <p className="catprofile-bio">{cat.bio}</p>

        <div className="catprofile-section">
          <h2 className="catprofile-section-title">Lo que necesito</h2>
          <ul className="catprofile-list">
            {cat.necesito.map((item, i) => (
              <li key={i} className="catprofile-list-item">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="catprofile-section">
          <h2 className="catprofile-section-title">Mis superpoderes</h2>
          <ul className="catprofile-powers">
            {cat.superpoderes.map((s, i) => (
              <li key={i} className="catprofile-power">
                <span className="catprofile-power-label">{s.label}:</span>{" "}
                {s.value}
              </li>
            ))}
          </ul>
        </div>

        <div className="catprofile-ctas">
          <Button type="link"
            href={`/contacto`}
          >
            Adóptame
          </Button>

          <Button type="link"
            href={`/contacto`}
          >
            Acógeme
          </Button>
        </div>

      </div>
    </div>
  );
}
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CatProfilePage.css";
import { optimizeCloudinaryImage } from "../lib/optimizeCloudinaryImage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Button, Image, Tag, Skeleton, Result } from "antd";
import {
  ArrowLeftOutlined,
  LeftOutlined,
  RightOutlined,
  HeartOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const GREEN_COLOR = "#2e7d32";

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

  if (loading) {
    return (
      <div className="catprofile" style={{ padding: "24px 0" }}>
        <Skeleton active avatar paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!cat || cat.adoptado) {
    return (
      <div style={{ padding: "40px 0" }}>
        <Result
          status="404"
          title="Peludo no encontrado"
          subTitle="El gato que estás buscando ya ha sido adoptado o no existe."
          extra={
            <Button
              type="primary"
              onClick={() => navigate("/nuestros-peludos")}
              style={{ backgroundColor: GREEN_COLOR, borderColor: GREEN_COLOR }}
            >
              Volver al listado
            </Button>
          }
        />
      </div>
    );
  }

  const images = cat.images || [];
  const currentImage = images.length > 0 ? images[index % images.length] : null;

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
      {/* Botón Volver */}
      <div style={{ marginBottom: 16 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/nuestros-peludos")}
        >
          Volver a nuestros peludos
        </Button>
      </div>

      <div className="catprofile-body">
        {/* ================= IMAGEN Y GALERÍA CON ANTD ================= */}
        <div className="catprofile-img-wrap" style={{ position: "relative" }}>
          {currentImage ? (
            <Image
              src={optimizeCloudinaryImage(currentImage, { width: 800 })}
              alt={cat.name}
              className="catprofile-img"
              style={{ width: "100%", borderRadius: 12, objectFit: "cover" }}
              preview={{
                src: optimizeCloudinaryImage(currentImage, { width: 1200 }),
              }}
            />
          ) : (
            <Skeleton.Image active style={{ width: "100%", height: 300 }} />
          )}

          {/* Carrusel rápido para la foto activa */}
          {images.length > 1 && (
            <>
              <Button
                shape="circle"
                icon={<LeftOutlined />}
                onClick={prev}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  background: "rgba(255,255,255,0.85)",
                  border: "none",
                }}
              />

              <Button
                shape="circle"
                icon={<RightOutlined />}
                onClick={next}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  background: "rgba(255,255,255,0.85)",
                  border: "none",
                }}
              />
            </>
          )}
        </div>

        {/* Datos Principales */}
        <div className="catprofile-hero" style={{ marginTop: 20 }}>
          <h1 className="catprofile-name" style={{ marginBottom: 8 }}>
            {cat.name}
          </h1>
          <div className="catprofile-meta" style={{ display: "flex", gap: 8 }}>
            {cat.age && <Tag color="green">{cat.age}</Tag>}
            {cat.gender && <Tag color="magenta">{cat.gender}</Tag>}
          </div>
        </div>

        {/* Biografía / Historia */}
        <p className="catprofile-bio" style={{ fontSize: "1.05rem", lineHeight: 1.6, margin: "20px 0" }}>
          {cat.bio}
        </p>

        {/* Necesidades */}
        {cat.necesito.length > 0 && (
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
        )}

        {/* Superpoderes */}
        <div className="catprofile-section">
          <h2 className="catprofile-section-title">Mis superpoderes</h2>
          <ul className="catprofile-powers">
            {cat.superpoderes.map((s, i) => (
              <li key={i} className="catprofile-power">
                <span className="catprofile-power-label" style={{ fontWeight: 600 }}>
                  {s.label}:
                </span>{" "}
                {s.value || "No especificado"}
              </li>
            ))}
          </ul>
        </div>

        {/* Llamadas a la Acción (CTAs) */}
        <div
          className="catprofile-ctas"
          style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}
        >
          <Link to="/contacto" style={{ flex: 1, minWidth: 140 }}>
            <Button
              type="primary"
              size="large"
              block
              icon={<HeartOutlined />}
              style={{ backgroundColor: GREEN_COLOR, borderColor: GREEN_COLOR }}
            >
              Adóptame
            </Button>
          </Link>

          <Link to="/contacto" style={{ flex: 1, minWidth: 140 }}>
            <Button size="large" block icon={<HomeOutlined />}>
              Acógeme
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
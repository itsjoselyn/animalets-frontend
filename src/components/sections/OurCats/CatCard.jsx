import { Link } from "react-router-dom";
import { Card, Tag, Skeleton } from "antd";
import "./CatCard.css";
import { optimizeCloudinaryImage } from "../../../lib/optimizeCloudinaryImage";

const GREEN_COLOR = "#2e7d32";

export default function CatCard({ cat }) {
  const { id, name, age, gender, img, status } = cat;

  // Selecciona la primera imagen disponible
  const currentImage = Array.isArray(cat.imagenes) && cat.imagenes.length > 0
    ? (cat.imagenes[0]?.url || cat.imagenes[0])
    : img;

  const getStatusColor = (statusText) => {
    if (!statusText) return GREEN_COLOR;
    const statusLower = String(statusText).toLowerCase();
    if (statusLower.includes("reserv")) return "warning";
    if (statusLower.includes("urg")) return "error";
    return GREEN_COLOR;
  };

  return (
    <Link to={`/nuestros-peludos/${id}`} style={{ textDecoration: "none", display: "block" }}>
      <Card
        hoverable
        className="pcat-card"
        cover={
          <div style={{ position: "relative", height: "260px", overflow: "hidden", background: "#f0f2f5" }}>
            {currentImage ? (
              <>
                {/* Fondo desenfocado que rellena el hueco */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${optimizeCloudinaryImage(currentImage, { width: 100 })})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(20px) brightness(0.9)",
                    transform: "scale(1.2)",
                  }}
                />
                <img
                  src={optimizeCloudinaryImage(currentImage, { width: 400 })}
                  alt={name}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </>
            ) : (
              <Skeleton.Image active style={{ width: "100%", height: "100%" }} />
            )}

            {/* Badge de estado */}
            {status && (
              <div style={{ position: "absolute", left: 8, top: 8, zIndex: 2 }}>
                <Tag color={getStatusColor(status)} style={{ fontWeight: 600, fontSize: "12px" }}>
                  {status}
                </Tag>
              </div>
            )}
          </div>
        }
      >
        <Card.Meta
          title={<span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1f1f1f" }}>{name}</span>}
          description={
            <div style={{ marginTop: 8, display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {age && (
                <Tag style={{ color: GREEN_COLOR, borderColor: GREEN_COLOR, background: "#f6ffed", fontWeight: 500 }}>
                  {age}
                </Tag>
              )}
              {gender && (
                <Tag style={{ color: GREEN_COLOR, borderColor: GREEN_COLOR, background: "#f6ffed", fontWeight: 500 }}>
                  {gender}
                </Tag>
              )}
            </div>
          }
        />
      </Card>
    </Link>
  );
}
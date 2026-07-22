import { Link } from "react-router-dom";
import { Card, Tag, Skeleton } from "antd";
import { optimizeCloudinaryImage } from "../../../lib/optimizeCloudinaryImage";
import { normalizeBlogImages } from "./blogUtils";
import "./BlogCard.css";

export default function BlogCard({ post }) {
  if (!post) return null;

  const { id, date, title, img } = post;
  const images = normalizeBlogImages(post);
  const current = images.length > 0 ? images[0] : img || null;

  return (
    <Link to={`/blog/${id}`} style={{ textDecoration: "none", display: "block" }}>
      <Card
        hoverable
        style={{ borderRadius: 12, overflow: "hidden", height: "100%" }}
        cover={
          <div
            style={{
              position: "relative",
              height: "200px",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
            }}
          >
            {current ? (
              <img
                src={optimizeCloudinaryImage(current, { width: 500 })}
                alt={title || "Noticia del blog"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            ) : (
              <Skeleton.Image active style={{ width: "100%", height: "100%" }} />
            )}

            {/* Fecha flotante en la esquina de la imagen */}
            {date && (
              <div style={{ position: "absolute", top: 12, left: 12 }}>
                <Tag
                  bordered={false}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    color: "#1f1f1f",
                    fontWeight: 600,
                    borderRadius: 6,
                    padding: "2px 8px",
                  }}
                >
                  {date}
                </Tag>
              </div>
            )}
          </div>
        }
      >
        <Card.Meta
          title={
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#1f1f1f",
                whiteSpace: "normal", // Permite saltos de línea si el título es largo
                display: "-webkit-box",
                WebkitLineClamp: 2, // Limita a máximo 2 líneas
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.4,
              }}
            >
              {title || "Noticia sin título"}
            </div>
          }
        />
      </Card>
    </Link>
  );
}
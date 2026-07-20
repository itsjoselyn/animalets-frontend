import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./CatCard.css";
import { optimizeCloudinaryImage } from "../../../lib/optimizeCloudinaryImage";

export default function CatCard({ cat }) {
  const { id, name, age, gender, img, status } = cat;

  const images = Array.isArray(cat.imagenes)
    ? cat.imagenes.map((it) => (it && it.url ? it.url : it))
    : img
      ? [img]
      : [];

  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const current =
    images && images.length > 0 ? images[index % images.length] : null;

  const prev = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  const next = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    setIndex((i) => (i + 1) % images.length);
  };

  return (
    <Link
      to={`/nuestros-peludos/${id}`}
      className="pcat-card"
    >
      <div
        className="pcat-card-img-wrap"
        style={{ position: "relative" }}
      >
        {current ? (
          <img
            src={optimizeCloudinaryImage(current, { width: 400 })}
            alt={name}
            className="pcat-card-img"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className="skeleton"
            style={{ width: "100%", height: "100%" }}
          />
        )}

        {images.length > 1 && (
          <>
            <Button
              type="primary"
              shape="circle"
              icon={<LeftOutlined />}
              aria-label="Anterior"
              onClick={prev}
              style={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />

            <Button
              type="primary"
              shape="circle"
              icon={<RightOutlined />}
              aria-label="Siguiente"
              onClick={next}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </>
        )}

        {status && <div className="pcat-card-badge">{status}</div>}
      </div>

      <div className="pcat-card-info">
        <h2 className="pcat-card-name">{name}</h2>

        <div className="pcat-card-meta">
          <span>{age}</span>
          <span>{gender}</span>
        </div>
      </div>

      {modalOpen && current && (
        <div
          className="pcat-modal"
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
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
              maxWidth: "95%",
              maxHeight: "95%",
            }}
          >
            <img
              src={optimizeCloudinaryImage(current, { width: 1000 })}
              alt={name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: 8,
              }}
            />

            {images.length > 1 && (
              <>
                <Button
                  type="text"
                  icon={<LeftOutlined />}
                  aria-label="Anterior"
                  onClick={prev}
                  style={{
                    position: "absolute",
                    left: -40,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#fff",
                    fontSize: 28,
                  }}
                />

                <Button
                  type="text"
                  icon={<RightOutlined />}
                  aria-label="Siguiente"
                  onClick={next}
                  style={{
                    position: "absolute",
                    right: -40,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#fff",
                    fontSize: 28,
                  }}
                />
              </>
            )}

            <Button
              type="text"
              icon={<CloseOutlined />}
              aria-label="Cerrar"
              onClick={() => setModalOpen(false)}
              style={{
                position: "absolute",
                right: -10,
                top: -40,
                color: "#fff",
                fontSize: 28,
              }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}
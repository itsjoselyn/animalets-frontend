import { useState } from "react";
import { Link } from "react-router-dom";
import "./CatCard.css";
import { optimizeCloudinaryImage } from '../../../lib/optimizeCloudinaryImage';
import Button from "../../common/Button/Button";

export default function CatCard({ cat }) {
  const { id, name, age, gender, img, status } = cat;
  const images = Array.isArray(cat.imagenes) ? cat.imagenes.map((it) => (it && it.url ? it.url : it)) : (img ? [img] : []);
  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const current = images && images.length > 0 ? images[index % images.length] : null;

  const prev = (e) => { e && e.stopPropagation(); e && e.preventDefault(); setIndex((i) => (i - 1 + images.length) % images.length); };
  const next = (e) => { e && e.stopPropagation(); e && e.preventDefault(); setIndex((i) => (i + 1) % images.length); };

  return (
    <Link to={`/nuestros-peludos/${id}`} className="pcat-card" onClick={() => { /* allow link navigation */ }}>
      <div className="pcat-card-img-wrap" style={{ position: 'relative' }}>
        {current ? (
          <img
            src={optimizeCloudinaryImage(current, 400)}
            alt={name}
            className="pcat-card-img"
            onClick={(e) => e.stopPropagation()} />
        ) : (
          <div className="skeleton" style={{ width: "100%", height: "100%" }} />
        )}

        {images.length > 1 && (
          <>
            <Button variant="img-arrow-left" aria-label="Anterior" onClick={prev} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}>◀</Button>
            <Button variant="img-arrow-right" aria-label="Siguiente" onClick={next} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>▶</Button>  </>
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
        <div className="pcat-modal" onClick={() => setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '95%', maxHeight: '95%' }}>
            <img src={optimizeCloudinaryImage(current, 1000)} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }} />
            {images.length > 1 && (
              <>
                <Button aria-label="Anterior" onClick={prev} style={{ position: 'absolute', left: -40, top: '50%', transform: 'translateY(-50%)', background: 'transparent', color: '#fff', border: 'none', fontSize: 28 }}>◀</Button>
                <Button aria-label="Siguiente" onClick={next} style={{ position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)', background: 'transparent', color: '#fff', border: 'none', fontSize: 28 }}>▶</Button>  </>
            )}
            <Button aria-label="Cerrar" onClick={() => setModalOpen(false)} style={{ position: 'absolute', right: -10, top: -40, background: 'transparent', color: '#fff', border: 'none', fontSize: 28 }}>✕</Button>          </div>
        </div>
      )}
    </Link>
  );
}

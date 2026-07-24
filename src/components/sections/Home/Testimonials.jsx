import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { Skeleton, Empty } from "antd";
import "./Testimonials.css";

function Timeline({ items, active, onSelect }) {
  return (
    <div className="testi-timeline">
      <div className="testi-line" />
      {items.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            aria-label={t.name}
            className={`testi-node ${isActive ? "testi-node--active" : ""}`}
          >
            <span className="testi-node-dot" />
            <span className="testi-node-name">{t.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState("");
  const [searchParams] = useSearchParams();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargamos los testimonios desde Firestore
  useEffect(() => {
    let mounted = true;
    async function loadTestimonials() {
      setLoading(true);
      try {
        const q = collection(db, "testimonios");
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data() || {};
          return {
            id: doc.id,
            preview: data.preview || data.descripcion || data.texto || data.body || "",
            full: `/testimonios/${doc.id}`,
          };
        });

        if (mounted) {
          setTestimonials(docs);
          setActive((current) => current || docs[0]?.id || "");
        }
      } catch (err) {
        console.error("Error cargando testimonios desde Firestore:", err);
        if (mounted) setTestimonials([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadTestimonials();
    return () => {
      mounted = false;
    };
  }, []);

  // Sincronización con el query param ?testimonio=id
  useEffect(() => {
    const id = searchParams.get("testimonio");
    if (id) {
      setActive(id);
      setTimeout(() => {
        document.getElementById("testimonios")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [searchParams]);

  const desktopList = testimonials.slice(0, 5);
  const mobileList = testimonials.slice(0, 3);

  const current = testimonials.find((t) => t.id === active) || testimonials[0];

  return (
    <section className="testi" id="testimonios" aria-label="Testimonios de adoptantes">
      <div className="testi-body">

        <h2 className="testi-title">Testimonios</h2>

        {loading ? (
          <div className="testi-loading" style={{ padding: "20px 0" }}>
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : testimonials.length === 0 ? (
          <Empty description="No hay testimonios publicados todavía." />
        ) : (
          <>
            {/* Timeline Mobile */}
            <div className="testi-timeline-mobile">
              <Timeline items={mobileList} active={active} onSelect={setActive} />
            </div>

            {/* Timeline Desktop */}
            <div className="testi-timeline-desktop">
              <Timeline items={desktopList} active={active} onSelect={setActive} />
            </div>

            {/* Previsualización del testimonio seleccionado */}
            <div className="testi-content" key={active}>
              {current && (
                <Link to={current.full} className="testi-preview" style={{ textDecoration: "none", color: "inherit" }}>
                  <blockquote
                    style={{
                      margin: 0,
                      fontStyle: "italic",
                      fontSize: "1.35rem", // Tamaño más grande y vistoso
                      lineHeight: "1.6",
                      fontWeight: 500,
                    }}
                  >
                    "{current.preview}"
                  </blockquote>
                </Link>
              )}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
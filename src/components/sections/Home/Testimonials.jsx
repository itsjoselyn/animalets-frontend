import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Testimonials.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

function Timeline({ items, active, onSelect }) {
  return (
    <div className="testi-timeline">
      <div className="testi-line" />
      {items.map((t) => (
        <button
          key={t.id}
          className={`testi-node${active === t.id ? " testi-node--active" : ""}`}
          onClick={() => onSelect(t.id)}
          aria-label={t.name}
        >
          <span className="testi-node-dot" />
          <span className="testi-node-name">{t.name}</span>
        </button>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState("");
  const [searchParams] = useSearchParams();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load testimonios from Firestore (collection: 'testimonios')
  useEffect(() => {
    let mounted = true;
    async function loadTestimonials() {
      setLoading(true);
      try {
        const q = collection(db, "testimonios");
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || data.nombre || "",
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

  // Limit lists: mobile = first 3, desktop = first 5
  const desktopList = testimonials.slice(0, 5);
  const current = testimonials.length ? testimonials.find((t) => t.id === active) || testimonials[0] : null;
  const mobileList = testimonials.slice(0, 3);
  const activeMobileId = mobileList.some((t) => t.id === active) ? active : mobileList[0]?.id || "";
  const activeDesktopId = desktopList.some((t) => t.id === active) ? active : desktopList[0]?.id || "";

  useEffect(() => {
    const id = searchParams.get("testimonio");
    if (id) {
      setActive(id);
      setTimeout(() => {
        document.getElementById("testimonios")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [searchParams]);

  return (
    <section className="testi" id="testimonios">
      <div className="testi-body">

        <h2 className="testi-title">Testimonios</h2>

        {loading && testimonials.length === 0 ? (
          <div className="testi-loading">
            <div className="testi-timeline-skeleton">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="testi-node-skeleton">
                  <span className="testi-node-dot skeleton" />
                  <span className="testi-node-name-skel skeleton" />
                </div>
              ))}
            </div>
            <div className="testi-preview-skel skeleton" />
          </div>
        ) : (

          <>
            <div className="testi-timeline-mobile">
              <Timeline items={mobileList} active={activeMobileId} onSelect={setActive} />
            </div>

            <div className="testi-timeline-desktop">
              <Timeline items={desktopList} active={activeDesktopId} onSelect={setActive} />
            </div>

            <div className="testi-content" key={active}>
              {current ? (
                <Link to={current.full} className="testi-preview">
                  {current.preview}
                </Link>
              ) : (
                <p>No hay testimonios publicados todavía.</p>
              )}
            </div>
          </>

        )}

      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Testimonials.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Juana",
    preview: "Desde el primer día me sentí parte de algo especial. El equipo de Animalets me recibió con los brazos abiertos y los gatitos hicieron el resto. Nunca había experimentado una conexión tan bonita con los animales...",
    full: "/testimonios/juana",
  },
  {
    id: 2,
    name: "Josep",
    preview: "Apadrinar a Mochi cambió mi vida por completo. Cada visita es una alegría enorme, verle crecer y saber que mi aportación mensual le da una vida digna y llena de amor es algo que no tiene precio...",
    full: "/testimonios/josep",
  },
  {
    id: 3,
    name: "Maria",
    preview: "Nunca pensé que abrir mi casa temporalmente me daría tanto. Los gatitos llegan asustados y en pocas semanas se convierten en pequeños valientes. El apoyo de Animalets durante todo el proceso es increíble...",
    full: "/testimonios/maria",
  },
  {
    id: 4,
    name: "Carles",
    preview: "Hacerse socio fue la mejor decisión del año. Saber que cada mes contribuyo a que más gatos tengan una oportunidad real de encontrar un hogar me llena de satisfacción. La transparencia del equipo es total...",
    full: "/testimonios/carles",
  },
  {
    id: 5,
    name: "Laura",
    preview: "El proceso de acogida fue muy sencillo y el apoyo del equipo constante en todo momento. Cuando llegó el día de la adopción definitiva lloré de emoción. Fue una experiencia que repetiría mil veces...",
    full: "/testimonios/laura",
  },
];

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
  const [active, setActive] = useState(1);
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
        const docs = snapshot.docs.map((doc, idx) => {
          const data = doc.data();
          return {
            id: idx + 1,
            name: data.name || data.nombre || `Testimonio ${idx + 1}`,
            // Use only the explicit `preview` field for the home summary.
            preview: data.preview || "",
            full: `/testimonios/${doc.id}`,
          };
        });
        if (mounted) {
          if (docs.length > 0) setTestimonials(docs);
          else setTestimonials(TESTIMONIALS); // fallback only after loading
        }
      } catch (err) {
        console.error("Error cargando testimonios desde Firestore:", err);
        if (mounted) setTestimonials(TESTIMONIALS); // fallback on error
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
  const desktopActive = active > desktopList.length ? 1 : active;
  const current = testimonials.length ? testimonials.find((t) => t.id === active) || testimonials[0] : null;
  const mobileList = testimonials.slice(0, 3);
  const mobileActive = active > mobileList.length ? 1 : active;

  useEffect(() => {
    const id = Number(searchParams.get("testimonio"));
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
              <Timeline items={mobileList} active={mobileActive} onSelect={setActive} />
            </div>

            <div className="testi-timeline-desktop">
              <Timeline items={desktopList} active={desktopActive} onSelect={setActive} />
            </div>

            <div className="testi-content" key={active}>
              {current ? (
                <Link to={current.full} className="testi-preview">
                  {current.preview}
                </Link>
              ) : null}
            </div>
          </>

        )}

      </div>
    </section>
  );
}

import { useState, useEffect, useMemo } from "react";
import CatCard from "./CatCard";
import "./CatGrid.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { PAGE_SIZE } from "../../../utils/constants";

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

export default function CatGrid({ filters = { ageRange: [0, 25], sexo: { macho: false, hembra: false } }, sortValue = null }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [allCats, setAllCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadCats() {
      setLoading(true);
      try {
        const q = collection(db, "gatos");
        const snapshot = await getDocs(q);
        const docs = snapshot.docs
          .map((doc, idx) => {
            const data = doc.data() || {};
            const rawAge = data.edad ?? data.age ?? null;
            const ageValue = typeof rawAge === "number" ? rawAge : parseInt(String(rawAge || ""), 10) || 0;
            return {
              id: doc.id,
              name: data.nombre || data.name || `Gato ${idx + 1}`,
              age: formatAge(ageValue ?? rawAge),
              ageValue,
              origIndex: idx,
              gender: data.sexo || data.gender || "",
              img: (Array.isArray(data.imagenes) && data.imagenes[0] && data.imagenes[0].url) || data.imagen || data.image || data.img || "",
              status: data.apadrinado ? "Apadrinado" : null,
              bio: data.historia || data.bio || "",
              necesito: data.necesidades || data.necesito || [],
              superpoderes: mapSuperpowers(data.superpoderes || data.superpowers || {}),
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              // derive adoptado from new `estado` field, fallback to legacy boolean
              adoptado: (data.estado === 'adoptado') || data.adoptado || false,
              estado: data.estado || (data.adoptado === true ? 'adoptado' : 'disponible'),
            };
          })

        if (mounted) {
          setAllCats(docs);
        }
      } catch (err) {
        console.error("Error cargando gatos desde Firestore:", err);
        if (mounted) setAllCats([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadCats();
    return () => { mounted = false; };
  }, []);

  const processed = useMemo(() => {
    const maleRe = /(macho|male)/i;
    const femaleRe = /(hembra|female)/i;
    let arr = Array.isArray(allCats) ? allCats.slice() : [];

    // Apply filters
    if (filters) {
      const [minAge, maxAge] = filters.ageRange ?? [0, 25];
      const sexo = filters.sexo ?? { macho: false, hembra: false };
      const debugResults = [];
      arr = arr.filter((c) => {
        const a = c.ageValue ?? (typeof c.age === "number" ? c.age : parseInt(String(c.age || ""), 10) || 0);
        let pass = true;
        let reason = 'ok';
        if (a < minAge || a > maxAge) { pass = false; reason = `age ${a} out of ${minAge}-${maxAge}`; }
        else if (sexo.macho && !sexo.hembra) { pass = maleRe.test(String(c.gender || "")); if (!pass) reason = `gender ${c.gender} not macho`; }
        else if (!sexo.macho && sexo.hembra) { pass = femaleRe.test(String(c.gender || "")); if (!pass) reason = `gender ${c.gender} not hembra`; }
        debugResults.push({ id: c.id, name: c.name, ageValue: a, gender: c.gender, pass, reason });
        return pass;
      });
      try {
        console.debug('CatGrid: filter debug', JSON.stringify(debugResults, null, 2));
      } catch (e) {
        console.debug('CatGrid: filter debug (fallback)');
      }
    }

    // Apply sort/filter shortcuts
    if (sortValue === "age_asc") {
      arr.sort((a, b) => (a.ageValue || 0) - (b.ageValue || 0));
    } else if (sortValue === "age_desc") {
      arr.sort((a, b) => (b.ageValue || 0) - (a.ageValue || 0));
    } else if (sortValue === "macho" || sortValue === "hembra") {
      const isMaleSort = sortValue === "macho";
      arr.sort((a, b) => {
        const aMatch = isMaleSort ? /(macho|male)/i.test(String(a.gender || "")) : /(hembra|female)/i.test(String(a.gender || ""));
        const bMatch = isMaleSort ? /(macho|male)/i.test(String(b.gender || "")) : /(hembra|female)/i.test(String(b.gender || ""));
        if (aMatch === bMatch) return (a.origIndex ?? 0) - (b.origIndex ?? 0);
        return aMatch ? -1 : 1;
      });
    }

    return arr;
  }, [allCats, filters, sortValue]);


  const finalProcessed = processed;

  const total = finalProcessed.length;
  const shown = finalProcessed.slice(0, visible);
  const hasMore = visible < total;
  const progress = total > 0 ? Math.round((shown.length / total) * 100) : 0;

  return (
    <div className="cat-grid-wrap">

      {/* Grid */}
      <div className="cat-grid">
        {loading ? (
          Array.from({ length: Math.min(PAGE_SIZE, 8) }).map((_, i) => (
            <div key={i} className="cat-skeleton">
              <div className="cat-skel-img skeleton" />
              <div className="cat-skel-name skeleton" />
              <div className="cat-skel-meta skeleton" />
            </div>
          ))
        ) : finalProcessed.length === 0 ? (
          <p>No hay gatos publicados todavía.</p>
        ) : (
          shown.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))
        )}
      </div>

      {!loading && (
        <div className="cat-grid-footer">
          <p className="cat-grid-count">
            Mostrando {shown.length} de {processed.length} resultados
          </p>
          <div className="cat-grid-progress-bar">
            <div
              className="cat-grid-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          {hasMore && (
            <button
              className="cat-grid-more-btn"
              onClick={() => setVisible((v) => Math.min(v + PAGE_SIZE, processed.length))}
            >
              Mostrar más
            </button>
          )}
        </div>
      )}

    </div>
  );
}

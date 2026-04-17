import { useState, useEffect, useMemo } from "react";
import CatCard from "./CatCard";
import "./CatGrid.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const CATS_DATA = [
  { id: 1,  name: "Steven",   age: "7 años", gender: "Macho",  img: "https://placecats.com/neo/300/400",        status: "Apadrinado" },
  { id: 2,  name: "Luna",     age: "2 años", gender: "Hembra", img: "https://placecats.com/millie/300/400",     status: null },
  { id: 3,  name: "Mochi",    age: "1 año",  gender: "Macho",  img: "https://placecats.com/bella/300/400",      status: null },
  { id: 4,  name: "Nala",     age: "3 años", gender: "Hembra", img: "https://placecats.com/neo_2/300/400",      status: null },
  { id: 5,  name: "Simba",    age: "4 años", gender: "Macho",  img: "https://placecats.com/millie_neo/300/400", status: "Apadrinado" },
  { id: 6,  name: "Cleo",     age: "2 años", gender: "Hembra", img: "https://placecats.com/300/400",            status: null },
  { id: 7,  name: "Tigre",    age: "5 años", gender: "Macho",  img: "https://placecats.com/neo/300/400",        status: null },
  { id: 8,  name: "Mimi",     age: "1 año",  gender: "Hembra", img: "https://placecats.com/millie/300/400",     status: null },
  { id: 9,  name: "Garfield", age: "6 años", gender: "Macho",  img: "https://placecats.com/bella/300/400",      status: null },
  { id: 10, name: "Perla",    age: "2 años", gender: "Hembra", img: "https://placecats.com/neo_2/300/400",      status: null },
  { id: 11, name: "Rocky",    age: "3 años", gender: "Macho",  img: "https://placecats.com/millie_neo/300/400", status: null },
  { id: 12, name: "Isis",     age: "4 años", gender: "Hembra", img: "https://placecats.com/300/400",            status: "Apadrinado" },
  { id: 13, name: "Kiko",     age: "1 año",  gender: "Macho",  img: "https://placecats.com/neo/300/400",        status: null },
  { id: 14, name: "Mora",     age: "2 años", gender: "Hembra", img: "https://placecats.com/millie/300/400",     status: null },
  { id: 15, name: "Bruno",    age: "5 años", gender: "Macho",  img: "https://placecats.com/bella/300/400",      status: null },
  { id: 16, name: "Lola",     age: "3 años", gender: "Hembra", img: "https://placecats.com/neo_2/300/400",      status: null },
  { id: 17, name: "Paco",     age: "7 años", gender: "Macho",  img: "https://placecats.com/millie_neo/300/400", status: null },
  { id: 18, name: "Nina",     age: "1 año",  gender: "Hembra", img: "https://placecats.com/300/400",            status: null },
  { id: 19, name: "Max",      age: "4 años", gender: "Macho",  img: "https://placecats.com/neo/300/400",        status: null },
  { id: 20, name: "Tina",     age: "2 años", gender: "Hembra", img: "https://placecats.com/millie/300/400",     status: "Apadrinado" },
  { id: 21, name: "Thor",     age: "3 años", gender: "Macho",  img: "https://placecats.com/bella/300/400",      status: null },
  { id: 22, name: "Gala",     age: "6 años", gender: "Hembra", img: "https://placecats.com/neo_2/300/400",      status: null },
  { id: 23, name: "Nano",     age: "1 año",  gender: "Macho",  img: "https://placecats.com/millie_neo/300/400", status: null },
  { id: 24, name: "Vera",     age: "5 años", gender: "Hembra", img: "https://placecats.com/300/400",            status: null },
  { id: 25, name: "Leo",      age: "2 años", gender: "Macho",  img: "https://placecats.com/neo/300/400",        status: null },
];

const PAGE_SIZE = 12;

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
              img: data.imagen || data.image || data.img || "https://placecats.com/300/400",
              status: data.apadrinado ? "Apadrinado" : null,
              bio: data.historia || data.bio || "",
              necesito: data.necesidades || data.necesito || [],
              superpoderes: mapSuperpowers(data.superpoderes || data.superpowers || {}),
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              adoptado: data.adoptado || false,
            };
          })
          .filter((c) => !c.adoptado);

        if (mounted) {
          if (docs.length > 0) setAllCats(docs);
          else setAllCats(CATS_DATA.map((c, i) => ({ ...c, ageValue: typeof c.age === "number" ? c.age : parseInt(String(c.age || ""), 10) || 0, origIndex: i })));
        }
      } catch (err) {
        console.error("Error cargando gatos desde Firestore:", err);
        if (mounted) setAllCats(CATS_DATA.map((c, i) => ({ ...c, ageValue: typeof c.age === "number" ? c.age : parseInt(String(c.age || ""), 10) || 0, origIndex: i })));
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
      arr = arr.filter((c) => {
        const a = c.ageValue ?? (typeof c.age === "number" ? c.age : parseInt(String(c.age || ""), 10) || 0);
        if (a < minAge || a > maxAge) return false;
        if (sexo.macho && !sexo.hembra) return maleRe.test(String(c.gender || ""));
        if (!sexo.macho && sexo.hembra) return femaleRe.test(String(c.gender || ""));
        return true;
      });
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

  const total = processed.length;
  const shown = processed.slice(0, visible);
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

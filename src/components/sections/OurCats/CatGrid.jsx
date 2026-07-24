import { useState, useEffect, useMemo } from "react";
import CatCard from "./CatCard";
import "./CatGrid.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { PAGE_SIZE } from "../../../utils/constants";
import { Pagination, Empty, Card } from "antd";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [allCats, setAllCats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga inicial desde Firebase
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
            const estado = data.estado || (data.adoptado === true ? 'adoptado' : 'disponible');

            return {
              id: doc.id,
              name: data.nombre || data.name || `Gato ${idx + 1}`,
              age: formatAge(ageValue ?? rawAge),
              ageValue,
              origIndex: idx,
              gender: data.sexo || data.gender || "",
              img: (Array.isArray(data.imagenes) && data.imagenes[0] && data.imagenes[0].url) || data.imagen || data.image || data.img || "",
              imagenes: data.imagenes || [],
              status: data.apadrinado ? "Apadrinado" : null,
              bio: data.historia || data.bio || "",
              necesito: data.necesidades || data.necesito || [],
              superpoderes: mapSuperpowers(data.superpoderes || data.superpowers || {}),
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              adoptado: (estado === 'adoptado') || data.adoptado || false,
              estado: estado,
            };
          })
          // 🔹 FILTRO: Solo mostramos gatos que NO estén adoptados
          .filter((cat) => cat.estado !== "adoptado" && !cat.adoptado);

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

  // Volver a la página 1 cada vez que cambien los filtros o el orden
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortValue]);

  // Filtrado y Ordenación
  const processed = useMemo(() => {
    const maleRe = /(macho|male)/i;
    const femaleRe = /(hembra|female)/i;
    let arr = Array.isArray(allCats) ? allCats.slice() : [];

    // Filtros
    if (filters) {
      const [minAge, maxAge] = filters.ageRange ?? [0, 25];
      const sexo = filters.sexo ?? { macho: false, hembra: false };

      arr = arr.filter((c) => {
        const a = c.ageValue ?? (typeof c.age === "number" ? c.age : parseInt(String(c.age || ""), 10) || 0);
        let pass = true;

        if (a < minAge || a > maxAge) {
          pass = false;
        } else if (sexo.macho && !sexo.hembra) {
          pass = maleRe.test(String(c.gender || ""));
        } else if (!sexo.macho && sexo.hembra) {
          pass = femaleRe.test(String(c.gender || ""));
        }

        return pass;
      });
    }

    // Orden
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

  // Cálculo de los elementos visibles según la página actual
  const shown = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, currentPage, pageSize]);

  const handlePageChange = (page, newPageSize) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  return (
    <div className="cat-grid-wrap">
      {/* Grid de Gatos */}
      <div className="cat-grid">
        {loading ? (
          Array.from({ length: pageSize }).map((_, i) => (
            <Card key={i} style={{ borderRadius: 12 }} loading />
          ))
        ) : processed.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", padding: "40px 0" }}>
            <Empty description="No se encontraron peludos con estos filtros" />
          </div>
        ) : (
          shown.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))
        )}
      </div>

      {/* Paginación de Ant Design */}
      {!loading && processed.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40, marginBottom: 20 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={processed.length}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["8", "12", "16", "24"]}
            showTotal={(total, range) => `${range[0]}-${range[1]} de ${total} peludos`}
          />
        </div>
      )}
    </div>
  );
}
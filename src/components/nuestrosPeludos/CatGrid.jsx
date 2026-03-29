import { useState } from "react";
import CatCard from "./CatCard";
import "./CatGrid.css";

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

export default function CatGrid() {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const shown = CATS_DATA.slice(0, visible);
  const hasMore = visible < CATS_DATA.length;
  const progress = Math.round((visible / CATS_DATA.length) * 100);

  return (
    <div className="cat-grid-wrap">

      {/* Grid */}
      <div className="cat-grid">
        {shown.map((cat) => (
          <CatCard key={cat.id} cat={cat} />
        ))}
      </div>

      {/* Footer: contador + barra + botón */}
      <div className="cat-grid-footer">
        <p className="cat-grid-count">
          Mostrando {shown.length} de {CATS_DATA.length} resultados
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
            onClick={() => setVisible((v) => Math.min(v + PAGE_SIZE, CATS_DATA.length))}
          >
            Mostrar más
          </button>
        )}
      </div>

    </div>
  );
}

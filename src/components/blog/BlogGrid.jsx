import { useState } from "react";
import BlogCard from "./BlogCard";
import "./BlogGrid.css";

const POSTS = [
  { id: 1,  date: "03 Dic, 2024", title: "Qué debes saber antes de bañar a tu gato",         img: "https://placecats.com/neo/400/300" },
  { id: 2,  date: "20 Nov, 2024", title: "Cómo preparar tu casa para acoger un gato",         img: "https://placecats.com/millie/400/300" },
  { id: 3,  date: "05 Nov, 2024", title: "Los mejores juguetes para gatos de interior",        img: "https://placecats.com/bella/400/300" },
  { id: 4,  date: "18 Oct, 2024", title: "Señales de que tu gato está estresado",              img: "https://placecats.com/neo_2/400/300" },
  { id: 5,  date: "02 Oct, 2024", title: "Alimentación saludable para gatos mayores",          img: "https://placecats.com/millie_neo/400/300" },
  { id: 6,  date: "15 Sep, 2024", title: "Por qué los gatos ronronean y qué significa",        img: "https://placecats.com/neo/400/300" },
  { id: 7,  date: "01 Sep, 2024", title: "Adoptar un gato adulto: ventajas que no conocías",   img: "https://placecats.com/millie/400/300" },
  { id: 8,  date: "10 Ago, 2024", title: "Cómo socializar a un gato asustadizo",               img: "https://placecats.com/bella/400/300" },
  { id: 9,  date: "22 Jul, 2024", title: "El apadrinamiento: una forma de ayudar desde casa",  img: "https://placecats.com/neo_2/400/300" },
  { id: 10, date: "08 Jul, 2024", title: "5 cosas que los gatos intentan decirte",             img: "https://placecats.com/millie_neo/400/300" },
  { id: 11, date: "20 Jun, 2024", title: "Cómo llevar a tu gato al veterinario sin estrés",   img: "https://placecats.com/neo/400/300" },
  { id: 12, date: "05 Jun, 2024", title: "Historia de Mochi: de la calle a un hogar",          img: "https://placecats.com/millie/400/300" },
  { id: 13, date: "18 May, 2024", title: "Voluntariado en Animalets: así fue mi experiencia",  img: "https://placecats.com/bella/400/300" },
];

const PAGE_SIZE = 5;

export default function BlogGrid() {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = POSTS.slice(0, visible);
  const hasMore = visible < POSTS.length;
  const progress = Math.round((visible / POSTS.length) * 100);

  return (
    <div className="blog-grid-wrap">
      <div className="blog-grid">
        {shown.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      <div className="blog-grid-footer">
        <p className="blog-grid-count">
          Mostrando {shown.length} de {POSTS.length} resultados
        </p>
        <div className="blog-grid-progress-bar">
          <div
            className="blog-grid-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        {hasMore && (
          <button
            className="blog-grid-more-btn"
            onClick={() => setVisible((v) => Math.min(v + PAGE_SIZE, POSTS.length))}
          >
            Mostrar más
          </button>
        )}
      </div>
    </div>
  );
}

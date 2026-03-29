import { Link } from "react-router-dom";
import "./BlogCard.css";

export default function BlogCard({ post }) {
  const { id, date, title, img } = post;

  return (
    <Link to={`/blog/${id}`} className="blog-card">
      <div className="blog-card-inner">
        {/* Fecha arriba izquierda */}
        <span className="blog-card-date">{date}</span>

        {/* Foto encajada arriba derecha */}
        <div className="blog-card-img-wrap">
          <img src={img} alt={title} className="blog-card-img" />
        </div>

        {/* Título abajo */}
        <h2 className="blog-card-title">{title}</h2>
      </div>
    </Link>
  );
}

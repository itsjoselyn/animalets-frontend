import { Link } from "react-router-dom";
import "./BlogCard.css";

export default function BlogCard({ post }) {
  const { id, date, title, img } = post;

  return (
    <Link to={`/blog/${id}`} className="blog-card">
      <div className="blog-card-inner">

        {/* Top: fecha izquierda + foto derecha */}
        <div className="blog-card-top">
          <span className="blog-card-date">{date}</span>
          <div className="blog-card-img-wrap">
            {img ? <img src={img} alt={title} className="blog-card-img" /> : <div className="skeleton" style={{ width: "100%", height: "100%" }} />}
          </div>
        </div>

        {/* Título abajo izquierda */}
        <div className="blog-card-title">{title}</div>

      </div>
    </Link>
  );
}

import { Link } from "react-router-dom";
import "./CatCard.css";

export default function CatCard({ cat }) {
  const { id, name, age, gender, img, status } = cat;

  return (
    <Link to={`/nuestros-peludos/${id}`} className="pcat-card">
      <div className="pcat-card-img-wrap">
        <img src={img} alt={name} className="pcat-card-img" />
        {status && <div className="pcat-card-badge">{status}</div>}
      </div>
      <div className="pcat-card-info">
        <h2 className="pcat-card-name">{name}</h2>
        <div className="pcat-card-meta">
          <span>{age}</span>
          <span>{gender}</span>
        </div>
      </div>
    </Link>
  );
}

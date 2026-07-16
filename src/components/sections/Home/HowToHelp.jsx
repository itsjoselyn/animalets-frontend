import "./HowToHelp.css";
import { Link } from "react-router-dom";
import { optimizeCloudinaryImage } from '../../../lib/optimizeCloudinaryImage';

const OPTIONS = [
  { id: 1, title: "Voluntariado", link: "/como-ayudar/voluntariado", img: "https://placecats.com/neo/300/400" },
  { id: 2, title: "Apadrinar un Gato", link: "/como-ayudar/apadrinar", img: "https://placecats.com/millie/300/400" },
  { id: 3, title: "Hacerse Socio", link: "/como-ayudar/socio", img: "https://placecats.com/bella/300/400" },
  { id: 4, title: "Casa de Acogida", link: "/como-ayudar/acogida", img: "https://placecats.com/neo_2/300/400" },
];

export default function HowToHelp() {
  return (
    <section className="hthelp">

      <div className="hthelp-header">
        <h2 className="hthelp-title">¿Cómo ayudar?</h2>
        <div className="hthelp-arrow-down">↓</div>
      </div>

      <div className="hthelp-grid">
        {OPTIONS.map((opt) => (
          <Link key={opt.id} to={opt.link} className="hthelp-card">
            <div className="hthelp-card-img-wrap">
              <img src={optimizeCloudinaryImage(opt.img, 300)} alt={opt.title} className="hthelp-card-img" />
            </div>
            <div className="hthelp-card-body">
              <h3 className="hthelp-card-title">{opt.title}</h3>
            </div>
          </Link>
        ))}

        <Link to="/como-ayudar" className="hthelp-card hthelp-card--more">
          <div className="hthelp-more-inner">
            <span className="hthelp-more-plus">+</span>
            <span className="hthelp-more-label">Ver más<br />formas de ayudar</span>
          </div>
        </Link>
      </div>

    </section>
  );
}

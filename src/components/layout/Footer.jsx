import { Link } from "react-router-dom";
import logo from "../../assets/animalets-logo.png";
import "./Footer.css";

const NAV_LINKS = [
  { label: "Sobre nosotros", to: "/sobre-nosotros" },
  { label: "Nuestros peludos", to: "/nuestros-peludos" },
  { label: "Cómo ayudar", to: "/como-ayudar" },
  { label: "Blog", to: "/blog" },
  { label: "Contacto", to: "/contacto" },
];

const SOCIAL_LINKS = [
  { label: "Política de privacidad", to: "/privacidad", external: false },
  { label: "Instagram", href: "https://instagram.com/animaletslallagosta", external: true },
  { label: "Facebook", href: "https://facebook.com/animaletslallagosta", external: true },
  { label: "TikTok", href: "https://tiktok.com/@animaletslallagosta", external: true },
];

function UnderlineLink({ children, to, href, external }) {
  const cls = "footer-link";
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  }
  return <Link to={to} className={cls}>{children}</Link>;
}

export default function Footer() {
  return (
    <footer className="footer">
      {/* Línea verde superior */}
      <div className="footer-topline" />

      <div className="footer-inner">

        {/* Fila superior: logo + ubicación */}
        <div className="footer-top">
          <div className="footer-logo-wrap">
            <img src={logo} alt="Animalets logo" className="footer-logo" />
          </div>
          <div className="footer-location">
            <span>G56R+4M</span>
            <span>Montcada i Reixac</span>
          </div>
        </div>

        {/* Fila inferior: nav izquierda + social derecha */}
        <div className="footer-bottom">
          <nav className="footer-nav">
            {NAV_LINKS.map((l) => (
              <UnderlineLink key={l.to} to={l.to}>{l.label}</UnderlineLink>
            ))}
          </nav>

          <div className="footer-social">
            {SOCIAL_LINKS.map((l) => (
              <UnderlineLink key={l.label} to={l.to} href={l.href} external={l.external}>
                {l.label}
              </UnderlineLink>
            ))}
            <a href="mailto:animaletslallagosta@gmail.com" className="footer-link footer-email">
              animaletslallagosta@gmail.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

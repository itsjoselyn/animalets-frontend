import { Link } from "react-router-dom";
import { EnvironmentOutlined } from "@ant-design/icons";
import logo from "../../assets/animalets-logo.png";
import "./Footer.css";
import { NAV_LINKS, SOCIAL_LINKS } from "../../data/navigation";
import { UnderlineLink } from "../common/UnderlineLink";

const GREEN_COLOR = "#2e7d32";
const MAPS_URL = "https://www.google.com/maps/place/Animalets/@41.5102715,2.1890899,699m/data=!3m2!1e3!4b1!4m6!3m5!1s0x12a4bf0031c1e9cf:0x8f876865db3ff1f8!8m2!3d41.5102715!4d2.1916648!16s%2Fg%2F11vqvrbc26?entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D";

function Footer() {
  return (
    <footer className="footer" style={{ padding: "16px 0 12px 0", fontSize: "0.85rem" }}>
      {/* Línea verde superior */}
      <div className="footer-topline" />

      <div className="footer-inner">

        {/* Fila superior: logo + ubicación */}
        <div className="footer-top">
          <div className="footer-logo-wrap">
            <img
              src={logo}
              alt="Animalets logo"
              className="footer-logo"
              style={{ height: 38, width: "auto" }}
            />
          </div>

          {/* Ubicación linkeada a Google Maps */}
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-location"
            style={{ fontSize: "0.82rem", lineHeight: 1.3, textDecoration: "none", color: "inherit" }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <EnvironmentOutlined style={{ color: GREEN_COLOR }} />
              G56R+4M
            </span>
            <span>Montcada i Reixac</span>
          </a>
        </div>

        {/* Fila inferior: nav izquierda + social derecha (espaciado reducido) */}
        <div className="footer-bottom" style={{ marginTop: 8, paddingTop: 6 }}>
          <nav className="footer-nav" style={{ fontSize: "0.85rem", gap: 16 }}>
            {NAV_LINKS.map((l) => (
              <UnderlineLink key={l.to} to={l.to}>{l.label}</UnderlineLink>
            ))}
          </nav>

          <div className="footer-social" style={{ fontSize: "0.85rem", gap: 16 }}>
            {SOCIAL_LINKS.map((l) => (
              <UnderlineLink key={l.label} to={l.to} href={l.href} external={l.external}>
                {l.label}
              </UnderlineLink>
            ))}
            <a
              href="mailto:animaletslallagosta@gmail.com"
              className="footer-link footer-email"
              style={{ fontSize: "0.82rem" }}
            >
              animaletslallagosta@gmail.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
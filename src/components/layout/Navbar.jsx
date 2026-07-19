import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/animalets-logo.jpeg";
import "./Navbar.css";
import { NAV_LINKS } from "../../data/navigation";
import { Button } from 'antd';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Bloquear el scroll de la pantalla únicamente cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* Fijamos las clases 'at-top visible' para que el fondo blanco nunca desaparezca */}
      <nav className="navbar at-top visible">

        {/* MOBILE: menú hamburguesa izquierda */}
        <div className="navbar-left">
          <Button variant="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
            <div className={`hamburger-icon ${menuOpen ? "open" : ""}`}>
              <span /><span /><span />
            </div>
            MENÚ
          </Button>
        </div>

        {/* Logo */}
        <div className="navbar-center">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="Animalets" className="navbar-logo-img" />
          </Link>
        </div>

        {/* DESKTOP: links centrados */}
        <ul className="navbar-links">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="nav-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Adopta ya */}
        <Button type="primary" onClick={() => window.location.href = '/nuestros-peludos'}>
          Adopta ya
        </Button>

      </nav>

      {/* MOBILE ONLY: menú overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}>
        <nav>
          <ul className="mobile-nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-bg-accent" />
      </div>
    </>
  );
}
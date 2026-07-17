import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/animalets-logo.jpeg";
import "./Navbar.css";
import { NAV_LINKS } from "../../data/navigation";
import Button from "../common/Button/Button";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current < lastScroll && current > 60) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`navbar at-top ${visible ? "visible" : ""}`}>

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
        <div className="navbar-right">
          <Link to="/nuestros-peludos" className="adopt-btn">
            Adopta ya
          </Link>
        </div>

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
          <div className="mobile-menu-footer">
            <Link
              to="/nuestros-peludos"
              className="adopt-cta"
              onClick={() => setMenuOpen(false)}
            >
              Adopta ya
            </Link>
          </div>
        </nav>
        <div className="menu-bg-accent" />
      </div>
    </>
  );
}

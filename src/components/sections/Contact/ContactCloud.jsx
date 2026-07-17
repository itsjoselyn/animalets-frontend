import { useEffect, useRef, useState } from "react";
import "./ContactCloud.css";
import { RING_TEXT } from "../../../utils/constants";
import { textContactR } from "../../../utils/constants";


export default function ContactCloud() {
  const sectionRef = useRef(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = 1 - (rect.top - window.innerHeight * 0.25) / window.innerHeight;
      setRotation(progress * 360);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <section className="ccloud" ref={sectionRef}>

      {/* Email */}
      <a href="mailto:animaletslallagosta@gmail.com" className="ccloud-email">
        animaletslallagosta@gmail.com
      </a>

      {/* Zona central: Instagram + círculo giratorio + Facebook */}
      <div className="ccloud-middle">

        {/* Instagram */}
        <a
          href="https://instagram.com/animaletslallagosta"
          target="_blank"
          rel="noopener noreferrer"
          className="ccloud-social ccloud-social--ig"
        >
          <div className="ccloud-social-circle">Instagram</div>
        </a>

        {/* Círculo giratorio Adopta Ya */}
        <div className="ccloud-ring-wrap">
          <svg
            className="ccloud-svg"
            viewBox="0 0 140 140"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <defs>
              <path
                id="ringPath"
                d={`M70,70 m-${textContactR},0 a${textContactR},${textContactR} 0 1,1 ${textContactR * 2},0 a${textContactR},${textContactR} 0 1,1 -${textContactR * 2},0`}
              />
            </defs>
            <text
              fontFamily="'Lilita One', sans-serif"
              fontSize="11"
              fill="#4caf50"
              letterSpacing="3"
            >
              <textPath href="#ringPath">{RING_TEXT}</textPath>
            </text>
          </svg>

          {/* Ovillo en el centro */}
          <div className="ccloud-yarn">
            🧶
          </div>
        </div>

        {/* Facebook */}
        <a
          href="https://facebook.com/animaletslallagosta"
          target="_blank"
          rel="noopener noreferrer"
          className="ccloud-social ccloud-social--fb"
        >
          <div className="ccloud-social-circle">Facebook</div>
        </a>

      </div>

    </section>
  );
}

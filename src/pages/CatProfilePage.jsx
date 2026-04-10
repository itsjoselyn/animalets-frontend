import { useParams, useNavigate } from "react-router-dom";
import "./CatProfilePage.css";

// Datos de ejemplo — luego vendrán de Firebase
const CATS = [
  {
    id: 1,
    name: "Steven",
    age: "7 años",
    gender: "Macho",
    img: "https://placecats.com/neo/400/500",
    bio: "Steven es un gato joven y curioso, muy cariñoso cuando coge confianza. Le encanta observarlo todo desde su rincón favorito y pedir mimos cuando se siente seguro.",
    necesito: [
      "Un hogar tranquilo y paciente para seguir ganando confianza.",
      "Gente que respete sus tiempos y le deje acercarse poco a poco.",
      "Interior seguro, sin acceso al exterior sin protección.",
    ],
    superpoderes: [
      { label: "Nivel de mimos", value: "Experto en ronroneo" },
      { label: "Habilidad especial", value: "Atrapar pelotas invisibles" },
      { label: "Estado actual", value: "Buscando sofá definitivo" },
    ],
  },
  {
    id: 2,
    name: "Luna",
    age: "2 años",
    gender: "Hembra",
    img: "https://placecats.com/millie/400/500",
    bio: "Luna es una gata juguetona y llena de energía. Se lleva genial con otros gatos y le encanta trepar a los sitios más altos de la casa.",
    necesito: [
      "Un hogar con espacio para explorar y trepar.",
      "Compañía felina o humana constante, no le gusta estar sola.",
      "Juguetes y enriquecimiento ambiental.",
    ],
    superpoderes: [
      { label: "Nivel de mimos", value: "Ronroneo a máximo volumen" },
      { label: "Habilidad especial", value: "Escapista nata" },
      { label: "Estado actual", value: "En busca de aventuras" },
    ],
  },
  {
    id: 3,
    name: "Mochi",
    age: "1 año",
    gender: "Macho",
    img: "https://placecats.com/bella/400/500",
    bio: "Mochi es el más pequeño y el más travieso. Llegó muy joven y ha crecido lleno de amor. Ahora está listo para encontrar su familia definitiva.",
    necesito: [
      "Una familia con tiempo y paciencia para un gatito joven.",
      "Juego diario y estimulación mental.",
      "Preferiblemente sin niños muy pequeños.",
    ],
    superpoderes: [
      { label: "Nivel de mimos", value: "Intenso e incondicional" },
      { label: "Habilidad especial", value: "Desaparecer calcetines" },
      { label: "Estado actual", value: "Listo para el caos doméstico" },
    ],
  },
  {
    id: 4,
    name: "Nala",
    age: "3 años",
    gender: "Hembra",
    img: "https://placecats.com/neo_2/400/500",
    bio: "Nala es elegante, independiente y muy lista. Tardará en darte su confianza, pero cuando lo haga serás su persona favorita para siempre.",
    necesito: [
      "Un hogar tranquilo, sin mucho ruido ni ajetreo.",
      "Respeto por sus espacios y sus ritmos.",
      "Paciencia en los primeros meses de adaptación.",
    ],
    superpoderes: [
      { label: "Nivel de mimos", value: "Selectiva pero intensa" },
      { label: "Habilidad especial", value: "Leer el estado de ánimo humano" },
      { label: "Estado actual", value: "Buscando su trono definitivo" },
    ],
  },
  {
    id: 5,
    name: "Simba",
    age: "4 años",
    gender: "Macho",
    img: "https://placecats.com/millie_neo/400/500",
    bio: "Simba vive a tope. Cariñoso, activo y siempre dispuesto a jugar. Le encanta la gente y se adapta rápido a entornos nuevos.",
    necesito: [
      "Una familia activa que le dedique tiempo de juego.",
      "Espacio para moverse y explorar.",
      "Buena convivencia con otros animales.",
    ],
    superpoderes: [
      { label: "Nivel de mimos", value: "Desbordante y sin frenos" },
      { label: "Habilidad especial", value: "Saltar distancias imposibles" },
      { label: "Estado actual", value: "Con energía para dar y regalar" },
    ],
  },
];

export default function CatProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cat = CATS.find((c) => c.id === Number(id));

  if (!cat) {
    return (
      <div className="catprofile-notfound">
        <p>Gato no encontrado.</p>
        <button onClick={() => navigate("/nuestros-peludos")}>Volver</button>
      </div>
    );
  }

  return (
    <div className="catprofile">

      {/* Botón cerrar fijo */}
      <button
        className="catprofile-close"
        onClick={() => navigate("/nuestros-peludos")}
        aria-label="Cerrar"
      >
        ✕
      </button>

      {/* Foto */}
      <div className="catprofile-img-wrap">
        <img src={cat.img} alt={cat.name} className="catprofile-img" />
      </div>

      {/* Contenido */}
      <div className="catprofile-body">

        {/* Nombre + edad + sexo */}
        <div className="catprofile-hero">
          <h1 className="catprofile-name">{cat.name}</h1>
          <div className="catprofile-meta">
            <span>{cat.age}</span>
            <span>{cat.gender}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="catprofile-bio">{cat.bio}</p>

        {/* Lo que necesito */}
        <div className="catprofile-section">
          <h2 className="catprofile-section-title">Lo que necesito</h2>
          <ul className="catprofile-list">
            {cat.necesito.map((item, i) => (
              <li key={i} className="catprofile-list-item">{item}</li>
            ))}
          </ul>
        </div>

        {/* Superpoderes */}
        <div className="catprofile-section">
          <h2 className="catprofile-section-title">Mis superpoderes</h2>
          <ul className="catprofile-powers">
            {cat.superpoderes.map((s, i) => (
              <li key={i} className="catprofile-power">
                <span className="catprofile-power-label">{s.label}:</span> {s.value}
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="catprofile-ctas">
          <a
            href={`/contacto?tipo=adoptar&gato=${cat.name}`}
            className="catprofile-btn catprofile-btn--adopt"
          >
            Adóptame
          </a>
          <a
            href={`/contacto?tipo=acogida&gato=${cat.name}`}
            className="catprofile-btn catprofile-btn--foster"
          >
            Acógeme
          </a>
        </div>

      </div>
    </div>
  );
}

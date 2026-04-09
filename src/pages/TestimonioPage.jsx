import { useParams, useNavigate } from "react-router-dom";
import "./TestimonioPage.css";
import logo from "../assets/animalets-logo.jpeg";

// Datos de los testimonios — luego vendrán de Firebase
const TESTIMONIOS = [
  {
    id: "juana",
    name: "Juana",
    date: "02 Nov, 2024",
    title: "Mi colaboración en la protectora Animalets me ha hecho crecer como persona",
    text: "Desde el primer día me sentí parte de algo especial. El equipo de Animalets me recibió con los brazos abiertos y los gatitos hicieron el resto. Nunca había experimentado una conexión tan bonita con los animales. Cada visita al refugio es un recordatorio de por qué vale la pena dedicar tiempo a quienes más lo necesitan. Ver cómo un gato asustado se convierte en un animal confiado y feliz gracias a tu cariño y paciencia es algo que no tiene precio. Recomendaría esta experiencia a cualquier persona que busque algo significativo que aportar.",
    img: "https://placecats.com/neo/400/300",
  },
  {
    id: "josep",
    name: "Josep",
    date: "15 Oct, 2024",
    title: "Apadrinar a Mochi cambió mi perspectiva sobre la ayuda animal",
    text: "Apadrinar a Mochi cambió mi vida por completo. Cada visita es una alegría enorme, verle crecer y saber que mi aportación mensual le da una vida digna y llena de amor es algo que no tiene precio. El equipo de Animalets siempre me mantiene informado sobre cómo está, me mandan fotos y noticias. Es como tener un gatito sin tenerlo en casa. Una forma perfecta de ayudar para quien no puede adoptar.",
    img: "https://placecats.com/millie/400/300",
  },
  {
    id: "maria",
    name: "Maria",
    date: "03 Sep, 2024",
    title: "Abrir mi casa a un gato en acogida fue la mejor decisión que tomé este año",
    text: "Nunca pensé que abrir mi casa temporalmente me daría tanto. Los gatitos llegan asustados y en pocas semanas se convierten en pequeños valientes. El apoyo de Animalets durante todo el proceso es increíble. Cuando llegó el día de la adopción definitiva lloré de emoción. Fue una experiencia que repetiría mil veces sin dudarlo.",
    img: "https://placecats.com/bella/400/300",
  },
  {
    id: "carles",
    name: "Carles",
    date: "20 Ago, 2024",
    title: "Hacerse socio fue la inversión más bonita que he hecho en mucho tiempo",
    text: "Hacerse socio fue la mejor decisión del año. Saber que cada mes contribuyo a que más gatos tengan una oportunidad real de encontrar un hogar me llena de satisfacción. La transparencia del equipo es total, siempre saben explicarte en qué se usa cada euro y qué impacto tiene. Una asociación de verdad comprometida con su causa.",
    img: "https://placecats.com/neo_2/400/300",
  },
  {
    id: "laura",
    name: "Laura",
    date: "10 Jul, 2024",
    title: "La experiencia de acogida con Animalets superó todas mis expectativas",
    text: "El proceso de acogida fue muy sencillo y el apoyo del equipo constante en todo momento. Cuando llegó el día de la adopción definitiva lloré de emoción. Fue una experiencia que repetiría mil veces. Gracias a Animalets descubrí lo gratificante que puede ser dar un hogar temporal a un animal que lo necesita.",
    img: "https://placecats.com/millie_neo/400/300",
  },
];

export default function TestimonioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const testimonio = TESTIMONIOS.find((t) => t.id === id);

  if (!testimonio) {
    return (
      <div className="testpage-notfound">
        <p>Testimonio no encontrado.</p>
        <button onClick={() => navigate(`/?testimonio=${testimonio.id}`)}>Volver</button>
      </div>
    );
  }

  return (
    <div className="testpage">

      {/* Header */}
      <header className="testpage-header">
        <img src={logo} alt="Animalets" className="testpage-logo" />
        <button
          className="testpage-close"
          onClick={() => navigate(`/?testimonio=${testimonio.id}`)}
        >
          Cerrar
        </button>
      </header>

      {/* Subheader con nombre */}
      <div className="testpage-subheader">
        <h1 className="testpage-name">{testimonio.name}</h1>
        <span className="testpage-date">{testimonio.date}</span>
      </div>

      {/* Contenido */}
      <div className="testpage-body">
        <div className="testpage-img-wrap">
          <img src={testimonio.img} alt={testimonio.name} className="testpage-img" />
        </div>
        <h2 className="testpage-title">{testimonio.title}</h2>
        <p className="testpage-text">{testimonio.text}</p>
      </div>

    </div>
  );
}

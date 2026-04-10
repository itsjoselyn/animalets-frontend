import { useParams, Link, useNavigate } from "react-router-dom";
import "./BlogPostPage.css";

const POSTS = [
  {
    id: 1,
    date: "03 Dic, 2024",
    title: "Qué debes saber antes de bañar a tu gato",
    img: "https://placecats.com/neo/400/300",
    body: `Bañar a un gato no es algo que deba hacerse con frecuencia, ya que ellos son animales que se limpian solos de manera muy eficiente. Sin embargo, hay situaciones en las que un baño se hace necesario: si el gato se ha ensuciado con alguna sustancia, si tiene parásitos o una condición dermatológica, o simplemente si el veterinario lo recomienda.

Antes de meter a tu gato en el agua, prepara todo lo necesario: champú específico para gatos (nunca uses el de personas), toallas secas, y un ambiente cálido. El agua debe estar tibia, ni fría ni caliente.

Habla con tu gato durante todo el proceso con un tono calmado. Si es la primera vez, empieza mojando solo las patas y ve aumentando gradualmente. Nunca mojes la cabeza directamente, usa un paño húmedo para limpiar esa zona.

Después del baño, seca bien a tu gato con la toalla y, si lo tolera, puedes usar el secador a temperatura baja y a distancia. Recompénsale con chuches y mimos para que asocie la experiencia de forma positiva.`,
  },
  {
    id: 2,
    date: "20 Nov, 2024",
    title: "Cómo preparar tu casa para acoger un gato",
    img: "https://placecats.com/millie/400/300",
    body: `Acoger a un gato por primera vez es una experiencia maravillosa, pero requiere cierta preparación del hogar para que el animal se sienta seguro y cómodo desde el primer momento.

Lo primero es crear un espacio propio: una cama o manta en un rincón tranquilo, alejado del bullicio. Los gatos necesitan tener su zona de refugio, especialmente en los primeros días de adaptación.

Revisa que no haya plantas tóxicas para gatos en casa (los lirios, el potus y la hiedra son algunos ejemplos), ni cables sueltos que puedan morder. Los armarios y cajones abiertos también pueden ser peligrosos.

Prepara el arenero en un lugar tranquilo y accesible, el comedero y bebedero en otro espacio diferente, y asegúrate de tener algunos juguetes para los primeros días.`,
  },
  {
    id: 3,
    date: "05 Nov, 2024",
    title: "Los mejores juguetes para gatos de interior",
    img: "https://placecats.com/bella/400/300",
    body: `Los gatos de interior necesitan estimulación mental y física diaria para mantenerse sanos y felices. Un gato aburrido puede desarrollar comportamientos problemáticos como arañar muebles, comer en exceso o volverse ansioso.

Los juguetes tipo caña con plumas o ratones son siempre un éxito: imitan el movimiento de la presa y activan el instinto cazador. Lo importante es que tú participes activamente en el juego, no basta con dejarlo solo con el juguete.

Los puzzles de comida o comederos interactivos son ideales para ralentizar la ingesta y estimular la mente. Los túneles y rascadores con plataformas también son muy recomendables.

Recuerda rotar los juguetes cada semana para que no pierdan interés, y reserva al menos dos sesiones de juego al día de unos 10-15 minutos cada una.`,
  },
];

export default function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentIndex = POSTS.findIndex((p) => p.id === Number(id));
  const post = POSTS[currentIndex];
  const nextPost = POSTS[currentIndex + 1] || null;

  if (!post) {
    return (
      <div className="blogpost-notfound">
        <p>Artículo no encontrado.</p>
        <Link to="/blog">Volver al blog</Link>
      </div>
    );
  }

  return (
    <div className="blogpost">

      {/* Hero verde: título + nav */}
      <div className="blogpost-hero">
        <h1 className="blogpost-title">{post.title}</h1>
        <div className="blogpost-nav-top">
          <Link to="/blog" className="blogpost-back">
            <span className="blogpost-dot" />
            Todos los artículos
          </Link>
          <span className="blogpost-date">{post.date}</span>
        </div>
      </div>

      {/* Contenido blanco */}
      <div className="blogpost-body">
        <div className="blogpost-img-wrap">
          <img src={post.img} alt={post.title} className="blogpost-img" />
        </div>

        <div className="blogpost-text">
          {post.body.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Siguiente artículo */}
        {nextPost && (
          <div className="blogpost-next">
            <Link to={`/blog/${nextPost.id}`} className="blogpost-next-link">
              Siguiente artículo
              <span className="blogpost-dot blogpost-dot--green" />
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}

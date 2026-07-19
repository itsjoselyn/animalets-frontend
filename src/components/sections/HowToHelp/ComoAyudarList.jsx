import { useState } from "react";
import { Link } from "react-router-dom";
import "./ComoAyudarList.css";
import { Button } from 'antd';
import { Collapse } from 'antd';

export const OPTIONS_HELP = [
  {
    id: "voluntariado",
    title: "Haz voluntariado",
    icon: "◇",
    content: (
      <>
        <p>Si los gatos te roban el corazón, este es tu lugar. Únete al equipo y ayúdanos con lo que más necesitan: limpieza, alimentación, medicación, fotos, vídeos y, sobre todo, cariño.</p>
        <p>Rellena el formulario marcando la opción "Voluntariado" y te contactaremos.</p>
        <Button type="primary" shape="round" href="/contacto" target="_blank">
          Ir al formulario
        </Button>
      </>
    ),
  },
  {
    id: "acogida",
    title: "Sé casa de acogida",
    icon: "◇",
    content: (
      <>
        <p>¿No puedes adoptar, pero te gustaría ayudar de verdad? Acoger es regalar tiempo, seguridad y amor a un gato que espera su hogar definitivo. Nosotros te acompañamos y cubrimos los gastos veterinarios. Tú solo pon el corazón.</p>
        <p>Rellena el formulario marcando la opción de "acogida" o ven a conocernos al refugio.</p>
        <Button type="primary" shape="round" href="/contacto" target="_blank">
          Ir al formulario
        </Button>
      </>
    ),
  },
  {
    id: "apadrinar",
    title: "Apadrina un gato",
    icon: "◇",
    content: (
      <>
        <p>Por solo 10€ al mes, conviértete en su persona favorita. Tu ayuda cubre comida, veterinario y cuidados. Nosotros te enviamos fotos y noticias de tu ahijado para que veas cómo crece feliz.</p>
        <p>Elige tu gatito y marca en el formulario "quiero apadrinar".</p>
        <Button type="primary" shape="round" href="/contacto" target="_blank">
          Ir al formulario
        </Button>
      </>
    ),
  },
  {
    id: "socio",
    title: "Hazte socio",
    icon: "◇",
    content: (
      <>
        <p>Con 15€ al año, formas parte de esta familia peluda. Nos ayudas a rescatar, cuidar y seguir adelante. Recibirás actualizaciones de todo lo que logramos gracias a personas como tú.</p>
        <p>Transferencia a:<br /><strong>ES19 0182 8653 5102 0154 0323 (BBVA)</strong><br />Concepto: "Socio/a + tu nombre"</p>
        <p>Luego rellena el formulario marcando "hacerme socio/a".</p>
        <Button type="primary" shape="round" href="/contacto" target="_blank">
          Ir al formulario
        </Button>
      </>
    ),
  },
  {
    id: "teaming",
    title: "Teaming",
    icon: "◇",
    content: (
      <>
        <p>1€ al mes = un montón de amor y croquetas. Tu granito de arena cambia vidas.</p>
        <Button type="primary" shape="round" href="https://www.teaming.net/animaletslallagosta" target="_blank">
          Unirte a Teaming
        </Button>
      </>
    ),
  },
  {
    id: "migranodearena",
    title: "Migranodearena",
    icon: "◇",
    content: (
      <>
        <p>Tu donación nos permite seguir salvando vidas. Y además, Hacienda te devuelve un porcentaje. Fácil, rápido y con impacto real.</p>
        <Button type="primary" shape="round" href="https://www.migranodearena.org/usuario/asociacion-protectora-de-animales-y-plantas-de-la-llagosta" target="_blank">
          Haz tu donación
        </Button>
      </>
    ),
  },
  {
    id: "paypal",
    title: "PayPal",
    icon: "◇",
    content: (
      <>
        <p>Si prefieres donar mediante PayPal, puedes hacerlo de forma rápida y segura desde aquí.</p>
        <p><strong>Nota:</strong> Selecciona "Enviar a familiares y amigos" para evitar comisiones.</p>
        <Button type="primary" shape="round" href="https://www.paypal.com/donate?business=animaletslallagosta%40gmail.com&currency_code=EUR" target="_blank">
          Donar con PayPal
        </Button>
      </>
    ),
  },
  {
    id: "compra",
    title: "Compra solidaria",
    icon: "◇",
    content: (
      <>
        <p>En nuestras tiendas de Vinted y Wallapop todo lo recaudado se convierte en bienestar para los gatos. Compra, apoya y multiplica el efecto positivo.</p>
        <div className="cayudar-btn-group">
          <Button type="primary" shape="round" href="https://www.vinted.es/member/42377404-animaletslallagosta" target="_blank">
            Vinted
          </Button>
          <Button type="primary" shape="round" href="https://es.wallapop.com/user/protectoraa-358571117" target="_blank">
            Wallapop
          </Button>
        </div>
      </>
    ),
  },
  {
    id: "amazon",
    title: "Lista de deseos de Amazon",
    icon: "◇",
    content: (
      <>
        <p>¿Prefieres donar directamente? Nuestra lista de deseos tiene lo que más necesitan: comida, arena, medicación y más. Cada producto que envías, es una ayuda real.</p>
        <Button type="primary" shape="round" href="https://www.amazon.es/hz/wishlist/ls/27IB6J1N3VF6B" target="_blank">
          Ver lista de deseos de Amazon
        </Button>
      </>
    ),
  },
];


export default function ComoAyudarList() {
  const [open, setOpen] = useState(null);

  const toggle = (id) => setOpen((prev) => (prev === id ? null : id));

  const items = [
    {
      key: '1',
      label: 'Haz voluntariado',
      children: <div><p>Si los gatos te roban el corazón, este es tu lugar. Únete al equipo y ayúdanos con lo que más necesitan: limpieza, alimentación, medicación, fotos, vídeos y, sobre todo, cariño.
        Rellena el formulario marcando la opción "Voluntariado" y te contactaremos.</p><Button href="/contacto" target="_blank">
          Ir al formulario
        </Button></div>
    },
    {
      key: '2',
      label: 'Sé casa de acogida',
      children: <div><p>¿No puedes adoptar, pero te gustaría ayudar de verdad? Acoger es regalar tiempo, seguridad y amor a un gato que espera su hogar definitivo. Nosotros te acompañamos y cubrimos los gastos veterinarios. Tú solo pon el corazón.
        Rellena el formulario marcando la opción de "acogida" o ven a conocernos al refugio.</p><Button href="/contacto" target="_blank">
          Ir al formulario
        </Button></div>
    },
    {
      key: '3',
      label: 'Apadrina un gato',
      children: <div><p>Por solo 10€ al mes, conviértete en su persona favorita. Tu ayuda cubre comida, veterinario y cuidados. Nosotros te enviamos fotos y noticias de tu ahijado para que veas cómo crece feliz.
        Elige tu gatito y marca en el formulario "quiero apadrinar".</p>
        <Button type="primary" shape="round" href="/contacto" target="_blank">
          Ir al formulario
        </Button></div>
    },
    {
      key: '4',
      label: 'Hazte socio',
      children: <p>Con 15€ al año, formas parte de esta familia peluda. Nos ayudas a rescatar, cuidar y seguir adelante. Recibirás actualizaciones de todo lo que logramos gracias a personas como tú.
        Transferencia a:<br /><strong>ES19 0182 8653 5102 0154 0323 (BBVA)</strong><br />Concepto: "Socio/a + tu nombre"
        Luego rellena el formulario marcando "hacerme socio/a".</p>,
    },
  ];

  return (
    // <>
    //   {/* Mobile: lista única */}
    //   <div className="cayudar-list cayudar-list--mobile">
    //     {OPTIONS_HELP.map(renderItem)}
    //   </div>

    //   {/* Desktop: dos columnas */}
    //   <div className="cayudar-list cayudar-list--desktop">
    //     <div className="cayudar-col">{col1.map(renderItem)}</div>
    //     <div className="cayudar-col">{col2.map(renderItem)}</div>
    //   </div>
    // </>
    <>
      <Collapse items={items} defaultActiveKey={['1']} />
    </>
  );
}

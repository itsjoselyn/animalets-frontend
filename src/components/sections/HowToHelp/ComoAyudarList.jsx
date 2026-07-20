import { Link } from "react-router-dom";
import "./ComoAyudarList.css";
import { Button } from 'antd';
import { Collapse } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

export default function ComoAyudarList() {
  const styles = {
    root: {
      backgroundColor: '#fafafa',
      border: '1px solid #696FC7',
      borderRadius: 8,
      maxWidth: 800,
      margin: '0 auto',
    },
    header: {
      backgroundColor: '#F5EFFF',
      padding: '12px 16px',
    },
  };

  const items = [
    {
      key: '1',
      label: 'Haz voluntariado',
      children: <div><p>Si los gatos te roban el corazón, este es tu lugar. Únete al equipo y ayúdanos con lo que más necesitan: limpieza, alimentación, medicación, fotos, vídeos y, sobre todo, cariño.
        Rellena el formulario marcando la opción "Voluntariado" y te contactaremos.</p>
        <div className="button-container">
          <Button type="default" shape="round" href="/contacto" target="_blank" icon={<ExportOutlined />}>
            Ir al formulario 
        </Button>
        </div>
      </div>
    },
    {
      key: '2',
      label: 'Sé casa de acogida',
      children: <div><p>¿No puedes adoptar, pero te gustaría ayudar de verdad? Acoger es regalar tiempo, seguridad y amor a un gato que espera su hogar definitivo. Nosotros te acompañamos y cubrimos los gastos veterinarios. Tú solo pon el corazón.
        Rellena el formulario marcando la opción de "acogida" o ven a conocernos al refugio.</p>
        <div className="button-container">
          <Button type="default" shape="round" href="/contacto" target="_blank" icon={<ExportOutlined />}>
            Ir al formulario
          </Button>
        </div>
      </div>
    },
    {
      key: '3',
      label: 'Apadrina un gato',
      children: <div><p>Por solo 10€ al mes, conviértete en su persona favorita. Tu ayuda cubre comida, veterinario y cuidados. Nosotros te enviamos fotos y noticias de tu ahijado para que veas cómo crece feliz.
        Elige tu gatito y marca en el formulario "quiero apadrinar".</p>
        <div className="button-container">
          <Button type="default" shape="round" href="/contacto" target="_blank" icon={<ExportOutlined />}>
            Ir al formulario
          </Button>
        </div>
      </div>
    },
    {
      key: '4',
      label: 'Hazte socio',
      children: <div><p>Con 15€ al año, formas parte de esta familia peluda. Nos ayudas a rescatar, cuidar y seguir adelante. Recibirás actualizaciones de todo lo que logramos gracias a personas como tú.
        <br />Transferencia a: <strong>ES19 0182 8653 5102 0154 0323 (BBVA)</strong>
        <br />Concepto: "Socio/a + tu nombre"
        <br />Luego rellena el formulario marcando "hacerme socio/a".</p></div>,
    },
    {
      key: '5',
      label: 'Teaming',
      children: <div><p>1€ al mes = un montón de amor y croquetas. Tu granito de arena cambia vidas.</p>
        <div className="button-container">
          <Button type="default" shape="round" href="https://www.teaming.net/animaletslallagosta" target="_blank" icon={<ExportOutlined />}>
          Unirte a Teaming
        </Button>
        </div>
      </div>,
    },
    {
      key: '6',
      label: 'Migranodearena',
      children: <div><p>Tu donación nos permite seguir salvando vidas. Y además, Hacienda te devuelve un porcentaje. Fácil, rápido y con impacto real.</p>
        <div className="button-container">
          <Button type="default" shape="round" href="https://www.migranodearena.org/usuario/asociacion-protectora-de-animales-y-plantas-de-la-llagosta" target="_blank" icon={<ExportOutlined />}>
          Haz tu donación
          </Button></div></div>,
    },
    {
      key: '7',
      label: 'PayPal',
      children: <div><p>Si prefieres donar mediante PayPal, puedes hacerlo de forma rápida y segura desde aquí.
        <strong>Nota:</strong> Selecciona "Enviar a familiares y amigos" para evitar comisiones.</p>
        <div className="button-container">
          <Button type="default" shape="round" href="https://www.paypal.com/donate?business=animaletslallagosta%40gmail.com&currency_code=EUR" target="_blank" icon={<ExportOutlined />}>
          Donar con PayPal
          </Button></div></div>,
    },
    {
      key: '8',
      label: 'Compra solidaria',
      children: <div><p>En nuestras tiendas de Vinted y Wallapop todo lo recaudado se convierte en bienestar para los gatos. Compra, apoya y multiplica el efecto positivo.
      </p>
        <div className="button-container">
          <Button type="default" shape="round" href="https://www.vinted.es/member/42377404-animaletslallagosta" target="_blank" icon={<ExportOutlined />}>
            Vinted
          </Button>
          <Button type="default" shape="round" href="https://es.wallapop.com/user/protectoraa-358571117" target="_blank" icon={<ExportOutlined />}>
            Wallapop
          </Button>
        </div>
      </div>,
    },
    {
      key: '9',
      label: 'Lista de deseos de Amazon',
      children: <div><p>¿Prefieres donar directamente? Nuestra lista de deseos tiene lo que más necesitan: comida, arena, medicación y más. Cada producto que envías, es una ayuda real.</p>
        <div className="button-container">
          <Button type="default" shape="round" href="https://www.amazon.es/hz/wishlist/ls/27IB6J1N3VF6B" target="_blank" icon={<ExportOutlined />}>
            Ver lista de deseos de Amazon
        </Button></div>
      </div>,
    },
  ];

  return (
    <>
      <Collapse items={items} defaultActiveKey={['1']} styles={styles} />
    </>
  );
}

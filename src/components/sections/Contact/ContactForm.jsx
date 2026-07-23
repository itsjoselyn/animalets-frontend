import "./ContactForm.css";
import { Button, Checkbox, Form, Input, Modal, Select, Row, Col, message } from 'antd';
import { useEffect, useState } from "react";
import PrivacidadPage from "../../../pages/PrivacidadPage";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

const { TextArea } = Input;

const HOW_DID_YOU_HEAR_ABOUT_US_OPTIONS = [
  { label: 'Web', value: 'web' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Un amigo', value: 'amigo' },
  { label: 'Otro', value: 'otro' },
];

const TYPE_OF_INQUIRY_OPTIONS = [
  { label: 'Adoptar', value: 'adoptar' },
  { label: 'Apadrinar', value: 'apadrinar' },
  { label: 'Casa de acogida', value: 'acogida' },
  { label: 'Voluntariado', value: 'voluntariado' },
  { label: 'Otra consulta', value: 'otro' },
];

export default function ContactForm() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittable, setSubmittable] = useState(false);
  const [gatosOptions, setGatosOptions] = useState([]);

  const values = Form.useWatch([], form);
  const tipo = Form.useWatch('type', form);

  // Cargar la lista de gatos desde Firestore y poner "No lo sé" el primero
  useEffect(() => {
    const fetchGatos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gatos"));
        const listaGatos = querySnapshot.docs.map((docSnap) => {
          const catData = docSnap.data();
          return {
            label: catData.nombre || 'Sin nombre',
            value: catData.nombre || docSnap.id,
          };
        });

        setGatosOptions([{ label: 'No lo sé', value: 'No lo sé' }, ...listaGatos]);
      } catch (err) {
        console.error("Error al cargar los gatos:", err);
        setGatosOptions([{ label: 'No lo sé', value: 'No lo sé' }]);
      }
    };

    fetchGatos();
  }, []);

  // Definir campos dinámicos según el tipo de consulta
  const getFieldsByType = (selectedType) => {
    const gatoField = {
      name: 'gatoElegido',
      label: '¿En qué gato estás interesado?',
      options: gatosOptions,
      mode: 'default',
      required: true // Obligatorio en todas las opciones dinámicas
    };

    const restOfAdoptionFields = [
      {
        name: 'tipoVivienda',
        label: '¿Qué tipo de vivienda tienes?',
        options: [
          { label: 'Piso', value: 'Piso' },
          { label: 'Casa', value: 'Casa' }
        ],
        mode: 'default',
        required: true
      },
      {
        name: 'animalesCasa',
        label: '¿Tienes animales en casa?',
        options: [
          { label: 'Perro', value: 'Perro' },
          { label: 'Gato', value: 'Gato' },
          { label: 'Otros', value: 'Otros' },
          { label: 'No', value: 'No' }
        ],
        mode: 'default',
        required: true
      },
      {
        name: 'personasCasa',
        label: '¿Hay más personas en casa?',
        options: [{ label: 'Sí', value: 'Sí' }, { label: 'No', value: 'No' }],
        mode: 'default',
        required: true
      },
      {
        name: 'experienciaGatos',
        label: '¿Tienes experiencia previa con gatos?',
        options: [{ label: 'Sí', value: 'Sí' }, { label: 'No', value: 'No' }],
        mode: 'default',
        required: true
      },
    ];

    if (selectedType === 'adoptar') {
      return [gatoField, ...restOfAdoptionFields];
    }

    if (selectedType === 'acogida') {
      return [
        gatoField,
        ...restOfAdoptionFields,
        {
          name: 'tiempoAcogida',
          label: '¿Cuánto tiempo puedes acoger?',
          options: [{ label: 'Temporal', value: 'Temporal' }, { label: 'Indefinida', value: 'Indefinida' }],
          mode: 'default',
          required: true
        }
      ];
    }

    if (selectedType === 'apadrinar') {
      return [
        {
          ...gatoField,
          label: '¿A qué gato te gustaría apadrinar?',
          required: true // Obligatorio también aquí
        },
        {
          name: 'tipoAportacion',
          label: 'Tipo de aportación',
          options: [{ label: '10€/mes', value: '10€/mes' }, { label: 'Otra cantidad', value: 'Otra cantidad' }],
          mode: 'default',
          required: true
        }
      ];
    }

    if (selectedType === 'voluntariado') {
      return [
        {
          name: 'disponibilidadVoluntariado',
          label: '¿Cuál sería tu disponibilidad?',
          options: [
            { label: 'Mañana', value: 'Mañana' },
            { label: 'Tarde', value: 'Tarde' },
            { label: 'Fin de semana', value: 'Fin de semana' }
          ],
          mode: 'multiple',
          required: true
        },
        {
          name: 'tareasVoluntariado',
          label: '¿Qué tareas te gustaría realizar?',
          options: [
            { label: 'Limpieza', value: 'Limpieza' },
            { label: 'Alimentación', value: 'Alimentación' },
            { label: 'Medicación', value: 'Medicación' },
            { label: 'Fotos', value: 'Fotos' },
            { label: 'Socialización', value: 'Socialización' },
            { label: 'Otros', value: 'Otros' }
          ],
          mode: 'multiple',
          required: true
        },
        {
          name: 'experienciaAnimales',
          label: '¿Tienes experiencia previa con animales?',
          options: [{ label: 'Sí', value: 'Sí' }, { label: 'No', value: 'No' }],
          mode: 'default',
          required: true
        }
      ];
    }

    return [];
  };

  const campos = getFieldsByType(tipo);

  const openPrivacyModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleAcceptPrivacy = () => {
    form.setFieldsValue({ privacy: true });
    setIsModalOpen(false);
  };

  const onFinish = async (formValues) => {
    setLoading(true);
    try {
      const cleanValues = Object.fromEntries(
        Object.entries(formValues).filter(([_, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))
      );

      await addDoc(collection(db, "contactRequests"), {
        ...cleanValues,
        createdAt: serverTimestamp(),
      });

      message.success('Mensaje enviado correctamente');
      form.resetFields();
    } catch (err) {
      console.error("Error al enviar formulario:", err);
      message.error('No se pudo enviar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <section className="cform-wrap">
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          tipoVivienda: undefined,
          tareasVoluntariado: [],
          disponibilidadVoluntariado: []
        }}
        style={{ padding: '1.5rem 2rem', border: '1px solid #4caf50', borderRadius: '16px', backgroundColor: '#f9fdf9' }}
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Introduce tu nombre' }]} style={{ marginBottom: 0 }}>
              <Input placeholder="Introduce tu nombre" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Introduce un email válido' }]} style={{ marginBottom: 0 }}>
              <Input placeholder="Introduce tu email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} align="middle" style={{ marginTop: 16 }}>
          <Col xs={24} md={8}>
            <Form.Item label="Teléfono" name="phone" style={{ marginBottom: 0 }}>
              <Input placeholder="Introduce tu teléfono" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Edad" name="age" style={{ marginBottom: 0 }}>
              <Input placeholder="Introduce tu edad" />
            </Form.Item>
          </Col>
          <Col xs={24} md={10}>
            <Form.Item name="contact" label="¿Cómo nos conociste?" style={{ marginBottom: 0 }}>
              <Select
                allowClear
                placeholder="Elige una opción"
                options={HOW_DID_YOU_HEAR_ABOUT_US_OPTIONS}
              />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ marginTop: 16 }}>
          <Form.Item name="type" label="¿Cuál es tu consulta?" rules={[{ required: true, message: 'Selecciona una opción' }]} style={{ marginBottom: 0 }}>
            <Select
              allowClear
              placeholder="Elige una opción"
              options={TYPE_OF_INQUIRY_OPTIONS}
            />
          </Form.Item>
        </div>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {campos.map((campo) => (
            <Col xs={24} md={8} key={campo.name}>
              <Form.Item
                name={campo.name}
                label={campo.label}
                rules={[{ required: campo.required, message: 'Selecciona una opción' }]}
                style={{ marginBottom: 0 }}
              >
                <Select
                  allowClear={!campo.required}
                  mode={campo.mode === 'multiple' ? 'multiple' : undefined}
                  placeholder="Selecciona"
                  options={campo.options}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>

        <div style={{ marginTop: 16 }}>
          <Form.Item
            label="Mensaje"
            name="mensaje"
            rules={tipo === 'otro' ? [{ required: true, message: 'Escribe un mensaje' }] : []}
            style={{ marginBottom: 16 }}
          >
            <TextArea rows={4} placeholder={tipo === 'otro' ? "Escribe tu mensaje aquí... (Obligatorio)" : "Escribe tu mensaje aquí... (Opcional)"} />
          </Form.Item>
        </div>

        <Form.Item
          name="privacy"
          valuePropName="checked"
          rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Debe aceptar la política de privacidad')) }]}
          style={{ marginBottom: 16 }}
        >
          <Checkbox>He leído y acepto la <a href="#privacidad" onClick={openPrivacyModal}>política de privacidad</a></Checkbox>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            disabled={!submittable}
            htmlType="submit"
            loading={loading}
            style={{
              backgroundColor: submittable ? "#2e7d32" : "#d9d9d9",
              borderColor: submittable ? "#2e7d32" : "#d9d9d9",
              color: submittable ? "#fff" : "rgba(0, 0, 0, 0.25)"
            }}
          >
            Enviar
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Política de Privacidad"
        open={isModalOpen}
        onOk={handleAcceptPrivacy}
        onCancel={() => setIsModalOpen(false)}
        okText="Aceptar"
        cancelText="Cerrar"
        width="70%"
      >
        <PrivacidadPage />
      </Modal>
    </section>
  );
}
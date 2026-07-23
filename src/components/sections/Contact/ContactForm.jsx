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

const ADOPTION_BASE_FIELDS = [
  {
    name: 'housingType',
    label: '¿Qué tipo de vivienda tienes?',
    options: [
      { label: 'Piso', value: 'Piso' },
      { label: 'Casa', value: 'Casa' }
    ],
    mode: 'default',
    required: true
  },
  {
    name: 'petsAtHome',
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
    name: 'peopleAtHome',
    label: '¿Hay más personas en casa?',
    options: [{ label: 'Sí', value: 'Sí' }, { label: 'No', value: 'No' }],
    mode: 'default',
    required: true
  },
  {
    name: 'catExperience',
    label: '¿Tienes experiencia previa con gatos?',
    options: [{ label: 'Sí', value: 'Sí' }, { label: 'No', value: 'No' }],
    mode: 'default',
    required: true
  },
];

const FOSTER_FIELDS = [
  ...ADOPTION_BASE_FIELDS,
  {
    name: 'fosterDuration',
    label: '¿Cuánto tiempo puedes acoger?',
    options: [{ label: 'Temporal', value: 'Temporal' }, { label: 'Indefinida', value: 'Indefinida' }],
    mode: 'default',
    required: true
  }
];

const SPONSOR_FIELDS = [
  {
    name: 'contributionType',
    label: 'Tipo de aportación',
    options: [{ label: '10€/mes', value: '10€/mes' }, { label: 'Otra cantidad', value: 'Otra cantidad' }],
    mode: 'default',
    required: true
  }
];

const VOLUNTEER_FIELDS = [
  {
    name: 'volunteerAvailability',
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
    name: 'volunteerTasks',
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
    name: 'animalExperience',
    label: '¿Tienes experiencia previa con animales?',
    options: [{ label: 'Sí', value: 'Sí' }, { label: 'No', value: 'No' }],
    mode: 'default',
    required: true
  }
];

export default function ContactForm() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittable, setSubmittable] = useState(false);
  const [catsOptions, setCatsOptions] = useState([]);

  const formValues = Form.useWatch([], form);
  const inquiryType = Form.useWatch('type', form);

  // Cargar la lista de gatos desde Firestore solo al montar el componente (y solo si se necesita)
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gatos"));
        const catsList = querySnapshot.docs.map((docSnap) => {
          const catData = docSnap.data();
          return {
            label: catData.nombre || 'Sin nombre',
            value: docSnap.id,
          };
        });

        setCatsOptions([{ label: 'No lo sé', value: 'No lo sé' }, ...catsList]);
      } catch (err) {
        console.error("Error al cargar los gatos:", err);
        setCatsOptions([{ label: 'No lo sé', value: 'No lo sé' }]);
      }
    };

    fetchCats();
  }, []);

  // Definir campos dinámicos según el tipo de consulta seleccionada usando puras constantes
  const getFieldsByType = (selectedType) => {
    if (selectedType === 'adoptar') {
      return [
        {
          name: 'selectedCat',
          label: '¿En qué gato estás interesado?',
          options: catsOptions,
          mode: 'default',
          required: true
        },
        ...ADOPTION_BASE_FIELDS
      ];
    }

    if (selectedType === 'acogida') {
      return [
        {
          name: 'selectedCat',
          label: '¿En qué gato estás interesado?',
          options: catsOptions,
          mode: 'default',
          required: true
        },
        ...FOSTER_FIELDS
      ];
    }

    if (selectedType === 'apadrinar') {
      return [
        {
          name: 'selectedCat',
          label: '¿A qué gato te gustaría apadrinar?',
          options: catsOptions,
          mode: 'default',
          required: true
        },
        ...SPONSOR_FIELDS
      ];
    }

    if (selectedType === 'voluntariado') {
      return VOLUNTEER_FIELDS;
    }

    return [];
  };

  const dynamicFields = getFieldsByType(inquiryType);

  const openPrivacyModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleAcceptPrivacy = () => {
    form.setFieldsValue({ privacy: true });
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const cleanValues = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))
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
  }, [form, formValues]);

  return (
    <section className="cform-wrap">
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          housingType: undefined,
          volunteerTasks: [],
          volunteerAvailability: []
        }}
        style={{ padding: '1.5rem 2rem', border: '1px solid #4caf50', borderRadius: '16px', backgroundColor: '#f9fdf9' }}
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Introduce tu nombre' }]}>
              <Input placeholder="Introduce tu nombre" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Introduce un email válido' }]}>
              <Input placeholder="Introduce tu email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Form.Item label="Teléfono" name="phone">
              <Input placeholder="Introduce tu teléfono" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Edad" name="age">
              <Input placeholder="Introduce tu edad" />
            </Form.Item>
          </Col>
          <Col xs={24} md={10}>
            <Form.Item name="contact" label="¿Cómo nos conociste?">
              <Select
                allowClear
                placeholder="Elige una opción"
                options={HOW_DID_YOU_HEAR_ABOUT_US_OPTIONS}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="type" label="¿Cuál es tu consulta?" rules={[{ required: true, message: 'Selecciona una opción' }]}>
          <Select
            allowClear
            placeholder="Elige una opción"
            options={TYPE_OF_INQUIRY_OPTIONS}
          />
        </Form.Item>

        <Row gutter={[16, 16]}>
          {dynamicFields.map((field) => (
            <Col xs={24} md={8} key={field.name}>
              <Form.Item
                name={field.name}
                label={field.label}
                rules={[{ required: field.required, message: 'Selecciona una opción' }]}
              >
                <Select
                  allowClear={!field.required}
                  mode={field.mode === 'multiple' ? 'multiple' : undefined}
                  placeholder="Selecciona"
                  options={field.options}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Form.Item
          label="Mensaje"
          name="message"
          rules={inquiryType === 'otro' ? [{ required: true, message: 'Escribe un mensaje' }] : []}
        >
          <TextArea rows={4} placeholder={"Escribe tu mensaje aquí..."} />
        </Form.Item>

        <Form.Item
          name="privacy"
          valuePropName="checked"
          rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Debe aceptar la política de privacidad')) }]}
        >
          <Checkbox>He leído y acepto la <a href="#privacidad" onClick={openPrivacyModal}>política de privacidad</a></Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            disabled={!submittable}
            htmlType="submit"
            loading={loading}
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
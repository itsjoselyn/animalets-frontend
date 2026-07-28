export const YOUTUBE_ID = "dQw4w9WgXcQ";
export const TEXT = "EL HOGAR TEMPORAL QUE TU FUTURO MEJOR AMIGO MERECE · · ·";
export const COUNT = 22;

export const textR = 148;

// TODO: remove hardcoded img when imgs  are uploaded to cloudinary and stored in firestore

export const CARDS = [
    {
        id: 1,
        num: "01",
        title: "Nacimos del abandono",
        text: "En 1996, huertos vacíos dejaron gatos solos bajo la lluvia. Un grupo de vecinos levantó refugios improvisados.",
        img: "https://res.cloudinary.com/dhb3yos4y/image/upload/v1784883476/animalets_bnavou.jpg",
    },
    {
        id: 2,
        num: "02",
        title: "Colonias con corazón",
        text: "200 gatos callejeros en la Llagosta: alimentadores dan su tiempo diario. 6 cathotels los cobijan del frío y protegen su comida.",
        img: "https://res.cloudinary.com/dhb3yos4y/image/upload/v1785225691/DSC_0018_1_stgzvm.jpg",
    },
    {
        id: 3,
        num: "03",
        title: "Gatera vs cemento",
        text: "2021: obras desahucian 50 gatos. ADIF construye gatera para 42 en semilibertad, reubicación.",
        img: "https://res.cloudinary.com/dhb3yos4y/image/upload/v1784817088/DSC_0259_1_kg6pa7.jpg",
    },
];

export const PAGE_SIZE = 12;

export const RING_TEXT = "ADOPTA YA · ADOPTA YA · ADOPTA YA · ";

export const textContactR = 52;

export const TIPOS = [
    { value: "adoptar", label: "Adoptar" },
    { value: "apadrinar", label: "Apadrinar" },
    { value: "acogida", label: "Casa de acogida" },
    { value: "voluntario", label: "Voluntariado" },
    { value: "otros", label: "Otra consulta" },
];

export const CONOCIDO = [
    { value: "web", label: "Web" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "amigo", label: "Por un amigo" },
    { value: "otro", label: "Otro" },
];

export const initialFormState = {
    nombre: "",
    correo: "",
    telefono: "",
    edad: "",
    mensaje: "",
    conocido: "",
    disponibilidad: [],
    tareas: [],
    tareasOtros: "",
    experienciaVol: "",
    tieneExperienciaAnimales: "",
    gatoAcogida: "",
    tipoHogar: "",
    personasCasa: "",
    animalesCasa: [],
    animalesTexto: "",
    tiempoAcogida: "",
    experienciaAcogida: "",
    nombreGato: "",
    tipoAportacion: "",
    cantidadAportacion: "",
    gatoEnMente: "",
    tipoVivienda: [],
    tieneAnimalesCasa: "",
    hayPersonasCasa: "",
    tieneExperienciaGatos: "",
    animalesActuales: [],
    animalesActualesTexto: "",
    personasAdoptar: "",
    experienciaAdoptar: "",
};

export const AUTO_SCROLL_INTERVAL = 3000;

export const STEPS = [
    {
        id: "01",
        title: "Rellena el formulario",
        description: "Rellena la información y cuéntanos un poco sobre ti.",
        emoji: "📋",
    },
    {
        id: "02",
        title: "Te contactamos",
        description: "Quedamos un día para que puedas conocer a nuestra familia gatuna.",
        emoji: "📱",
    },
    {
        id: "03",
        title: "El encuentro",
        description: "Prepárate para descubrir a tu compañero gatuno.",
        emoji: "🐱",
    },
    {
        id: "04",
        title: "Bienvenido",
        description: "Últimos pasos y tu compañero felino será parte de tu familia.",
        emoji: "🏠",
    },
];

export const OPTIONS = [
    { id: 1, title: "Voluntariado", link: "/como-ayudar", img: "https://res.cloudinary.com/dhb3yos4y/image/upload/v1784815676/DSC_0213_1_c6yqfo.jpg" },
    { id: 2, title: "Apadrinar un Gato", link: "/como-ayudar", img: "https://res.cloudinary.com/dhb3yos4y/image/upload/v1784816230/DSC_0325_1_murwwa.jpg" },
    { id: 3, title: "Hacerse Socio", link: "/como-ayudar", img: "https://res.cloudinary.com/dhb3yos4y/image/upload/v1784816409/DSC_0266_1_cebshp.jpg" },
    { id: 4, title: "Casa de Acogida", link: "/como-ayudar", img: "https://res.cloudinary.com/dhb3yos4y/image/upload/v1784816476/DSC_0307_1_d1hq2c.jpg" },
];



export const OPTIONS_FILTER = [
    { value: "age_asc", label: "Jóvenes" },
    { value: "age_desc", label: "Mayores" },
    { value: "macho", label: "Gatos (machos)" },
    { value: "hembra", label: "Gatas (hembras)" },
];

export const EMPTY_CAT = {
    nombre: '',
    edad: '',
    sexo: '',
    historia: '',
    estado: 'disponible',
    apadrinado: false,
    necesidades: [],
    imagenes: [], // array of { url, path }
    superpoderes: { nivelMimos: '', habilidadEspecial: '', estadoActual: '' },
};

export const EMPTY_NEWS = {
    titulo: "",
    descripcion: "",
    imagenes: [],
};

export const TYPE_LABELS = {
    acogida: "Acogida",
    adopcion: "Adopción",
    apadrinar: "Apadrinamiento",
    voluntariado: "Voluntariado",
    otros: "Otros",
};

export const STATUS_LABELS = {
    nuevo: "Nuevo",
    leido: "Leído",
};

export const STATUS_OPTIONS = ["todas", "nuevo", "leido"];
export const TYPE_OPTIONS = ["todos", "acogida", "adopcion", "apadrinar", "voluntariado", "otros"];

export const EMPTY_TESTIMONY = {
    titulo: "",
    descripcion: "",
};

export const TYPE_FIELDS = {
    voluntario: ['disponibilidad', 'tareas', 'tareasOtros', 'tieneExperienciaAnimales', 'experienciaVol'],
    acogida: ['gatoEnMente', 'tipoVivienda', 'tieneAnimalesCasa', 'animalesActuales', 'animalesActualesTexto', 'hayPersonasCasa', 'personasAdoptar', 'tieneExperienciaGatos', 'experienciaAcogida', 'tiempoAcogida', 'tipoHogar'],
    apadrinar: ['nombreGato', 'tipoAportacion', 'cantidadAportacion'],
    adoptar: ['gatoEnMente', 'tipoVivienda', 'tieneAnimalesCasa', 'animalesActuales', 'animalesActualesTexto', 'hayPersonasCasa', 'personasAdoptar', 'tieneExperienciaGatos', 'experienciaAdoptar'],
    otros: [],
};


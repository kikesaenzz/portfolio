// Contenido del portfolio y del CV. Es la ÚNICA fuente: la web lo lee directamente y
// `npm run cv` genera con estos mismos datos el CV en Word y PDF, para que ambos
// digan siempre lo mismo. Cambia aquí textos, orden y enlaces sin tocar el diseño.

export const profile = {
  name: 'Enrique Sáenz de Urturi',
  headline: 'Desarrollador backend',
  email: 'kikesaenzz@gmail.com',
  phone: '+34 644 21 98 17',
  phoneHref: 'tel:+34644219817',
  city: 'Zaragoza, España',
  web: 'enrique-saenz.vercel.app',
  cvPdf: '/CV-Enrique-Saenz-de-Urturi.pdf',
  cvDocx: '/CV-Enrique-Saenz-de-Urturi.docx',
};

// Texto de "Acerca de mí" (CV) y frase de perfil (web)
export const summary =
  'Técnico Superior en Desarrollo de Aplicaciones Web. Desde enero de 2025 trabajo en Memorándum Tecnología en proyectos de la Administración Pública: mantenimiento evolutivo y correctivo de aplicaciones Java para el Ministerio de Educación, Formación Profesional y Deportes, desarrollo y pruebas del sistema de gestión de subvenciones del Ministerio de Vivienda y automatización de trámites administrativos para Agriflow PAC. También he transformado datos para la Biblioteca Nacional de España.';

// El orden de `sections` es el orden de importancia para quien lee: lo primero que
// necesita un reclutador va arriba, el contacto cierra el recorrido.
export const sections = [
  { id: 'perfil', n: '01', label: 'Perfil', blurb: 'Quién soy en diez segundos' },
  { id: 'hacer', n: '02', label: 'Qué hago', blurb: 'Cuatro áreas, de mayor a menor peso' },
  { id: 'experiencia', n: '03', label: 'Experiencia', blurb: 'Memorándum Tecnología y prácticas' },
  { id: 'casos', n: '04', label: 'Casos', blurb: 'Proyectos para ministerios y clientes' },
  { id: 'proyectos', n: '05', label: 'Proyectos propios', blurb: 'Webs y apps en producción' },
  { id: 'stack', n: '06', label: 'Stack', blurb: 'Lenguajes, datos y herramientas' },
  { id: 'formacion', n: '07', label: 'Formación', blurb: 'Titulación y cursos' },
  { id: 'contacto', n: '08', label: 'Contacto', blurb: 'Escríbeme o descarga el CV' },
];

export const facts = [
  { k: 'Ahora', v: 'Ministerio de Educación, FP y Deportes', s: 'Java EE, proyecto recién iniciado' },
  { k: 'También', v: 'Ministerio de Vivienda', s: 'Gestión de subvenciones, Spring Boot' },
  { k: 'Empresa', v: 'Memorándum Tecnología', s: 'desde enero de 2025' },
  { k: 'Disponible', v: 'Disponibilidad total', s: 'Zaragoza, carné de conducir' },
];

export const capabilities = [
  {
    t: 'Backend Java y Spring Boot',
    d: 'Desarrollo y mantengo aplicaciones y microservicios Java (Java EE y Spring Boot) para la Administración Pública, con APIs REST documentadas con OpenAPI y bases de datos versionadas con Liquibase.',
    chips: ['Java EE', 'Spring Boot', 'Maven', 'OpenAPI 3', 'Kong API Gateway', 'Liquibase'],
    seen: ['Ministerio de Vivienda: Sistema de Gestión de Subvenciones', 'Ministerio de Educación: aplicaciones de concursos CIE y CIS'],
  },
  {
    t: 'Mantenimiento y cumplimiento normativo',
    d: 'Corrijo errores en producción, adapto aplicaciones a la normativa y dejo cada cambio publicado, trazado y documentado.',
    chips: ['Depuración en producción', 'RGPD', 'Git por ramas', 'Merge requests', 'Documentación técnica', 'iText'],
    seen: ['Ministerio de Educación: adaptación al RGPD, error de registro y codificación en unos 30 ficheros'],
  },
  {
    t: 'Automatización y pruebas',
    d: 'Automatizo trámites y procesos con Python, Power Platform y Azure, y valido con pruebas funcionales y automáticas.',
    chips: ['Python', 'Power Platform', 'Azure', 'Postman y Newman', 'Selenium', 'Ranorex'],
    seen: ['Agriflow PAC: automatización de trámites administrativos agrarios', 'Ministerio de Vivienda: pruebas funcionales con colecciones Postman'],
  },
  {
    t: 'Datos e integración de sistemas',
    d: 'Transformo, indexo y conecto datos y plataformas con Node.js, PHP y Laravel, con tareas programadas y procesos por lotes.',
    chips: ['Node.js', 'MongoDB', 'Elasticsearch', 'PHP', 'Laravel', 'APIs REST', 'SQL'],
    seen: ['Marimba: de MARC21 a RDF para la Biblioteca Nacional de España', 'Integración con la plataforma de vídeo Kaltura'],
  },
];

export const jobs = [
  {
    role: 'Desarrollador backend',
    org: 'Memorándum Tecnología',
    period: 'Enero 2025 – actualidad',
    current: true,
    intro: 'Desarrollo backend en proyectos de la Administración Pública y de clientes del sector agrario, con Java, PHP y Python, y automatización de procesos y pruebas.',
    bullets: [
      'Ministerio de Educación, Formación Profesional y Deportes (actualmente): mantenimiento evolutivo y correctivo de las aplicaciones web de concursos de traslados y de provisión de puestos en el exterior, con Java EE.',
      'Ministerio de Vivienda: desarrollo backend y pruebas funcionales del Sistema de Gestión de Subvenciones, con microservicios Java y Spring Boot.',
      'Agriflow PAC: automatización de trámites administrativos agrarios, con servicios de IA integrados en Power Platform y Azure.',
      'Biblioteca Nacional de España (Marimba): proceso de transformación de datos MARC21 a RDF con Node.js, MongoDB y Elasticsearch.',
      'Integración con la plataforma de vídeo Kaltura mediante APIs REST, con tareas programadas y procesos por lotes en PHP y Laravel.',
      'Documentación técnica y trabajo con Git por ramas y merge requests, en equipos multidisciplinares.',
    ],
    techTitle: 'Experiencia técnica y herramientas',
    tech: [
      'Backend: Java EE, Servlets/JSP, Java con Spring Boot y Maven, PHP y Laravel, Python (Django y Wagtail), Node.js.',
      'APIs y arquitectura: APIs REST documentadas con OpenAPI 3, Kong API Gateway y microservicios.',
      'Datos: SQL, MySQL, MongoDB y Elasticsearch; migraciones con Liquibase.',
      'Pruebas y automatización: Postman y Newman, Selenium, Ranorex y Python.',
      'Herramientas: Git, GitLab y Bitbucket; iText; Azure y Power Platform.',
    ],
  },
  {
    role: 'QA tester en prácticas',
    org: 'Entertainment Solutions',
    period: 'Marzo – junio 2024',
    current: false,
    intro: '',
    bullets: [
      'Pruebas manuales y automatizadas con Selenium y JavaScript.',
      'Registro de incidencias con GitLab y colaboración con el equipo de desarrollo.',
    ],
    techTitle: '',
    tech: [] as string[],
  },
];

export const cases = [
  {
    client: 'Ministerio de Educación, Formación Profesional y Deportes',
    period: 'Actualmente',
    title: 'Concursos de traslados y puestos en el exterior',
    role: 'Desarrollador Java · mantenimiento evolutivo y correctivo (CIE y CIS)',
    bullets: [
      'Adapté dos aplicaciones de solicitud de concursos públicos (CIE y CIS) al RGPD: texto legal en el Registro Electrónico (SICRES), en el prerregistro, en el justificante y en el PDF de la solicitud.',
      'Resolví un error en producción que dejaba la pantalla en blanco al registrar solicitudes. Ahora el registro termina siempre y el fallo queda trazado en el log.',
      'Corregí la codificación de caracteres (UTF-8 e ISO-8859) en unos 30 ficheros entre JSPs, clases Java y generación de PDF con iText.',
      'Trabajé con Git por ramas, merge requests en GitLab y versiones etiquetadas: mis cambios salieron en las versiones 1.0.1 (CIE) y 1.0.2 (CIS).',
      'Redacté la documentación técnica de los cambios con la plantilla oficial del Ministerio.',
    ],
    stack: ['Java EE', 'Servlets/JSP', 'iText', 'RGPD', 'Git y GitLab'],
  },
  {
    client: 'Ministerio de Vivienda',
    period: 'Gestión de subvenciones',
    title: 'Sistema de Gestión de Subvenciones (SGS)',
    role: 'Desarrollo backend y pruebas',
    bullets: [
      'Desarrollo backend de un sistema de gestión de subvenciones públicas con arquitectura de microservicios (Java, Spring Boot y Maven).',
      'APIs REST documentadas con OpenAPI 3 y expuestas con Kong API Gateway; migraciones de base de datos con Liquibase (scripts DDL y DML).',
      'Funcionalidades en el frontend Django y Wagtail del portal del gestor (Python).',
      'Pruebas funcionales con colecciones Postman y Newman, informes de conformidad y entregables de cierre (análisis funcional, especificaciones técnicas y OpenAPI).',
      'Integración con sistemas de identidad y control de acceso. Git (Bitbucket) con ramas de feature y pull requests por API, en coordinación con backend, frontend e infraestructura.',
    ],
    stack: ['Java', 'Spring Boot', 'Kong', 'OpenAPI', 'Liquibase', 'Django', 'Postman'],
  },
  {
    client: 'Agriflow PAC',
    period: 'Desde enero de 2025',
    title: 'Automatización de trámites agrarios',
    role: 'Automatización con IA, Power Platform y Azure',
    bullets: [
      'Automatización de trámites administrativos agrarios y otros procedimientos, de forma continuada desde mi incorporación.',
      'Conexiones y componentes backend entre aplicaciones, datos y servicios de IA con Power Platform y Azure.',
      'Flujos de transformación de información para el análisis de datos de la tramitación.',
      'Pruebas y revisión de trazabilidad, con supervisión humana de los resultados, y documentación de procesos y dependencias.',
    ],
    stack: ['Power Platform', 'Azure', 'Servicios de IA', 'APIs'],
  },
  {
    client: 'Biblioteca Nacional de España',
    period: 'Desde 2025',
    title: 'Marimba',
    role: 'Integración y transformación de datos',
    bullets: [
      'Desarrollé y mantuve el proceso que transforma datos MARC21 a RDF.',
      'Gestioné e indexé datos enlazados.',
    ],
    stack: ['Node.js', 'MongoDB', 'Elasticsearch'],
  },
  {
    client: 'Memorándum Tecnología',
    period: 'Desde 2025',
    title: 'Integración de plataformas de vídeo',
    role: 'Backend e integración de servicios',
    bullets: [
      'Desarrollé APIs REST y la integración con Kaltura.',
      'Gestioné tareas programadas y procesos por lotes.',
    ],
    stack: ['PHP', 'Laravel', 'APIs REST', 'Kaltura'],
  },
];

export const works = [
  {
    tag: 'Evento · inscripciones y avisos',
    title: 'Carrera de Relevos',
    desc: 'Web de una carrera por relevos con cuenta atrás, mapa de la ruta e inscripción. Cada inscripción se guarda en Google Sheets mediante Apps Script, con correo de confirmación y un panel privado para ver la lista y avisar a todos los inscritos.',
    stack: ['JavaScript', 'Apps Script', 'Google Sheets', 'EmailJS', 'Leaflet', 'Vercel'],
    img: '/projects/relevos.jpg',
    alt: 'Portada de la web Carrera de Relevos',
    live: 'https://carrera-relevos.vercel.app',
    repo: 'https://github.com/kikesaenzz/carrera-relevos',
  },
  {
    tag: 'App web · fotos en tiempo real',
    title: 'Gincana Fotográfica',
    desc: 'Web móvil para bodas: cada invitado se registra, completa retos fotográficos y sube sus fotos. Incluye clasificación en vivo, galería global, descarga en ZIP y varias bodas en la misma app, con datos aislados por evento.',
    stack: ['JavaScript', 'Vercel Functions', 'Cloudinary', 'PWA'],
    img: '/projects/gincana.jpg',
    alt: 'Pantalla de bienvenida de la Gincana Fotográfica',
    live: 'https://gincana-boda.vercel.app',
    repo: 'https://github.com/kikesaenzz/gymcana',
  },
  {
    tag: 'App de gestión · datos en Google Sheets',
    title: 'El Bote del Aston',
    desc: 'Aplicación para llevar la caja común de un equipo: jugadores, aportaciones y gastos, con entrenamientos restantes y alerta de saldo bajo. Usa Google Sheets como base de datos, acceso por contraseña y sesión con cookie firmada.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Google Sheets API', 'Zod'],
    img: '/projects/bote.jpg',
    alt: 'Pantalla de acceso de El Bote del Aston',
    live: 'https://elbotedelaston.vercel.app',
    note: 'Acceso privado: el código es privado y la app pide contraseña.',
  },
];

export const stack = [
  { t: 'Backend', c: ['Java', 'Java EE', 'Spring Boot', 'PHP', 'Laravel', 'Python', 'Node.js'] },
  { t: 'APIs y arquitectura', c: ['APIs REST', 'OpenAPI 3', 'Kong API Gateway', 'Microservicios', 'Servlets/JSP'] },
  { t: 'Datos', c: ['SQL', 'MySQL', 'MongoDB', 'Elasticsearch', 'Liquibase'] },
  { t: 'Pruebas y automatización', c: ['Postman y Newman', 'Selenium', 'Ranorex', 'Python'] },
  { t: 'Herramientas y calidad', c: ['Git', 'GitLab', 'Bitbucket', 'Maven', 'iText', 'RGPD', 'Documentación técnica'] },
  { t: 'Cloud e IA', c: ['Azure', 'Power Platform', 'Azure AI', 'Servicios de IA'] },
  { t: 'Idiomas', c: ['Castellano · nativo', 'Inglés · B1'] },
];

export const education = {
  degrees: [
    { t: 'Técnico Superior en Desarrollo de Aplicaciones Web', s: 'Colegio Montessori', d: 'Junio 2024' },
    { t: 'Técnico en Sistemas Microinformáticos y Redes', s: 'Salesianos', d: 'Julio 2021' },
  ],
  courses: [
    { t: 'Introducción a Microsoft Azure', s: 'INAEM', d: '2026' },
    { t: 'Formación Python', s: 'freeCodeCamp', d: '' },
  ],
  inProgress: 'Preparación del examen de certificación de Microsoft Azure',
};

export const extra = ['Carné de conducir', 'Disponibilidad total'];

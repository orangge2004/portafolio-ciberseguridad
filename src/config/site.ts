import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface FocusArea {
  title: string;
  description: string;
}

export interface PracticeArea {
  slug: string;
  index: string;
  title: string;
  summary: string;
  description: string;
  topics: string[];
  evidence: string;
}

export type LabFilter = 'web' | 'linux' | 'windows' | 'network' | 'ctf';

export interface Lab {
  slug: string;
  title: string;
  platform: string;
  difficulty: string;
  date: string;
  category: string;
  filter: LabFilter;
  summary: string;
  objective: string;
  environment: string[];
  steps: string[];
  findings: string[];
  lessons: string[];
  tools: string[];
  /** URL pública del writeup completo, si está publicado fuera del portafolio. */
  writeupUrl?: string;
  featured: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  status: 'Completada' | 'En curso';
  focus: string;
  /** Fecha ISO de aprobación, por ejemplo '2026-01-20'. */
  date?: string;
  /** Fecha ya formateada para mostrarla en la web. */
  dateLabel?: string;
  /** Duración del curso en horas, según el diploma. */
  hours?: number;
  /** Código de la certificación que aparece en el diploma. */
  credentialId?: string;
  /** Enlace público para verificar la credencial. */
  credentialUrl?: string;
  /** Ruta del diploma en PDF dentro de public/. */
  file?: string;
}

export interface LearningStage {
  stage: string;
  title: string;
  description: string;
  topics: string[];
}

const baseSite = {
  // Placeholders públicos. Tus datos reales van en site.local.json (ignorado por Git).
  name: 'Tu Nombre',
  initials: 'TN',
  role: 'Ciberseguridad en formación',
  tagline:
    'Portafolio de aprendizaje sobre hacking ético, laboratorios y seguridad ofensiva.',
  email: 'tu@email.com',
  location: 'Tu ciudad · Remoto',
  availability: 'Portafolio en construcción',
  responseTime: 'Te responderé lo antes posible.',

  nav: [
    { label: 'Inicio', href: '/' },
    { label: 'Sobre mí', href: '/sobre-mi' },
    { label: 'Práctica', href: '/practicas' },
    { label: 'Laboratorios', href: '/laboratorios' },
    { label: 'Formación', href: '/formacion' },
    { label: 'Contacto', href: '/contacto' },
  ] satisfies NavItem[],

  // Añade tus perfiles cuando los tengas. Si la lista está vacía, no se muestra.
  // Ejemplo:
  // { label: 'GitHub', href: 'https://github.com/tu-usuario' },
  socials: [] as SocialLink[],

  focus: [
    {
      title: 'Redes',
      description: 'Entender cómo se comunican los sistemas y dónde aparecen los fallos.',
    },
    {
      title: 'Linux',
      description: 'Mi entorno de trabajo para laboratorios y práctica diaria.',
    },
    {
      title: 'Web',
      description: 'OWASP Top 10, autenticación y control de acceso.',
    },
    {
      title: 'Reporte',
      description: 'Documentar cada ejercicio con pasos, evidencias y aprendizajes.',
    },
  ] satisfies FocusArea[],

  practiceAreas: [
    {
      slug: 'fundamentos-redes',
      index: '01',
      title: 'Fundamentos y redes',
      summary:
        'La base para entender cómo se comunican los sistemas y qué superficie de ataque existe.',
      description:
        'Antes de buscar vulnerabilidades hay que entender el entorno. Esta área recoge ejercicios y notas sobre direccionamiento, puertos, DNS, HTTP y el recorrido de una petición entre cliente y servidor.',
      topics: ['Modelo TCP/IP', 'Puertos y servicios', 'DNS', 'HTTP y HTTPS'],
      evidence:
        'Mapas de red, capturas comentadas y notas de laboratorio explicando qué ocurre en cada paso.',
    },
    {
      slug: 'linux-sistemas',
      index: '02',
      title: 'Linux y sistemas',
      summary:
        'El sistema operativo donde se ejecutan la mayoría de laboratorios y herramientas.',
      description:
        'Practico navegación por el sistema de archivos, permisos, procesos, servicios y gestión de usuarios. El objetivo es moverme con soltura en la terminal y entender qué configuración puede abrir una puerta.',
      topics: ['Comandos esenciales', 'Permisos y usuarios', 'Procesos y servicios', 'Búsqueda y filtrado'],
      evidence:
        'Notas de laboratorio con comandos utilizados, resultados y explicación de por qué funcionan.',
    },
    {
      slug: 'seguridad-web',
      index: '03',
      title: 'Seguridad web',
      summary:
        'Vulnerabilidades comunes en aplicaciones web y cómo identificarlas de forma manual.',
      description:
        'Estudio el OWASP Top 10 y practico con aplicaciones deliberadamente vulnerables. Me interesa entender la causa de cada fallo, no solo ejecutar una herramienta: autenticación, control de acceso, validación de entrada y lógica de negocio.',
      topics: ['OWASP Top 10', 'Autenticación', 'Control de acceso', 'Validación de entrada'],
      evidence:
        'Writeups de laboratorios web con peticiones, respuestas y explicación del impacto.',
    },
    {
      slug: 'reconocimiento',
      index: '04',
      title: 'Reconocimiento y enumeración',
      summary:
        'Aprender a observar antes de actuar y a delimitar qué servicios están expuestos.',
      description:
        'Trabajo técnicas de reconocimiento pasivo y activo únicamente sobre entornos propios o plataformas que permiten la práctica. El foco está en interpretar la información, priorizar objetivos y documentar el alcance.',
      topics: ['OSINT básico', 'Enumeración de servicios', 'Análisis de versiones', 'Documentación del alcance'],
      evidence:
        'Checklists de reconocimiento y notas con los servicios encontrados y su relevancia.',
    },
    {
      slug: 'explotacion-laboratorios',
      index: '05',
      title: 'Explotación en laboratorios',
      summary:
        'Práctica controlada de vulnerabilidades conocidas y escalada de privilegios.',
      description:
        'Resuelvo máquinas y retos en entornos autorizados para entender el ciclo completo: acceso inicial, enumeración, escalada y limpieza. Cada ejercicio se documenta con contexto y sin publicar datos sensibles.',
      topics: ['Acceso inicial', 'Escalada de privilegios', 'Movimiento controlado', 'Buenas prácticas'],
      evidence:
        'Writeups paso a paso, con lecciones aprendidas y referencias para repasar.',
    },
    {
      slug: 'documentacion',
      index: '06',
      title: 'Documentación y reporte',
      summary:
        'Convertir la práctica en evidencia clara, reproducible y útil para otra persona.',
      description:
        'Un ejercicio sin documentación se olvida. Practico la redacción de objetivos, pasos, evidencias, impacto y recomendaciones, cuidando no revelar información sensible de los entornos donde practico.',
      topics: ['Estructura de un writeup', 'Evidencias', 'Impacto y riesgo', 'Recomendaciones'],
      evidence:
        'Informes de práctica y writeups publicados en este portafolio.',
    },
  ] satisfies PracticeArea[],

  // Laboratorios publicados. Cada entrada genera una página en /laboratorios/:slug.
  projects: [
    {
      slug: '2026-11-tproot',
      title: 'Tproot — backdoor en vsftpd 2.3.4',
      platform: 'DockerLabs',
      difficulty: 'Muy fácil',
      date: '2026-11',
      category: 'Linux',
      filter: 'linux',
      summary:
        'Compromiso de una máquina DockerLabs mediante el backdoor de vsftpd 2.3.4 (CVE-2011-2523).',
      objective:
        'Identificar los servicios expuestos, validar la vulnerabilidad del FTP en un entorno controlado y documentar el acceso y su impacto.',
      environment: [
        'DockerLabs (contenedor Docker)',
        'Kali Linux en máquina virtual',
        'Red bridge de Docker 172.17.0.0/16',
      ],
      steps: [
        'Enumeré los puertos con nmap y localicé FTP y HTTP como única superficie.',
        'Descarté la web: solo había la página por defecto de Apache y rutas protegidas.',
        'Comprobé el acceso anónimo al FTP, que fallaba por un error de configuración.',
        'Identifiqué vsftpd 2.3.4 y la vulnerabilidad CVE-2011-2523 con searchsploit.',
        'Reproduje el trigger del backdoor y obtuve una shell bind en el puerto 6200.',
        'Confirmé los privilegios con id y documenté la evidencia antes de cerrar el laboratorio.',
      ],
      findings: [
        'El banner de vsftpd 2.3.4 corresponde a la versión con el backdoor de CVE-2011-2523.',
        'El trigger abre una shell con privilegios de root dentro del contenedor.',
        'El error del FTP anónimo y la página por defecto de Apache eran pistas falsas.',
        'Root en el contenedor no equivale a root en el host; un escape de Docker sería otro paso.',
      ],
      lessons: [
        'Un banner de versión es una hipótesis que hay que validar, no una confirmación.',
        'Antes de dar un exploit por fallido, conviene comprobar el estado del servicio.',
        'Los intentos fallidos también documentan el proceso y explican las decisiones.',
        'El análisis debe terminar en causa raíz, impacto y remediación, no solo en el acceso.',
      ],
      tools: ['nmap', 'gobuster', 'searchsploit', 'Metasploit', 'netcat'],
      writeupUrl:
        'https://gist.github.com/orangge2004/4c181e8dbdb0d1362c186e1329717c9a',
      featured: true,
    },
  ] as Lab[],

  // Las certificaciones personales van en site.local.json (ignorado por Git).
  // El repositorio público se queda con el estado vacío.
  certifications: [] as Certification[],

  learningPath: [
    {
      stage: '01',
      title: 'Fundamentos',
      description: 'Redes, sistemas operativos, Linux y HTTP.',
      topics: ['TCP/IP', 'Linux', 'DNS', 'HTTP'],
    },
    {
      stage: '02',
      title: 'Seguridad web',
      description: 'Vulnerabilidades comunes y pruebas manuales en entornos de práctica.',
      topics: ['OWASP Top 10', 'Autenticación', 'Control de acceso'],
    },
    {
      stage: '03',
      title: 'Pentesting',
      description: 'Reconocimiento, enumeración y explotación controlada en laboratorios.',
      topics: ['Enumeración', 'Explotación', 'Escalada de privilegios'],
    },
    {
      stage: '04',
      title: 'Documentación',
      description: 'Convertir cada ejercicio en un writeup claro y reproducible.',
      topics: ['Evidencias', 'Impacto', 'Recomendaciones'],
    },
  ] satisfies LearningStage[],
};

export type Site = typeof baseSite;

function loadLocalSite(): Partial<Site> {
  // En despliegues (Vercel, CI) no existe site.local.json porque está ignorado por Git.
  // Permite inyectar los mismos datos con la variable de entorno SITE_LOCAL_JSON.
  const envJson = process.env.SITE_LOCAL_JSON?.trim();
  if (envJson) {
    try {
      return JSON.parse(envJson) as Partial<Site>;
    } catch (error) {
      console.warn(
        `SITE_LOCAL_JSON no es JSON válido: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const localPath = path.join(projectRoot, 'site.local.json');

  if (!existsSync(localPath)) {
    return {};
  }

  try {
    return JSON.parse(readFileSync(localPath, 'utf8')) as Partial<Site>;
  } catch (error) {
    console.warn(
      `No se pudo leer site.local.json: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {};
  }
}

/**
 * Datos públicos que se pueden sobrescribir desde el hosting sin tocar el
 * repositorio. Útil para que el nombre del logo no sea un placeholder cuando
 * site.local.json no viaja en el despliegue.
 */
function loadEnvOverrides(): Partial<Site> {
  const overrides: Partial<Site> = {};
  if (process.env.SITE_NAME) overrides.name = process.env.SITE_NAME;
  if (process.env.SITE_INITIALS) overrides.initials = process.env.SITE_INITIALS;
  if (process.env.SITE_EMAIL) overrides.email = process.env.SITE_EMAIL;
  if (process.env.SITE_LOCATION) overrides.location = process.env.SITE_LOCATION;
  return overrides;
}

export const site: Site = { ...baseSite, ...loadLocalSite(), ...loadEnvOverrides() };

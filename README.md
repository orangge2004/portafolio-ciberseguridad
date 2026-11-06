# Portafolio de aprendizaje en ciberseguridad

[![CI](https://github.com/orangge2004/portafolio-ciberseguridad/actions/workflows/ci.yml/badge.svg)](https://github.com/orangge2004/portafolio-ciberseguridad/actions/workflows/ci.yml)

Portafolio personal para documentar el aprendizaje en **hacking ético, laboratorios y seguridad ofensiva**. Está pensado como un cuaderno público: empieza sin proyectos ni certificaciones inventadas y crece a medida que completes ejercicios reales.

> **Importante:** este sitio no vende servicios profesionales. Su objetivo es mostrar práctica personal en entornos autorizados y servir como registro de progreso.

## Stack

- Node.js 22+ y TypeScript
- Express 5 + EJS
- Express EJS Layouts
- CSS propio y JavaScript sin dependencias
- Cabeceras de seguridad configuradas en el servidor

## Requisitos

- Node.js 22 o superior (recomendado: la versión de `.node-version`)
- npm 10+

## Desarrollo

```bash
npm install
npm run dev
```

Abrir <http://127.0.0.1:3000>.

## Comandos

```bash
npm run dev        # servidor con recarga automática
npm run typecheck  # verificación de tipos
npm run build      # compila TypeScript y copia las vistas a dist/
npm start          # ejecuta la versión compilada
```

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Inicio: presentación, áreas de práctica, método y laboratorios |
| `/sobre-mi` | Quién eres, principios y ruta de aprendizaje |
| `/practicas` | Áreas de práctica y preguntas frecuentes |
| `/laboratorios` | Ejercicios prácticos y writeups |
| `/laboratorios/:slug` | Detalle de un laboratorio |
| `/formacion` | Ruta de aprendizaje y certificaciones |
| `/contacto` | Contacto para feedback y colaboraciones |
| `/health` | Comprobación de estado del servidor |

Las rutas antiguas `/servicios`, `/proyectos` y `/certificaciones` redirigen a las nuevas.

## Personalización y privacidad

El repositorio público incluye **placeholders** y no contiene datos personales. Tus datos reales viven en archivos ignorados por Git:

- `site.local.json`: nombre, iniciales, email, ubicación, redes y certificaciones.
- `public/diplomas/`: los PDF originales de tus diplomas.

Para empezar, copia el ejemplo y edítalo:

```bash
cp site.local.example.json site.local.json
```

```json
{
  "name": "Tu Nombre",
  "initials": "TN",
  "email": "tu@email.com",
  "location": "Tu ciudad · Remoto",
  "certifications": []
}
```

El servidor combina `site.ts` con `site.local.json` al arrancar. Si el archivo no existe, usa los placeholders públicos. Para aplicar cambios en `site.local.json`, reinicia el servidor (`npm run dev` no siempre detecta cambios en JSON).

> **Nunca hagas commit de `site.local.json` ni de `public/diplomas/`.** Están en `.gitignore` precisamente para evitar que tu nombre completo, ubicación, email, códigos de certificación o PDFs personales acaben en el historial del repositorio.

El resto del contenido genérico (áreas de práctica, ruta de aprendizaje, navegación, textos) está en **`src/config/site.ts`**.

### Añadir tu primer laboratorio

El array `projects` empieza vacío a propósito. Cuando termines un ejercicio, añade un objeto:

```ts
projects: [
  {
    slug: 'laboratorio-web-01',
    title: 'Primer laboratorio de seguridad web',
    platform: 'Laboratorio propio',
    difficulty: 'Principiante',
    date: '2026-11',
    category: 'Web',
    filter: 'web',
    summary: 'Resumen breve de lo que practiqué y aprendí.',
    objective: 'Entender y explotar una vulnerabilidad en un entorno controlado.',
    environment: ['Máquina virtual local', 'Aplicación vulnerable propia'],
    steps: [
      'Preparé el entorno y verifiqué que era accesible.',
      'Enumeré la aplicación y localicé el punto de entrada.',
      'Documenté la explotación y las evidencias.',
    ],
    findings: [
      'Hallazgo técnico principal y por qué ocurre.',
      'Comportamiento observado y su impacto en el ejercicio.',
    ],
    lessons: [
      'Qué haría distinto la próxima vez.',
      'Qué concepto necesito repasar.',
    ],
    tools: ['Navegador', 'Terminal'],
    featured: true,
  },
] as Lab[],
```

Valores disponibles para `filter`: `web`, `linux`, `windows`, `network` y `ctf`. El campo `featured: true` hace que el laboratorio aparezca también en la página de inicio. El resto de campos se muestran en la página de detalle.

### Añadir una certificación

Las certificaciones personales **no van en `site.ts`**. Añádelas en `site.local.json`, dentro del array `certifications`, y guarda el PDF original en `public/diplomas/` (ambos ignorados por Git):

```json
{
  "certifications": [
    {
      "name": "Nombre de la certificación",
      "issuer": "Entidad emisora",
      "status": "Completada",
      "focus": "Qué cubre y por qué la hiciste.",
      "date": "2026-01-20",
      "dateLabel": "20 de enero de 2026",
      "hours": 8,
      "credentialId": "código-que-aparece-en-el-diploma",
      "credentialUrl": "https://enlace-publico-de-verificacion",
      "file": "/diplomas/nombre-del-archivo.pdf"
    }
  ]
}
```

El estado puede ser `Completada` o `En curso`. Los campos `date`, `dateLabel`, `hours`, `credentialId`, `credentialUrl` y `file` son opcionales: si no los pones, la tarjeta simplemente no muestra esa información. El PDF se sirve desde `public/diplomas/`, así que el campo `file` debe empezar por `/diplomas/`.

En el repositorio público el array queda vacío a propósito: la sección de formación muestra el estado vacío, sin credenciales ni PDFs de nadie.

### Otras secciones editables

- `focus`: las cuatro áreas que aparecen bajo el hero.
- `practiceAreas`: las áreas de práctica y cómo documentas cada una.
- `learningPath`: las etapas de tu ruta de aprendizaje.
- `nav`: los enlaces de la navegación principal.

### Colores y estilos

Los tokens de diseño están al inicio de `public/css/style.css`:

```css
:root {
  --brand: #12325a;
  --brand-dark: #0b2340;
  --accent: #1d4ed8;
  --accent-soft: #eef4ff;
  --bg-soft: #f6f8fb;
  --ink: #182230;
  --muted: #4b5b70;
}
```

## Estructura

```text
.
├── .github/workflows/ci.yml
├── public/
│   ├── css/style.css
│   ├── js/main.js
│   ├── diplomas/              # privado, ignorado por Git
│   └── favicon.svg
├── scripts/
│   └── copy-views.mjs
├── src/
│   ├── config/site.ts          # contenido genérico y placeholders
│   ├── server.ts
│   └── views/
│       ├── layouts/main.ejs
│       ├── partials/
│       ├── home.ejs
│       ├── sobre-mi.ejs
│       ├── practicas.ejs
│       ├── laboratorios.ejs
│       ├── laboratorio.ejs
│       ├── formacion.ejs
│       ├── contacto.ejs
│       ├── 404.ejs
│       └── 500.ejs
├── site.local.example.json
├── site.local.json             # privado, ignorado por Git
├── package.json
└── tsconfig.json
```

## Formulario de contacto

El formulario **no envía datos a ningún servidor**. Valida los campos en el navegador y abre el cliente de correo con el mensaje ya redactado mediante un enlace `mailto:`. Esto evita almacenar datos personales.

Si más adelante quieres recibir los mensajes por email o guardarlos, añade un endpoint con validación, limitación de peticiones y un proveedor de correo. No incluyas secretos en el repositorio: usa variables de entorno.

## Seguridad

El servidor aplica estas cabeceras:

- `Content-Security-Policy` restrictiva, sin recursos externos
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Cross-Origin-Opener-Policy: same-origin`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` sin cámara, micrófono ni geolocalización
- `Strict-Transport-Security` en producción
- `x-powered-by` desactivado

Buenas prácticas al desplegar:

- Usa HTTPS y un proxy inverso (Caddy, Nginx o similar).
- Mantén Node.js y las dependencias actualizadas.
- Define `PORT` y `HOST` mediante variables de entorno.
- No publiques datos de sistemas de terceros ni información sensible.
- Documenta solo práctica en entornos propios o plataformas que lo permitan.

## Despliegue

```bash
npm ci
npm run build
NODE_ENV=production HOST=0.0.0.0 PORT=3000 npm start
```

El comando `build` compila TypeScript a `dist/` y copia las vistas EJS a `dist/views`. La carpeta `public/` se sirve directamente desde la raíz del proyecto. En producción se activan HSTS y el caché de estáticos; asegúrate de servir el sitio por HTTPS.

Al desplegar, crea `site.local.json` y `public/diplomas/` directamente en el servidor (o súbelos por un canal privado). No forman parte del repositorio público y no deben añadirse a Git.

Ejemplo de servicio con systemd:

```ini
[Unit]
Description=Portafolio de ciberseguridad
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/portfolio-seguridad
Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=3000
ExecStart=/usr/bin/node dist/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## Antes de publicar

1. Copia `site.local.example.json` a `site.local.json` y rellena tus datos reales.
2. Añade tus perfiles reales en `socials` (en `site.local.json`) o deja la lista vacía.
3. Publica tu primer laboratorio solo cuando lo hayas completado.
4. Añade certificaciones únicamente cuando las tengas y guarda los PDF en `public/diplomas/`.
5. Comprueba que `site.local.json` y `public/diplomas/` no aparecen en `git status`.
6. Revisa que ningún writeup incluya datos sensibles o sistemas de terceros.
7. Ajusta las áreas de práctica y la ruta de aprendizaje a lo que realmente estés estudiando.

## Licencia

Código: pendiente de definir. Contenido, marca e imágenes: todos los derechos reservados.

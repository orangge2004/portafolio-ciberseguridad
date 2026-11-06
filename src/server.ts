import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import expressLayouts from 'express-ejs-layouts';
import { site } from './config/site.js';

const app = express();

// Versión usada para invalidar el caché de CSS y JS en cada reinicio.
const assetVersion = Date.now().toString(36);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disable('x-powered-by');

// Cabeceras de seguridad para un sitio estático sin recursos de terceros.
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'self' mailto:; frame-ancestors 'none'",
  );
  next();
});

app.use((req, res, next) => {
  res.locals.site = site;
  res.locals.currentPath = req.path;
  res.locals.year = new Date().getFullYear();
  res.locals.assetVersion = assetVersion;
  next();
});

const isProduction = process.env.NODE_ENV === 'production';
app.use(express.static(path.join(__dirname, '../public'), { maxAge: isProduction ? '1h' : 0 }));

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

const rawPort = process.env.PORT ?? '3000';
const port = Number(rawPort);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`PORT inválido: ${rawPort}`);
}

const host = process.env.HOST ?? '127.0.0.1';

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'portfolio-seguridad',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req, res) => {
  res.status(200).render('home', {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  });
});

app.get('/sobre-mi', (_req, res) => {
  res.status(200).render('sobre-mi', {
    title: `Sobre mí — ${site.name}`,
    description:
      'Portafolio de aprendizaje sobre hacking ético, laboratorios y seguridad ofensiva.',
  });
});

app.get('/practicas', (_req, res) => {
  res.status(200).render('practicas', {
    title: `Áreas de práctica — ${site.name}`,
    description:
      'Áreas de práctica y aprendizaje: redes, Linux, seguridad web, reconocimiento, laboratorios y documentación.',
  });
});

app.get('/servicios', (_req, res) => {
  res.redirect(301, '/practicas');
});

app.get('/laboratorios', (_req, res) => {
  res.status(200).render('laboratorios', {
    title: `Laboratorios — ${site.name}`,
    description:
      'Ejercicios prácticos y writeups de laboratorios de ciberseguridad en entornos autorizados.',
  });
});

app.get('/proyectos', (_req, res) => {
  res.redirect(301, '/laboratorios');
});

app.get('/laboratorios/:slug', (req, res, next) => {
  const lab = site.projects.find((item) => item.slug === req.params.slug);

  if (!lab) {
    next();
    return;
  }

  res.status(200).render('laboratorio', {
    title: `${lab.title} — ${site.name}`,
    description: lab.summary,
    lab,
  });
});

app.get('/proyectos/:slug', (req, res) => {
  res.redirect(301, `/laboratorios/${req.params.slug}`);
});

app.get('/formacion', (_req, res) => {
  res.status(200).render('formacion', {
    title: `Formación — ${site.name}`,
    description:
      'Certificaciones completadas en Platzi, diplomas verificables y ruta de aprendizaje en ciberseguridad.',
  });
});

app.get('/certificaciones', (_req, res) => {
  res.redirect(301, '/formacion');
});

app.get('/contacto', (_req, res) => {
  res.status(200).render('contacto', {
    title: `Contacto — ${site.name}`,
    description:
      'Contacto para feedback, colaboraciones y recursos sobre ciberseguridad.',
  });
});

// 404
app.use((_req, res) => {
  res.status(404).render('404', {
    title: `Página no encontrada — ${site.name}`,
    description: 'La página que buscas no existe o ha cambiado de ubicación.',
  });
});

// Errores no controlados
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).render('500', {
    title: `Error interno — ${site.name}`,
    description: 'Ha ocurrido un error inesperado.',
  });
});

app.listen(port, host, () => {
  console.log(`Servidor en http://${host}:${port}`);
});

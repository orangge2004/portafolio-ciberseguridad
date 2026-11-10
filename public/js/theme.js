// Aplica el tema guardado antes de pintar la página (evita el parpadeo).
try {
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.dataset.theme = 'light';
  }
} catch {
  // Sin acceso a localStorage: se queda el tema oscuro por defecto.
}

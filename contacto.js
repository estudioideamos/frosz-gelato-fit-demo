const siteHeader = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-nav");
const menuButtonLabel = menuButton.querySelector(".sr-only");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const menuColors = ["#e97cac", "#f6d957", "#a9d8c1", "#d9bfdf", "#efaa46", "#87c9df"];
let menuColorIndex = 0;
let menuColorTimer;
let menuCloseTimer;

const syncStickyHeader = () => siteHeader.classList.toggle("is-sticky", window.scrollY > 32);
syncStickyHeader();
window.addEventListener("scroll", syncStickyHeader, { passive: true });

const stopMenuColors = () => window.clearInterval(menuColorTimer);
const rotateMenuColor = () => {
  menuColorIndex = (menuColorIndex + 1) % menuColors.length;
  mobileMenu.style.setProperty("--menu-bg", menuColors[menuColorIndex]);
};
const openMobileMenu = () => {
  window.clearTimeout(menuCloseTimer);
  mobileMenu.hidden = false;
  menuButton.setAttribute("aria-expanded", "true");
  menuButtonLabel.textContent = "Cerrar menu";
  siteHeader.classList.add("is-menu-open");
  document.body.classList.add("menu-open");
  mobileMenu.style.setProperty("--menu-bg", menuColors[menuColorIndex]);
  window.requestAnimationFrame(() => mobileMenu.classList.add("is-open"));
  if (!reduceMotion.matches) menuColorTimer = window.setInterval(rotateMenuColor, 1500);
};
const closeMobileMenu = ({ returnFocus = false } = {}) => {
  stopMenuColors();
  mobileMenu.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButtonLabel.textContent = "Abrir menu";
  siteHeader.classList.remove("is-menu-open");
  document.body.classList.remove("menu-open");
  window.clearTimeout(menuCloseTimer);
  menuCloseTimer = window.setTimeout(() => {
    if (menuButton.getAttribute("aria-expanded") === "false") mobileMenu.hidden = true;
    if (returnFocus) menuButton.focus();
  }, reduceMotion.matches ? 0 : 800);
};

menuButton.addEventListener("click", () => {
  if (menuButton.getAttribute("aria-expanded") === "true") closeMobileMenu();
  else openMobileMenu();
});
mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMobileMenu()));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") closeMobileMenu({ returnFocus: true });
});

const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }
  const data = new FormData(contactForm);
  const subject = `[Web Frosz] ${data.get("reason")}`;
  const body = [
    `Nombre: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Telefono: ${data.get("phone") || "No informado"}`,
    `Motivo: ${data.get("reason")}`,
    "",
    data.get("message")
  ].join("\n");
  contactStatus.textContent = "LISTO. ABRIMOS TU CORREO PARA ENVIAR EL MENSAJE.";
  window.location.href = `mailto:contacto@frosz.com.ar?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

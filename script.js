const flavors = {
  chocolate: { index: "01", name: "Chocolate", image: "flavor-chocolate.png", back: "CHOCO", front: "LATE", bg: "#e97cac", accent: "#f5b820", description: "Intenso, cremoso y listo para cambiarte el día." },
  banana: { index: "02", name: "Banana", image: "flavor-banana.png", back: "BANA", front: "NA", bg: "#f5c645", accent: "#e84884", description: "Dulce, suave y con energía de tarde soleada." },
  menta: { index: "03", name: "Menta granizada", image: "flavor-menta.png", back: "MENTA", front: "CRUNCH", bg: "#90d0b5", accent: "#33223e", description: "Fresca, filosa y con ese crunch que pide otra cucharada." },
  frutos: { index: "04", name: "Frutos del bosque", image: "flavor-frutos.png", back: "BERRY", front: "MOOD", bg: "#9d7ad2", accent: "#e84273", description: "Frutal, vibrante y apenas ácida. Un mood completo." },
  cafe: { index: "05", name: "Cafe moka", image: "flavor-cafe.png", back: "CAFE", front: "MOKA", bg: "#bd8f6a", accent: "#f4d9ad", description: "Café y chocolate en una pausa que rinde." },
  mani: { index: "06", name: "Crema de mani", image: "flavor-mani.png", back: "MANI", front: "POWER", bg: "#efaa46", accent: "#ec5668", description: "Cremosa, potente y peligrosamente cucharable." },
  coco: { index: "07", name: "Coco", image: "flavor-coco.png", back: "COCO", front: "FRESH", bg: "#87c9df", accent: "#f7f0df", description: "Liviano, tropical y listo para bajar un cambio." },
  ddl: { index: "08", name: "Dulce de leche", image: "flavor-ddl.png", back: "DULCE", front: "ARGENTO", bg: "#d49a66", accent: "#f7cf4d", description: "El clásico argentino, llevado a frecuencia fit." },
  frutilla: { index: "09", name: "Frutilla", image: "flavor-frutilla.png", back: "FRUTI", front: "LLA", bg: "#ed789b", accent: "#f7d856", description: "Frutal, cremosa y siempre de buen humor." }
};

const root = document.documentElement;
const siteHeader = document.querySelector(".site-header");
const flavorSection = document.querySelector(".flavor-lab");
const flavorImage = document.querySelector("#flavor-image");
const flavorName = document.querySelector("#flavor-name");
const flavorDescription = document.querySelector("#flavor-description");
const flavorIndex = document.querySelector("#flavor-index");
const flavorButtons = [...document.querySelectorAll(".flavor-tab")];
const flavorTabs = document.querySelector(".flavor-tabs");
const flavorControls = document.querySelector(".flavor-controls");
const flavorPrev = document.querySelector("#flavor-prev");
const flavorNext = document.querySelector("#flavor-next");
const flavorToggle = document.querySelector("#flavor-toggle");
const flavorColorWave = document.querySelector(".flavor-color-wave");
const ingredientBurst = document.querySelector("#ingredient-burst");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeFlavorIndex = 0;
let flavorTimer;
let flavorTransition;
let userPaused = false;
let interactionPaused = false;
let colorWaveTimer;
let enterTimer;

const syncStickyHeader = () => {
  siteHeader.classList.toggle("is-sticky", window.scrollY > 32);
};

syncStickyHeader();
window.addEventListener("scroll", syncStickyHeader, { passive: true });

const circularDistance = (index, active) => {
  let distance = index - active;
  const half = flavorButtons.length / 2;
  if (distance > half) distance -= flavorButtons.length;
  if (distance < -half) distance += flavorButtons.length;
  return distance;
};

const positionFlavorWheel = () => {
  flavorButtons.forEach((button, index) => {
    button.dataset.slot = String(circularDistance(index, activeFlavorIndex));
  });
};

const stopAutoplay = () => window.clearTimeout(flavorTimer);

const scheduleAutoplay = () => {
  stopAutoplay();
  if (userPaused || interactionPaused || reduceMotion.matches || document.hidden) return;
  flavorTimer = window.setTimeout(() => activateFlavor(activeFlavorIndex + 1), 4400);
};

const activateFlavor = (requestedIndex, { manual = false } = {}) => {
  const nextIndex = (requestedIndex + flavorButtons.length) % flavorButtons.length;
  if (nextIndex === activeFlavorIndex) {
    if (manual) scheduleAutoplay();
    return;
  }

  const button = flavorButtons[nextIndex];
  const flavor = flavors[button.dataset.key];
  if (!flavor) return;

  const sectionRect = flavorSection.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  const waveX = buttonRect.width ? buttonRect.left + buttonRect.width / 2 - sectionRect.left : sectionRect.width * .84;
  const waveY = buttonRect.height ? buttonRect.top + buttonRect.height / 2 - sectionRect.top : sectionRect.height * .66;
  flavorSection.style.setProperty("--wave-x", `${waveX}px`);
  flavorSection.style.setProperty("--wave-y", `${waveY}px`);
  flavorSection.style.setProperty("--wave-color", flavor.bg);
  flavorSection.classList.remove("is-color-expanding");
  void flavorColorWave.offsetWidth;
  flavorSection.classList.add("is-color-expanding");

  activeFlavorIndex = nextIndex;

  flavorButtons.forEach((item) => {
    const isActive = item === button;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  positionFlavorWheel();
  flavorSection.classList.remove("is-entering");
  flavorSection.classList.add("is-switching");
  window.clearTimeout(flavorTransition);

  flavorTransition = window.setTimeout(() => {
    flavorSection.style.setProperty("--flavor-accent", flavor.accent);
    flavorSection.dataset.flavor = button.dataset.key;
    flavorImage.src = `./public/assets/web/${flavor.image}`;
    flavorImage.alt = `Pote Frosz sabor ${flavor.name}`;
    flavorName.textContent = flavor.name;
    flavorDescription.textContent = flavor.description;
    flavorIndex.textContent = flavor.index;
    flavorSection.classList.remove("is-switching");
    flavorSection.classList.add("is-entering");
    flavorSection.classList.remove("is-bursting");
    void ingredientBurst.offsetWidth;
    flavorSection.classList.add("is-bursting");
    window.clearTimeout(enterTimer);
    enterTimer = window.setTimeout(() => flavorSection.classList.remove("is-entering"), 1220);
  }, 460);

  window.clearTimeout(colorWaveTimer);
  colorWaveTimer = window.setTimeout(() => {
    flavorSection.style.setProperty("--flavor-bg", flavor.bg);
    flavorSection.classList.remove("is-color-expanding");
  }, 1720);

  if (manual) button.blur();
  scheduleAutoplay();
};

flavorButtons.forEach((button, index) => {
  button.addEventListener("click", () => activateFlavor(index, { manual: true }));
});

flavorPrev.addEventListener("click", () => activateFlavor(activeFlavorIndex - 1, { manual: true }));
flavorNext.addEventListener("click", () => activateFlavor(activeFlavorIndex + 1, { manual: true }));
flavorToggle.addEventListener("click", () => {
  userPaused = !userPaused;
  flavorToggle.textContent = userPaused ? "SEGUIR" : "PAUSA";
  flavorToggle.setAttribute("aria-label", userPaused ? "Reanudar autoplay" : "Pausar autoplay");
  flavorToggle.setAttribute("aria-pressed", String(userPaused));
  scheduleAutoplay();
});

[flavorTabs, flavorControls].forEach((element) => {
  element.addEventListener("pointerenter", () => {
    interactionPaused = true;
    stopAutoplay();
  });
  element.addEventListener("pointerleave", () => {
    interactionPaused = false;
    scheduleAutoplay();
  });
  element.addEventListener("focusin", () => {
    interactionPaused = true;
    stopAutoplay();
  });
  element.addEventListener("focusout", () => {
    interactionPaused = false;
    scheduleAutoplay();
  });
});

document.addEventListener("visibilitychange", scheduleAutoplay);
reduceMotion.addEventListener?.("change", scheduleAutoplay);
positionFlavorWheel();
scheduleAutoplay();

const showcaseFlavors = [
  { key: "chocolate", name: "CHOCOLATE", tagline: "UN CLASICO QUE ENTRENA TODOS LOS DIAS", description: "CACAO INTENSO, TEXTURA CREMOSA Y TODO EL PLACER DE UNA CUCHARADA QUE VA AL FRENTE.", top: "CHOCO", bottom: "LATE", note: "PROFUNDO, CREMOSO Y CON FINAL BIEN CHOCOLATOSO.", ingredient: "showcase-chocolate.jpg", pot: "flavor-chocolate.png", bg: "#f4b5c7", ink: "#f41624" },
  { key: "banana", name: "BANANA", tagline: "DULCE, SUAVE Y CON ENERGIA DE TARDE SOLEADA", description: "BANANA MADURA, TEXTURA SEDOSA Y UN PERFIL DULCE QUE SE SIENTE LIVIANO HASTA LA ULTIMA CUCHARADA.", top: "BANA", bottom: "NA", note: "CREMOSO, DORADO Y LISTO PARA LEVANTARTE EL DIA.", ingredient: "showcase-banana.jpg", pot: "flavor-banana.png", bg: "#f6d957", ink: "#ef4c35" },
  { key: "menta", name: "MENTA GRANIZADA", tagline: "FRESCURA CON UN CRUNCH QUE NO NEGOCIA", description: "MENTA LIMPIA, CHOCOLATE INTENSO Y UNA TEXTURA QUE ARRANCA FRESCA Y TERMINA BIEN ARRIBA.", top: "MENTA", bottom: "CRUNCH", note: "FRESCA, FILOSA Y CON CHOCOLATE EN CADA VUELTA.", ingredient: "showcase-menta.jpg", pot: "flavor-menta.png", bg: "#a9d8c1", ink: "#27223b" },
  { key: "frutos", name: "FRUTOS DEL BOSQUE", tagline: "UN MOOD FRUTAL CON PULSO PROPIO", description: "MORAS, FRAMBUESAS Y ARANDANOS EN UNA MEZCLA VIBRANTE, CREMOSA Y CON EL PUNTO JUSTO DE ACIDEZ.", top: "BERRY", bottom: "MOOD", note: "FRUTAL, INTENSO Y CON UNA ACIDEZ QUE DESPIERTA.", ingredient: "showcase-frutos.jpg", pot: "flavor-frutos.png", bg: "#d9bfdf", ink: "#8c245f" },
  { key: "cafe", name: "CAFE MOKA", tagline: "LA PAUSA QUE TE VUELVE A PONER EN MOVIMIENTO", description: "CAFE TOSTADO, CACAO Y CREMOSIDAD EN UNA COMBINACION PROFUNDA QUE RINDE A CUALQUIER HORA.", top: "CAFE", bottom: "MOKA", note: "AROMA TOSTADO, CACAO Y UNA PAUSA QUE RINDE.", ingredient: "showcase-cafe.jpg", pot: "flavor-cafe.png", bg: "#d7b087", ink: "#5a2e20" },
  { key: "mani", name: "CREMA DE MANI", tagline: "POTENCIA CREMOSA EN MODO CUCHARA", description: "MANI TOSTADO, CUERPO INTENSO Y UNA CREMOSIDAD QUE CONVIERTE CADA BOCADO EN PLAN FAVORITO.", top: "MANI", bottom: "POWER", note: "TOSTADO, POTENTE Y PELIGROSAMENTE CUCHARABLE.", ingredient: "showcase-mani.jpg", pot: "flavor-mani.png", bg: "#f3ad4b", ink: "#a92832" },
  { key: "coco", name: "COCO", tagline: "UN VIAJE TROPICAL SIN SALIR DE TU RITMO", description: "COCO FRESCO, TEXTURA LIVIANA Y UNA CREMOSIDAD SUAVE PARA BAJAR UN CAMBIO SIN BAJAR EL SABOR.", top: "COCO", bottom: "FRESH", note: "LIVIANO, TROPICAL Y MUY DIFICIL DE SOLTAR.", ingredient: "showcase-coco.jpg", pot: "flavor-coco.png", bg: "#a8d9e6", ink: "#175b73" },
  { key: "ddl", name: "DULCE DE LECHE", tagline: "EL CLASICO ARGENTINO CAMBIO DE FRECUENCIA", description: "DULCE DE LECHE PROFUNDO, TEXTURA ARTESANAL Y ESE SABOR DE SIEMPRE LLEVADO A SU VERSION FIT.", top: "DULCE", bottom: "ARGENTO", note: "BIEN NUESTRO, BIEN CREMOSO Y SIN DAR VUELTAS.", ingredient: "showcase-ddl.jpg", pot: "flavor-ddl.png", bg: "#dfb17f", ink: "#783b21" },
  { key: "frutilla", name: "FRUTILLA", tagline: "COLOR ARRIBA, CUCHARA LISTA", description: "FRUTILLAS MADURAS, PERFIL FRESCO Y UNA TEXTURA ROSA, CREMOSA Y ALEGRE DESDE EL PRIMER BOCADO.", top: "FRUTI", bottom: "LLA", note: "FRUTAL, CREMOSA Y SIEMPRE DE BUEN HUMOR.", ingredient: "showcase-frutilla.jpg", pot: "flavor-frutilla.png", bg: "#f4b5c7", ink: "#f41624" }
];

showcaseFlavors.forEach(({ ingredient, pot }) => {
  [ingredient, pot].forEach((asset) => {
    const preload = new Image();
    preload.src = `./public/assets/web/${asset}`;
  });
});

const showcaseSection = document.querySelector(".product-showcase");
const showcaseFlavorName = document.querySelector("#showcase-flavor-name");
const showcaseTagline = document.querySelector("#showcase-tagline");
const showcaseDescription = document.querySelector("#showcase-description");
const showcaseWordTop = document.querySelector("#showcase-word-top");
const showcaseWordBottom = document.querySelector("#showcase-word-bottom");
const showcaseIngredient = document.querySelector("#showcase-ingredient");
const showcasePot = document.querySelector("#showcase-pot");
const showcasePeekPrev = document.querySelector("#showcase-peek-prev");
const showcasePeekNext = document.querySelector("#showcase-peek-next");
const showcaseNote = document.querySelector("#showcase-note");
const showcaseIndex = document.querySelector("#showcase-index");
const showcaseDots = document.querySelector("#showcase-dots");
const showcasePrev = document.querySelector("#showcase-prev");
const showcaseNext = document.querySelector("#showcase-next");
let showcaseActiveIndex = 0;
let showcaseTimer;
let showcaseTransitionTimer;
let showcaseWaveTimer;
let showcaseVisible = false;
let showcaseInteractionPaused = false;
let showcaseLocked = false;
let showcasePointerStart = 0;

const wrapShowcaseIndex = (index) => (index + showcaseFlavors.length) % showcaseFlavors.length;

showcaseFlavors.forEach((flavor, index) => {
  const dot = document.createElement("button");
  dot.className = `showcase-dot${index === 0 ? " is-active" : ""}`;
  dot.type = "button";
  dot.setAttribute("role", "listitem");
  dot.setAttribute("aria-label", `Ver sabor ${flavor.name}`);
  dot.setAttribute("aria-pressed", String(index === 0));
  dot.addEventListener("click", () => {
    const directDistance = index - showcaseActiveIndex;
    const direction = Math.abs(directDistance) > showcaseFlavors.length / 2 ? -Math.sign(directDistance) : Math.sign(directDistance);
    activateShowcase(index, { direction: direction || 1, manual: true });
  });
  showcaseDots.append(dot);
});

const renderShowcase = (index, { commitBackground = true } = {}) => {
  const flavor = showcaseFlavors[index];
  const previous = showcaseFlavors[wrapShowcaseIndex(index - 1)];
  const next = showcaseFlavors[wrapShowcaseIndex(index + 1)];
  showcaseSection.dataset.showcaseFlavor = flavor.key;
  if (commitBackground) showcaseSection.style.setProperty("--showcase-bg", flavor.bg);
  showcaseSection.style.setProperty("--showcase-ink", flavor.ink);
  showcaseFlavorName.textContent = flavor.name;
  showcaseTagline.textContent = flavor.tagline;
  showcaseDescription.textContent = flavor.description;
  showcaseWordTop.textContent = flavor.top;
  showcaseWordBottom.textContent = flavor.bottom;
  showcaseIngredient.src = `./public/assets/web/${flavor.ingredient}`;
  showcaseIngredient.alt = `Ingredientes del sabor ${flavor.name}`;
  showcasePot.src = `./public/assets/web/${flavor.pot}`;
  showcasePot.alt = `Pote Frosz sabor ${flavor.name}`;
  showcasePeekPrev.src = `./public/assets/web/${previous.ingredient}`;
  showcasePeekNext.src = `./public/assets/web/${next.ingredient}`;
  showcaseNote.textContent = flavor.note;
  showcaseIndex.textContent = String(index + 1).padStart(2, "0");
  [...showcaseDots.children].forEach((dot, dotIndex) => {
    const active = dotIndex === index;
    dot.classList.toggle("is-active", active);
    dot.setAttribute("aria-pressed", String(active));
  });
};

const stopShowcaseAutoplay = () => window.clearTimeout(showcaseTimer);

const scheduleShowcaseAutoplay = () => {
  stopShowcaseAutoplay();
  if (!showcaseVisible || showcaseInteractionPaused || showcaseLocked || reduceMotion.matches || document.hidden) return;
  showcaseTimer = window.setTimeout(() => activateShowcase(showcaseActiveIndex + 1), 5200);
};

function activateShowcase(requestedIndex, { direction = 1, manual = false } = {}) {
  const nextIndex = wrapShowcaseIndex(requestedIndex);
  if (showcaseLocked || nextIndex === showcaseActiveIndex) {
    if (manual) scheduleShowcaseAutoplay();
    return;
  }

  const nextFlavor = showcaseFlavors[nextIndex];
  showcaseLocked = true;
  stopShowcaseAutoplay();
  showcaseSection.style.setProperty("--showcase-next-bg", nextFlavor.bg);
  showcaseSection.classList.remove("is-entering", "is-wave-forward", "is-wave-backward", "is-backward");
  if (direction < 0) showcaseSection.classList.add("is-backward");
  void showcaseSection.offsetWidth;
  showcaseSection.classList.add("is-leaving", direction < 0 ? "is-wave-backward" : "is-wave-forward");

  window.clearTimeout(showcaseTransitionTimer);
  showcaseTransitionTimer = window.setTimeout(() => {
    showcaseActiveIndex = nextIndex;
    renderShowcase(showcaseActiveIndex, { commitBackground: false });
    showcaseSection.classList.remove("is-leaving");
    showcaseSection.classList.add("is-entering");
  }, 500);

  window.clearTimeout(showcaseWaveTimer);
  showcaseWaveTimer = window.setTimeout(() => {
    showcaseSection.style.setProperty("--showcase-bg", nextFlavor.bg);
    showcaseSection.classList.remove("is-entering", "is-wave-forward", "is-wave-backward", "is-backward");
    showcaseLocked = false;
    scheduleShowcaseAutoplay();
  }, 1280);
}

showcasePrev.addEventListener("click", () => activateShowcase(showcaseActiveIndex - 1, { direction: -1, manual: true }));
showcaseNext.addEventListener("click", () => activateShowcase(showcaseActiveIndex + 1, { direction: 1, manual: true }));

[showcasePrev, showcaseNext, showcaseDots].forEach((element) => {
  element.addEventListener("pointerenter", () => { showcaseInteractionPaused = true; stopShowcaseAutoplay(); });
  element.addEventListener("pointerleave", () => { showcaseInteractionPaused = false; scheduleShowcaseAutoplay(); });
  element.addEventListener("focusin", () => { showcaseInteractionPaused = true; stopShowcaseAutoplay(); });
  element.addEventListener("focusout", () => { showcaseInteractionPaused = false; scheduleShowcaseAutoplay(); });
});

showcaseSection.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") activateShowcase(showcaseActiveIndex - 1, { direction: -1, manual: true });
  if (event.key === "ArrowRight") activateShowcase(showcaseActiveIndex + 1, { direction: 1, manual: true });
});
showcaseSection.addEventListener("pointerdown", (event) => { showcasePointerStart = event.clientX; });
showcaseSection.addEventListener("pointerup", (event) => {
  const delta = event.clientX - showcasePointerStart;
  if (Math.abs(delta) < 55) return;
  activateShowcase(showcaseActiveIndex + (delta < 0 ? 1 : -1), { direction: delta < 0 ? 1 : -1, manual: true });
});

const showcaseObserver = new IntersectionObserver(([entry]) => {
  showcaseVisible = entry.isIntersecting;
  scheduleShowcaseAutoplay();
}, { threshold: .28 });
showcaseObserver.observe(showcaseSection);
document.addEventListener("visibilitychange", scheduleShowcaseAutoplay);
reduceMotion.addEventListener?.("change", scheduleShowcaseAutoplay);

const aboutSlides = [
  { image: "about-frosz.png", alt: "Pote Frosz de chocolate entre elementos de heladería artesanal y entrenamiento" },
  { image: "campaign-hero.png", alt: "Pote Frosz en una campaña visual rosa y amarilla" }
];
const aboutStage = document.querySelector(".about-stage");
const aboutImage = document.querySelector(".about-image");
let aboutSlideIndex = 0;

document.querySelectorAll(".about-arrow").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.classList.contains("about-arrow-next") ? 1 : -1;
    aboutSlideIndex = (aboutSlideIndex + direction + aboutSlides.length) % aboutSlides.length;
    aboutStage.classList.add("is-switching");
    window.setTimeout(() => {
      const slide = aboutSlides[aboutSlideIndex];
      aboutImage.src = `./public/assets/web/${slide.image}`;
      aboutImage.alt = slide.alt;
      aboutStage.classList.remove("is-switching");
    }, 240);
  });
});

document.querySelectorAll(".store-filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".store-filter.is-active")?.classList.remove("is-active");
    button.classList.add("is-active");
    const zone = button.dataset.zone;
    document.querySelectorAll(".store-card").forEach((card) => {
      card.hidden = zone !== "all" && card.dataset.zone !== zone;
    });
  });
});

const newsletterForm = document.querySelector("#newsletter-form");
const newsletterEmail = document.querySelector("#newsletter-email");
const newsletterStatus = document.querySelector("#newsletter-status");

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!newsletterEmail.checkValidity()) {
    newsletterEmail.reportValidity();
    return;
  }

  newsletterForm.classList.add("is-sent");
  newsletterStatus.textContent = "LISTO. YA ESTAS EN LA FRECUENCIA.";
  newsletterEmail.value = "";
});

newsletterEmail.addEventListener("input", () => {
  newsletterForm.classList.remove("is-sent");
  newsletterStatus.textContent = "";
});

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-nav");
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu.hidden = isOpen;
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

window.addEventListener("pointermove", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  root.style.setProperty("--mouse-x", `${event.clientX}px`);
  root.style.setProperty("--mouse-y", `${event.clientY}px`);
});

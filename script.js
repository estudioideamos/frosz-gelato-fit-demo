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
  }, 980);

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

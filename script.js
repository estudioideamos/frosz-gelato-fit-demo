const flavors = {
  chocolate: { index: "01", name: "Chocolate", image: "CHOCOLATE.jpg", back: "CHOCO", front: "LATE", bg: "#e97cac", accent: "#f5b820", description: "Intenso, cremoso y listo para cambiarte el día." },
  banana: { index: "02", name: "Banana", image: "BANANA.jpg", back: "BANA", front: "NA", bg: "#f5c645", accent: "#e84884", description: "Dulce, suave y con energía de tarde soleada." },
  menta: { index: "03", name: "Menta granizada", image: "MENTA.jpg", back: "MENTA", front: "CRUNCH", bg: "#90d0b5", accent: "#33223e", description: "Fresca, filosa y con ese crunch que pide otra cucharada." },
  frutos: { index: "04", name: "Frutos del bosque", image: "FRUTOS.jpg", back: "BERRY", front: "MOOD", bg: "#9d7ad2", accent: "#e84273", description: "Frutal, vibrante y apenas ácida. Un mood completo." },
  cafe: { index: "05", name: "Café moka", image: "Z-CAFE.jpg", back: "CAFÉ", front: "MOKA", bg: "#bd8f6a", accent: "#f4d9ad", description: "Café y chocolate en una pausa que rinde." },
  mani: { index: "06", name: "Crema de maní", image: "Z-MANI.jpg", back: "MANÍ", front: "POWER", bg: "#efaa46", accent: "#ec5668", description: "Cremosa, potente y peligrosamente cucharable." },
  coco: { index: "07", name: "Coco", image: "COCO.jpg", back: "COCO", front: "FRESH", bg: "#87c9df", accent: "#f7f0df", description: "Liviano, tropical y listo para bajar un cambio." },
  ddl: { index: "08", name: "Dulce de leche", image: "DULCE-DE-LECHE.jpg", back: "DULCE", front: "ARGENTO", bg: "#d49a66", accent: "#f7cf4d", description: "El clásico argentino, llevado a frecuencia fit." },
  frutilla: { index: "09", name: "Frutilla", image: "FRUTILLA.jpg", back: "FRUTI", front: "LLA", bg: "#ed789b", accent: "#f7d856", description: "Frutal, cremosa y siempre de buen humor." }
};

const root = document.documentElement;
const flavorSection = document.querySelector(".flavor-lab");
const flavorImageWrap = document.querySelector(".flavor-image-wrap");
const flavorImage = document.querySelector("#flavor-image");
const flavorName = document.querySelector("#flavor-name");
const flavorDescription = document.querySelector("#flavor-description");
const flavorIndex = document.querySelector("#flavor-index");
const flavorWordBack = document.querySelector("#flavor-word-back");
const flavorWordFront = document.querySelector("#flavor-word-front");

document.querySelectorAll(".flavor-tab").forEach((button) => {
  button.addEventListener("click", () => {
    const flavor = flavors[button.dataset.key];
    if (!flavor || button.classList.contains("is-active")) return;

    document.querySelector(".flavor-tab.is-active")?.classList.remove("is-active");
    button.classList.add("is-active");
    flavorImageWrap.classList.add("is-changing");

    window.setTimeout(() => {
      flavorSection.style.setProperty("--flavor-bg", flavor.bg);
      flavorSection.style.setProperty("--flavor-accent", flavor.accent);
      flavorSection.dataset.flavor = button.dataset.key;
      flavorImage.src = `./public/assets/web/${flavor.image}`;
      flavorImage.alt = `Pote Frosz sabor ${flavor.name}`;
      flavorName.textContent = flavor.name;
      flavorDescription.textContent = flavor.description;
      flavorIndex.textContent = flavor.index;
      flavorWordBack.textContent = flavor.back;
      flavorWordFront.textContent = flavor.front;
      flavorImageWrap.classList.remove("is-changing");
    }, 260);
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

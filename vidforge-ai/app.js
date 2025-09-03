// ---------- Theme handling ----------
const root = document.documentElement;
const THEME_KEY = "vidforge-theme";

function applyStoredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light") {
    root.classList.add("light");
  } else if (saved === "dark") {
    root.classList.remove("light");
  } else {
    // auto (default) -> prefers-color-scheme respected by CSS defaults
  }
}

function toggleTheme() {
  const isLight = root.classList.toggle("light");
  localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
}

applyStoredTheme();

document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
document.getElementById("themeToggleMobile")?.addEventListener("click", toggleTheme);

// ---------- Mobile nav ----------
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");

navToggle?.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  if (mobileMenu) {
    if (mobileMenu.hasAttribute("hidden")) {
      mobileMenu.removeAttribute("hidden");
    } else {
      mobileMenu.setAttribute("hidden", "");
    }
  }
});

mobileMenu?.addEventListener("click", (e) => {
  const t = e.target;
  if (t instanceof Element && t.hasAttribute("data-close")) {
    navToggle?.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("hidden", "");
  }
});

// ---------- Hero CTA ----------
document.getElementById("ctaStart")?.addEventListener("click", () => {
  // Just a smooth scroll UX
  // (No special logic; real app would initialize a project)
});

// ---------- Modal preview ----------
const previewModal = document.getElementById("previewModal");
const openPreviewBtn = document.getElementById("openPreview");
const focusableSelector = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
let lastFocused = null;

function openModal() {
  if (!previewModal) return;
  lastFocused = document.activeElement;
  previewModal.setAttribute("open", "");
  previewModal.setAttribute("aria-hidden", "false");
  // trap focus
  const fEls = previewModal.querySelectorAll(focusableSelector);
  fEls[0]?.focus();
  document.addEventListener("keydown", onEscClose);
}

function closeModal() {
  if (!previewModal) return;
  previewModal.removeAttribute("open");
  previewModal.setAttribute("aria-hidden", "true");
  document.removeEventListener("keydown", onEscClose);
  if (lastFocused && lastFocused instanceof HTMLElement) lastFocused.focus();
}

function onEscClose(e) {
  if (e.key === "Escape") closeModal();
}

openPreviewBtn?.addEventListener("click", openModal);
previewModal?.addEventListener("click", (e) => {
  const t = e.target;
  if (t instanceof Element && t.hasAttribute("data-close")) closeModal();
});

// Template card "Preview" buttons also open modal
document.querySelectorAll("[data-preview]").forEach(btn => {
  btn.addEventListener("click", openModal);
});

// ---------- Template filtering ----------
const templateFilter = document.getElementById("templateFilter");
const templateGrid = document.getElementById("templateGrid");

function filterTemplates(val) {
  if (!templateGrid) return;
  const cards = Array.from(templateGrid.querySelectorAll(".tcard"));
  cards.forEach(card => {
    const type = card.getAttribute("data-type");
    const show = val === "all" || val === type;
    card.style.display = show ? "" : "none";
  });
}

templateFilter?.addEventListener("change", (e) => {
  filterTemplates(e.target.value);
});

// Also: clicking "Use Template" scrolls to signup with a hint
document.querySelectorAll("[data-use]").forEach(btn => {
  btn.addEventListener("click", () => {
    const form = document.getElementById("signupForm");
    form?.scrollIntoView({ behavior: "smooth", block: "start" });
    const status = document.getElementById("formStatus");
    if (status) {
      status.textContent = "Template selected — tell us your use case and we'll tailor your workspace.";
      setTimeout(() => status.textContent = "", 4000);
    }
  });
});

// ---------- Pricing toggle (Monthly/Annual) ----------
const billingToggle = document.getElementById("billingToggle");

function updatePrices(annual) {
  document.querySelectorAll("[data-price]").forEach(el => {
    const price = annual ? el.getAttribute("data-annual") : el.getAttribute("data-monthly");
    el.textContent = `$${price}`;
  });
}
billingToggle?.addEventListener("change", (e) => {
  updatePrices(e.target.checked);
});

// Initialize default prices (monthly)
updatePrices(false);

// ---------- Form handling ----------
const form = document.getElementById("signupForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const usecase = (formData.get("usecase") || "").toString().trim();

  const status = document.getElementById("formStatus");
  if (!name || !email || !usecase) {
    if (status) status.textContent = "Please fill in name, email, and use case.";
    return;
  }

  // Simulate success (replace with real API call)
  if (status) {
    status.textContent = "Thanks! You’re on the waitlist. We’ll be in touch soon.";
  }
  form.reset();
  setTimeout(() => status && (status.textContent = ""), 5000);
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear().toString();

// ---------- Small polish ----------
window.addEventListener("load", () => {
  // If user prefers reduced motion, skip potential animations (not included but place for hooks)
});

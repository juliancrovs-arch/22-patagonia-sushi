/* =========================================================================
   22 PATAGONIA SUSHI — Admin JS
   PIN por defecto: 2222  (cambiarlo acá abajo)
   ========================================================================= */
const ADMIN_PIN = "2222";

/* ---- lock / unlock ---- */
const lockEl    = document.getElementById("lock");
const adminEl   = document.getElementById("admin");
const pinInput  = document.getElementById("pin-input");
const pinError  = document.getElementById("pin-error");
const unlockBtn = document.getElementById("unlock-btn");

function tryUnlock() {
  if (pinInput.value === ADMIN_PIN) {
    lockEl.style.display = "none";
    adminEl.style.display = "block";
    buildAdmin();
  } else {
    pinError.classList.add("show");
    pinInput.value = "";
    pinInput.focus();
    setTimeout(() => pinError.classList.remove("show"), 2000);
  }
}
unlockBtn.addEventListener("click", tryUnlock);
pinInput.addEventListener("keydown", (e) => { if (e.key === "Enter") tryUnlock(); });

/* ---- cargar datos guardados ---- */
function loadMenu() {
  try {
    const s = localStorage.getItem("22ps_menu");
    if (s) {
      const d = JSON.parse(s);
      if (Array.isArray(d) && d.length) return d;
    }
  } catch {}
  return JSON.parse(JSON.stringify(window.MENU)); // copia fresca del JS estático
}

const TAG_OPTIONS = [
  { value: "",       label: "Sin etiqueta" },
  { value: "pop",    label: "Más pedido" },
  { value: "new",    label: "Nuevo" },
  { value: "chef",   label: "Chef recomienda" },
  { value: "veggie", label: "Veggie" },
];

/* ---- construir UI ---- */
let currentMenu = [];

function buildAdmin() {
  currentMenu = loadMenu();
  const grid = document.getElementById("dish-grid");
  grid.innerHTML = "";

  currentMenu.forEach((cat, ci) => {
    // Cabecera de categoría
    const catHead = document.createElement("p");
    catHead.style.cssText = "font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);padding:8px 0 2px;margin-top:8px;";
    catHead.textContent = cat.name.toUpperCase();
    grid.appendChild(catHead);

    cat.items.forEach((item, ii) => {
      const card = document.createElement("div");
      card.className = "dish-card";

      const img = document.createElement("div");
      img.className = "dish-card__img";
      if (item.img) img.innerHTML = `<img src="${item.img}" alt="${item.name}" loading="lazy" />`;
      card.appendChild(img);

      const body = document.createElement("div");
      body.className = "dish-card__body";

      // Nombre
      const nameEl = document.createElement("span");
      nameEl.className = "dish-card__name";
      nameEl.textContent = item.name;
      body.appendChild(nameEl);

      // Precio
      const priceRow = document.createElement("div");
      priceRow.className = "dish-card__row";
      priceRow.innerHTML = `<span class="dish-card__label">Precio $</span>`;
      const priceInput = document.createElement("input");
      priceInput.type = "number";
      priceInput.className = "dish-input price-input";
      priceInput.placeholder = "0";
      priceInput.value = item.price || "";
      priceInput.min = "0";
      priceInput.step = "100";
      priceInput.dataset.ci = ci; priceInput.dataset.ii = ii; priceInput.dataset.field = "price";
      priceRow.appendChild(priceInput);
      body.appendChild(priceRow);

      // Descripción
      const descRow = document.createElement("div");
      descRow.className = "dish-card__row";
      descRow.style.alignItems = "flex-start";
      descRow.innerHTML = `<span class="dish-card__label" style="padding-top:9px">Desc</span>`;
      const descInput = document.createElement("textarea");
      descInput.className = "dish-input";
      descInput.rows = 2;
      descInput.style.resize = "vertical";
      descInput.value = item.desc || "";
      descInput.dataset.ci = ci; descInput.dataset.ii = ii; descInput.dataset.field = "desc";
      descRow.appendChild(descInput);
      body.appendChild(descRow);

      // Tag
      const tagRow = document.createElement("div");
      tagRow.className = "dish-card__row";
      tagRow.innerHTML = `<span class="dish-card__label">Tag</span>`;
      const tagSel = document.createElement("select");
      tagSel.className = "tag-select";
      TAG_OPTIONS.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt.value; o.textContent = opt.label;
        if ((item.tag || "") === opt.value) o.selected = true;
        tagSel.appendChild(o);
      });
      tagSel.dataset.ci = ci; tagSel.dataset.ii = ii; tagSel.dataset.field = "tag";
      tagRow.appendChild(tagSel);
      body.appendChild(tagRow);

      card.appendChild(body);
      grid.appendChild(card);
    });
  });

  // Event delegation
  grid.addEventListener("input", (e) => {
    const el = e.target;
    const { ci, ii, field } = el.dataset;
    if (ci === undefined || ii === undefined || !field) return;
    const val = field === "price" ? (parseInt(el.value) || 0) : el.value;
    currentMenu[+ci].items[+ii][field] = val;
  });
}

/* ---- guardar ---- */
document.getElementById("btn-save").addEventListener("click", () => {
  localStorage.setItem("22ps_menu", JSON.stringify(currentMenu));
  showToast("✓ Cambios guardados en este dispositivo");
});

/* ---- exportar menu-data.js ---- */
document.getElementById("btn-export").addEventListener("click", () => {
  const lines = [];
  lines.push("/* 22 PATAGONIA SUSHI — menu-data.js · generado " + new Date().toLocaleDateString("es-AR") + " */");
  lines.push("window.RESTAURANT = " + JSON.stringify(window.RESTAURANT, null, 2) + ";\n");
  lines.push("window.MENU = " + JSON.stringify(currentMenu, null, 2) + ";");
  const blob = new Blob([lines.join("\n")], { type: "application/javascript" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "menu-data.js";
  a.click();
  showToast("✓ Archivo descargado — copialo al proyecto y hacé git push");
});

/* ---- toast ---- */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3200);
}

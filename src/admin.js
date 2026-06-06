/* =========================================================================
   22 PATAGONIA SUSHI — Admin JS v2
   PIN: 2222
   ========================================================================= */
const ADMIN_PIN = "2222";

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

/* ---- cargar datos ---- */
function loadMenu() {
  try {
    const s = localStorage.getItem("22ps_menu");
    if (s) { const d = JSON.parse(s); if (Array.isArray(d) && d.length) return d; }
  } catch {}
  return JSON.parse(JSON.stringify(window.MENU));
}

const TAG_OPTIONS = [
  { value: "",       label: "Sin etiqueta" },
  { value: "pop",    label: "Más pedido" },
  { value: "new",    label: "Nuevo" },
  { value: "chef",   label: "Chef recomienda" },
  { value: "veggie", label: "Veggie" },
];

let currentMenu = [];

/* ---- construir UI ---- */
function buildAdmin() {
  currentMenu = loadMenu();
  const grid = document.getElementById("dish-grid");
  grid.innerHTML = "";

  currentMenu.forEach((cat, ci) => {
    // Cabecera categoría
    const catHead = document.createElement("div");
    catHead.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:12px 0 4px;margin-top:8px;";
    catHead.innerHTML = `
      <p style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin:0">${cat.name.toUpperCase()}</p>
      <button class="btn-add-dish" data-ci="${ci}" style="font-size:11px;padding:5px 12px;background:var(--red);color:#fff;border:none;border-radius:6px;cursor:pointer;letter-spacing:1px;">+ AGREGAR PLATO</button>
    `;
    grid.appendChild(catHead);

    cat.items.forEach((item, ii) => {
      grid.appendChild(buildDishCard(item, ci, ii));
    });
  });

  // Botón agregar categoría
  const addCatDiv = document.createElement("div");
  addCatDiv.style.cssText = "margin-top:20px;padding-top:16px;border-top:1px solid var(--hair-2);";
  addCatDiv.innerHTML = `<button id="btn-add-cat" style="font-size:11px;padding:6px 14px;background:transparent;color:var(--muted);border:1px solid var(--hair-2);border-radius:6px;cursor:pointer;letter-spacing:1px;">+ NUEVA CATEGORÍA</button>`;
  grid.appendChild(addCatDiv);

  // Eventos agregar plato
  grid.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-add-dish")) {
      const ci = +e.target.dataset.ci;
      addDish(ci);
    }
    if (e.target.id === "btn-add-cat") {
      addCategory();
    }
    if (e.target.classList.contains("btn-delete-dish")) {
      const ci = +e.target.dataset.ci;
      const ii = +e.target.dataset.ii;
      deleteDish(ci, ii);
    }
    if (e.target.classList.contains("btn-change-foto")) {
      const ci = +e.target.dataset.ci;
      const ii = +e.target.dataset.ii;
      openFotoPicker(ci, ii, e.target);
    }
  });

  // Input eventos
  grid.addEventListener("input", (e) => {
    const el = e.target;
    const { ci, ii, field } = el.dataset;
    if (ci === undefined || ii === undefined || !field) return;
    const val = field === "price" ? (parseInt(el.value) || 0) : el.value;
    currentMenu[+ci].items[+ii][field] = val;
  });
}

function buildDishCard(item, ci, ii) {
  const card = document.createElement("div");
  card.className = "dish-card";
  card.dataset.ci = ci;
  card.dataset.ii = ii;

  // Foto + botón cambiar
  const imgWrap = document.createElement("div");
  imgWrap.style.cssText = "position:relative;flex-shrink:0;";
  const imgEl = document.createElement("div");
  imgEl.className = "dish-card__img";
  imgEl.id = `img-${ci}-${ii}`;
  if (item.img) imgEl.innerHTML = `<img src="${item.img}" alt="${item.name}" loading="lazy" />`;
  imgWrap.appendChild(imgEl);

  const btnFoto = document.createElement("button");
  btnFoto.className = "btn-change-foto";
  btnFoto.dataset.ci = ci;
  btnFoto.dataset.ii = ii;
  btnFoto.textContent = "📷 Foto";
  btnFoto.style.cssText = "position:absolute;bottom:4px;left:4px;font-size:10px;padding:3px 6px;background:rgba(0,0,0,0.7);color:#fff;border:none;border-radius:4px;cursor:pointer;width:calc(100% - 8px);";
  imgWrap.appendChild(btnFoto);
  card.appendChild(imgWrap);

  const body = document.createElement("div");
  body.className = "dish-card__body";

  // Nombre editable
  const nameRow = document.createElement("div");
  nameRow.className = "dish-card__row";
  nameRow.innerHTML = `<span class="dish-card__label">Nombre</span>`;
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "dish-input";
  nameInput.value = item.name || "";
  nameInput.dataset.ci = ci; nameInput.dataset.ii = ii; nameInput.dataset.field = "name";
  nameRow.appendChild(nameInput);
  body.appendChild(nameRow);

  // Precio
  const priceRow = document.createElement("div");
  priceRow.className = "dish-card__row";
  priceRow.innerHTML = `<span class="dish-card__label">Precio $</span>`;
  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.className = "dish-input price-input";
  priceInput.placeholder = "0";
  priceInput.value = item.price || "";
  priceInput.min = "0"; priceInput.step = "100";
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

  // Botón eliminar
  const delBtn = document.createElement("button");
  delBtn.className = "btn-delete-dish";
  delBtn.dataset.ci = ci; delBtn.dataset.ii = ii;
  delBtn.textContent = "Eliminar plato";
  delBtn.style.cssText = "margin-top:8px;font-size:10px;padding:4px 10px;background:transparent;color:#c44;border:1px solid #c44;border-radius:4px;cursor:pointer;letter-spacing:1px;";
  body.appendChild(delBtn);

  card.appendChild(body);
  return card;
}

function addDish(ci) {
  const name = prompt("Nombre del nuevo plato:");
  if (!name || !name.trim()) return;
  const newItem = {
    id: "plato-" + Date.now(),
    name: name.trim(),
    desc: "",
    price: 0,
    tag: "",
    img: ""
  };
  currentMenu[ci].items.push(newItem);
  buildAdmin();
  showToast("✓ Plato agregado — completá los datos y guardá");
}

function deleteDish(ci, ii) {
  const nombre = currentMenu[ci].items[ii].name;
  if (!confirm(`¿Eliminar "${nombre}"?`)) return;
  currentMenu[ci].items.splice(ii, 1);
  buildAdmin();
  showToast("✓ Plato eliminado");
}

function addCategory() {
  const name = prompt("Nombre de la nueva categoría:");
  if (!name || !name.trim()) return;
  currentMenu.push({ name: name.trim(), items: [] });
  buildAdmin();
  showToast("✓ Categoría agregada");
}

function openFotoPicker(ci, ii, btn) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      currentMenu[ci].items[ii].img = base64;
      // Actualizar preview
      const imgEl = document.getElementById(`img-${ci}-${ii}`);
      if (imgEl) imgEl.innerHTML = `<img src="${base64}" alt="foto" style="width:100%;height:100%;object-fit:cover;" />`;
      showToast("✓ Foto cargada — guardá y exportá para aplicar");
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

/* ---- guardar ---- */
document.getElementById("btn-save").addEventListener("click", () => {
  localStorage.setItem("22ps_menu", JSON.stringify(currentMenu));
  showToast("✓ Cambios guardados");
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
  showToast("✓ Exportado — copialo al proyecto y hacé git push");
});

/* ---- toast ---- */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3200);
}

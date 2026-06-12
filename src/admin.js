/* =========================================================================
   22 PATAGONIA SUSHI — Admin JS v3 · guarda directo en Cloudflare D1
   PIN: 2222
   ========================================================================= */
const ADMIN_PIN = "2222";
const WORKER_URL = "https://22patagonia-sushi-premium.juliancrovs.workers.dev";

const lockEl    = document.getElementById("lock");
const adminEl   = document.getElementById("admin");
const pinInput  = document.getElementById("pin-input");
const pinError  = document.getElementById("pin-error");
const unlockBtn = document.getElementById("unlock-btn");

function tryUnlock() {
  if (pinInput.value === ADMIN_PIN) {
    lockEl.style.display = "none";
    adminEl.style.display = "block";
    loadAndBuild();
  } else {
    pinError.classList.add("show");
    pinInput.value = "";
    pinInput.focus();
    setTimeout(() => pinError.classList.remove("show"), 2000);
  }
}
unlockBtn.addEventListener("click", tryUnlock);
pinInput.addEventListener("keydown", (e) => { if (e.key === "Enter") tryUnlock(); });

const TAG_OPTIONS = [
  { value: "",       label: "Sin etiqueta" },
  { value: "pop",    label: "Más pedido" },
  { value: "new",    label: "Nuevo" },
  { value: "chef",   label: "Chef recomienda" },
  { value: "veggie", label: "Veggie" },
];

let currentMenu = [];

/* ── Cargar menú desde D1 o fallback a window.MENU ── */
async function loadAndBuild() {
  showToast("Cargando carta...");
  try {
    const res = await fetch(WORKER_URL + "/api/menu");
    const data = await res.json();
    currentMenu = (data && Array.isArray(data) && data.length) ? data : JSON.parse(JSON.stringify(window.MENU));
  } catch {
    currentMenu = JSON.parse(JSON.stringify(window.MENU));
  }
  buildAdmin();
}

/* ── Guardar menú en D1 ── */
async function saveMenu() {
  const btn = document.getElementById("btn-save");
  btn.textContent = "Guardando...";
  btn.disabled = true;
  try {
    const res = await fetch(WORKER_URL + "/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Pin": ADMIN_PIN },
      body: JSON.stringify(currentMenu)
    });
    const data = await res.json();
    if (data.ok) {
      showToast("✓ Carta guardada — se actualiza en el sitio al instante");
    } else {
      showToast("❌ Error al guardar: " + (data.error || "desconocido"));
    }
  } catch (err) {
    showToast("❌ Error de conexión: " + err.message);
  }
  btn.textContent = "Guardar cambios";
  btn.disabled = false;
}

/* ── Construir UI ── */
function buildAdmin() {
  const grid = document.getElementById("dish-grid");
  grid.innerHTML = "";

  currentMenu.forEach((cat, ci) => {
    const catHead = document.createElement("div");
    catHead.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:12px 0 4px;margin-top:8px;";
    catHead.innerHTML = `
      <p style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin:0">${cat.name.toUpperCase()}</p>
      <button class="btn-add-dish" data-ci="${ci}" style="font-size:11px;padding:5px 12px;background:var(--red);color:#fff;border:none;border-radius:6px;cursor:pointer;letter-spacing:1px;">+ AGREGAR PLATO</button>
    `;
    grid.appendChild(catHead);
    cat.items.forEach((item, ii) => grid.appendChild(buildDishCard(item, ci, ii)));
  });

  const addCatDiv = document.createElement("div");
  addCatDiv.style.cssText = "margin-top:20px;padding-top:16px;border-top:1px solid var(--hair-2);";
  addCatDiv.innerHTML = `<button id="btn-add-cat" style="font-size:11px;padding:6px 14px;background:transparent;color:var(--muted);border:1px solid var(--hair-2);border-radius:6px;cursor:pointer;letter-spacing:1px;">+ NUEVA CATEGORÍA</button>`;
  grid.appendChild(addCatDiv);

  grid.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-add-dish"))    addDish(+e.target.dataset.ci);
    if (e.target.id === "btn-add-cat")                  addCategory();
    if (e.target.classList.contains("btn-delete-dish")) deleteDish(+e.target.dataset.ci, +e.target.dataset.ii);
    if (e.target.classList.contains("btn-change-foto")) openFotoPicker(+e.target.dataset.ci, +e.target.dataset.ii);
  });

  grid.addEventListener("input", (e) => {
    const { ci, ii, field } = e.target.dataset;
    if (!field) return;
    const val = field === "price" ? (parseInt(e.target.value) || 0) : e.target.value;
    currentMenu[+ci].items[+ii][field] = val;
  });
}

function buildDishCard(item, ci, ii) {
  const card = document.createElement("div");
  card.className = "dish-card";

  const imgWrap = document.createElement("div");
  imgWrap.style.cssText = "position:relative;flex-shrink:0;";
  const imgEl = document.createElement("div");
  imgEl.className = "dish-card__img";
  imgEl.id = `img-${ci}-${ii}`;
  if (item.img) imgEl.innerHTML = `<img src="${item.img}" style="width:100%;height:100%;object-fit:cover;" />`;
  imgWrap.appendChild(imgEl);

  const btnFoto = document.createElement("button");
  btnFoto.className = "btn-change-foto";
  btnFoto.dataset.ci = ci; btnFoto.dataset.ii = ii;
  btnFoto.textContent = "📷 Cambiar foto";
  btnFoto.style.cssText = "position:absolute;bottom:4px;left:4px;font-size:10px;padding:3px 6px;background:rgba(0,0,0,0.75);color:#fff;border:none;border-radius:4px;cursor:pointer;width:calc(100% - 8px);";
  imgWrap.appendChild(btnFoto);
  card.appendChild(imgWrap);

  const body = document.createElement("div");
  body.className = "dish-card__body";

  // Nombre
  const nameRow = document.createElement("div");
  nameRow.className = "dish-card__row";
  nameRow.innerHTML = `<span class="dish-card__label">Nombre</span>`;
  const nameInput = document.createElement("input");
  nameInput.type = "text"; nameInput.className = "dish-input";
  nameInput.value = item.name || "";
  nameInput.dataset.ci = ci; nameInput.dataset.ii = ii; nameInput.dataset.field = "name";
  nameRow.appendChild(nameInput);
  body.appendChild(nameRow);

  // Precio
  const priceRow = document.createElement("div");
  priceRow.className = "dish-card__row";
  priceRow.innerHTML = `<span class="dish-card__label">Precio $</span>`;
  const priceInput = document.createElement("input");
  priceInput.type = "number"; priceInput.className = "dish-input price-input";
  priceInput.value = item.price || ""; priceInput.min = "0"; priceInput.step = "100";
  priceInput.dataset.ci = ci; priceInput.dataset.ii = ii; priceInput.dataset.field = "price";
  priceRow.appendChild(priceInput);
  body.appendChild(priceRow);

  // Descripción
  const descRow = document.createElement("div");
  descRow.className = "dish-card__row"; descRow.style.alignItems = "flex-start";
  descRow.innerHTML = `<span class="dish-card__label" style="padding-top:9px">Desc</span>`;
  const descInput = document.createElement("textarea");
  descInput.className = "dish-input"; descInput.rows = 2;
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

  // Eliminar
  const delBtn = document.createElement("button");
  delBtn.className = "btn-delete-dish";
  delBtn.dataset.ci = ci; delBtn.dataset.ii = ii;
  delBtn.textContent = "Eliminar plato";
  delBtn.style.cssText = "margin-top:8px;font-size:10px;padding:4px 10px;background:transparent;color:#c44;border:1px solid #c44;border-radius:4px;cursor:pointer;";
  body.appendChild(delBtn);

  card.appendChild(body);
  return card;
}

function addDish(ci) {
  const name = prompt("Nombre del nuevo plato:");
  if (!name || !name.trim()) return;
  currentMenu[ci].items.push({ id: "plato-" + Date.now(), name: name.trim(), desc: "", price: 0, tag: "", img: "" });
  buildAdmin();
  showToast("✓ Plato agregado — completá los datos y guardá");
}

function deleteDish(ci, ii) {
  if (!confirm(`¿Eliminar "${currentMenu[ci].items[ii].name}"?`)) return;
  currentMenu[ci].items.splice(ii, 1);
  buildAdmin();
  showToast("✓ Plato eliminado — guardá para confirmar");
}

function addCategory() {
  const name = prompt("Nombre de la nueva categoría:");
  if (!name || !name.trim()) return;
  currentMenu.push({ id: "cat-" + Date.now(), name: name.trim(), items: [] });
  buildAdmin();
  showToast("✓ Categoría agregada — guardá para confirmar");
}

function openFotoPicker(ci, ii) {
  const input = document.createElement("input");
  input.type = "file"; input.accept = "image/*";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Comprimir a max 400px
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    const MAX = 400;
    const ratio = Math.min(MAX / bitmap.width, MAX / bitmap.height, 1);
    canvas.width = Math.round(bitmap.width * ratio);
    canvas.height = Math.round(bitmap.height * ratio);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg", 0.82);

    currentMenu[ci].items[ii].img = base64;
    const imgEl = document.getElementById(`img-${ci}-${ii}`);
    if (imgEl) imgEl.innerHTML = `<img src="${base64}" style="width:100%;height:100%;object-fit:cover;" />`;
    showToast("✓ Foto cargada — tocá Guardar para aplicar");
  };
  input.click();
}

document.getElementById("btn-save").addEventListener("click", saveMenu);

/* Ocultar btn-export si existe */
const btnExp = document.getElementById("btn-export");
if (btnExp) btnExp.style.display = "none";

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3500);
}

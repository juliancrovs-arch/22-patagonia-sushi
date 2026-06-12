/* =========================================================================
   22 PATAGONIA SUSHI — Admin JS v4 · con cropper de fotos
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

/* ── Cropper modal ── */
const cropperCSS = `
#cropper-modal { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999; align-items:center; justify-content:center; flex-direction:column; gap:16px; }
#cropper-modal.open { display:flex; }
#cropper-wrap { position:relative; width:300px; height:300px; overflow:hidden; border-radius:12px; border:2px solid #B91C1C; background:#000; cursor:move; touch-action:none; }
#cropper-img { position:absolute; transform-origin:top left; user-select:none; pointer-events:none; }
#cropper-frame { position:absolute; inset:0; border:3px dashed rgba(255,255,255,0.5); border-radius:12px; pointer-events:none; }
.cropper-btns { display:flex; gap:12px; }
.cropper-btns button { padding:10px 24px; border:none; border-radius:8px; cursor:pointer; font-size:14px; font-weight:600; letter-spacing:1px; }
#btn-crop-ok { background:#B91C1C; color:#fff; }
#btn-crop-cancel { background:#333; color:#ccc; }
.crop-controls { display:flex; gap:10px; align-items:center; }
.crop-controls button { background:#222; color:#fff; border:none; border-radius:6px; padding:6px 14px; cursor:pointer; font-size:18px; }
`;
const styleEl = document.createElement("style");
styleEl.textContent = cropperCSS;
document.head.appendChild(styleEl);

const cropperModal = document.createElement("div");
cropperModal.id = "cropper-modal";
cropperModal.innerHTML = `
  <p style="color:#fff;font-size:12px;letter-spacing:2px;text-transform:uppercase;">AJUSTÁ LA FOTO · Arrastrá para centrar</p>
  <div id="cropper-wrap">
    <img id="cropper-img" draggable="false"/>
    <div id="cropper-frame"></div>
  </div>
  <div class="crop-controls">
    <button id="btn-zoom-out">−</button>
    <span style="color:#aaa;font-size:12px;">Zoom</span>
    <button id="btn-zoom-in">+</button>
  </div>
  <div class="cropper-btns">
    <button id="btn-crop-cancel">Cancelar</button>
    <button id="btn-crop-ok">✓ Usar esta foto</button>
  </div>
`;
document.body.appendChild(cropperModal);

let cropState = { x:0, y:0, scale:1, dragging:false, startX:0, startY:0, imgW:0, imgH:0, onConfirm:null };

const cropImg = document.getElementById("cropper-img");
const cropWrap = document.getElementById("cropper-wrap");

function applyTransform() {
  cropImg.style.transform = `translate(${cropState.x}px, ${cropState.y}px) scale(${cropState.scale})`;
}

cropWrap.addEventListener("mousedown", (e) => {
  cropState.dragging = true;
  cropState.startX = e.clientX - cropState.x;
  cropState.startY = e.clientY - cropState.y;
});
cropWrap.addEventListener("touchstart", (e) => {
  cropState.dragging = true;
  cropState.startX = e.touches[0].clientX - cropState.x;
  cropState.startY = e.touches[0].clientY - cropState.y;
}, { passive: true });
window.addEventListener("mousemove", (e) => {
  if (!cropState.dragging) return;
  cropState.x = e.clientX - cropState.startX;
  cropState.y = e.clientY - cropState.startY;
  applyTransform();
});
window.addEventListener("touchmove", (e) => {
  if (!cropState.dragging) return;
  cropState.x = e.touches[0].clientX - cropState.startX;
  cropState.y = e.touches[0].clientY - cropState.startY;
  applyTransform();
}, { passive: true });
window.addEventListener("mouseup", () => cropState.dragging = false);
window.addEventListener("touchend", () => cropState.dragging = false);

document.getElementById("btn-zoom-in").addEventListener("click", () => { cropState.scale = Math.min(cropState.scale + 0.15, 4); applyTransform(); });
document.getElementById("btn-zoom-out").addEventListener("click", () => { cropState.scale = Math.max(cropState.scale - 0.15, 0.3); applyTransform(); });
document.getElementById("btn-crop-cancel").addEventListener("click", () => cropperModal.classList.remove("open"));
document.getElementById("btn-crop-ok").addEventListener("click", () => {
  // Renderizar el recorte
  const canvas = document.createElement("canvas");
  canvas.width = 400; canvas.height = 400;
  const ctx = canvas.getContext("2d");
  // El wrap es 300x300, escalar a 400x400
  const ratio = 400 / 300;
  ctx.save();
  ctx.translate(cropState.x * ratio, cropState.y * ratio);
  ctx.scale(cropState.scale, cropState.scale);
  ctx.drawImage(cropImg, 0, 0, cropState.imgW * ratio, cropState.imgH * ratio);
  ctx.restore();
  const base64 = canvas.toDataURL("image/jpeg", 0.85);
  cropperModal.classList.remove("open");
  if (cropState.onConfirm) cropState.onConfirm(base64);
});

function openCropper(src, onConfirm) {
  cropImg.src = src;
  cropImg.onload = () => {
    const w = cropImg.naturalWidth;
    const h = cropImg.naturalHeight;
    // Escalar para que entre en 300px
    const s = Math.max(300 / w, 300 / h);
    cropState.scale = s;
    cropState.x = (300 - w * s) / 2;
    cropState.y = (300 - h * s) / 2;
    cropState.imgW = w;
    cropState.imgH = h;
    cropState.dragging = false;
    cropState.onConfirm = onConfirm;
    cropImg.style.width = w + "px";
    cropImg.style.height = h + "px";
    applyTransform();
    cropperModal.classList.add("open");
  };
}

/* ── Tag options ── */
const TAG_OPTIONS = [
  { value: "",       label: "Sin etiqueta" },
  { value: "pop",    label: "Más pedido" },
  { value: "new",    label: "Nuevo" },
  { value: "chef",   label: "Chef recomienda" },
  { value: "veggie", label: "Veggie" },
];

let currentMenu = [];

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
    if (data.ok) showToast("✓ Carta guardada — se actualiza en el sitio al instante");
    else showToast("❌ Error: " + (data.error || "desconocido"));
  } catch (err) {
    showToast("❌ Error de conexión: " + err.message);
  }
  btn.textContent = "Guardar cambios";
  btn.disabled = false;
}

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

  const nameRow = document.createElement("div");
  nameRow.className = "dish-card__row";
  nameRow.innerHTML = `<span class="dish-card__label">Nombre</span>`;
  const nameInput = document.createElement("input");
  nameInput.type = "text"; nameInput.className = "dish-input";
  nameInput.value = item.name || "";
  nameInput.dataset.ci = ci; nameInput.dataset.ii = ii; nameInput.dataset.field = "name";
  nameRow.appendChild(nameInput);
  body.appendChild(nameRow);

  const priceRow = document.createElement("div");
  priceRow.className = "dish-card__row";
  priceRow.innerHTML = `<span class="dish-card__label">Precio $</span>`;
  const priceInput = document.createElement("input");
  priceInput.type = "number"; priceInput.className = "dish-input price-input";
  priceInput.value = item.price || ""; priceInput.min = "0"; priceInput.step = "100";
  priceInput.dataset.ci = ci; priceInput.dataset.ii = ii; priceInput.dataset.field = "price";
  priceRow.appendChild(priceInput);
  body.appendChild(priceRow);

  const descRow = document.createElement("div");
  descRow.className = "dish-card__row"; descRow.style.alignItems = "flex-start";
  descRow.innerHTML = `<span class="dish-card__label" style="padding-top:9px">Desc</span>`;
  const descInput = document.createElement("textarea");
  descInput.className = "dish-input"; descInput.rows = 2;
  descInput.value = item.desc || "";
  descInput.dataset.ci = ci; descInput.dataset.ii = ii; descInput.dataset.field = "desc";
  descRow.appendChild(descInput);
  body.appendChild(descRow);

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
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      openCropper(ev.target.result, (base64) => {
        currentMenu[ci].items[ii].img = base64;
        const imgEl = document.getElementById(`img-${ci}-${ii}`);
        if (imgEl) imgEl.innerHTML = `<img src="${base64}" style="width:100%;height:100%;object-fit:cover;" />`;
        showToast("✓ Foto ajustada — tocá Guardar para aplicar");
      });
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

document.getElementById("btn-save").addEventListener("click", saveMenu);
const btnExp = document.getElementById("btn-export");
if (btnExp) btnExp.style.display = "none";

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3500);
}

/* =========================================================================
   22 PATAGONIA SUSHI — menu-data.js
   Carga desde D1 via Worker. Fallback a datos estáticos.
   ========================================================================= */
window.RESTAURANT = {
  name: "22 Patagonia Sushi",
  tagline: "Cocina Japonesa",
  city: "BOLSÓN, PATAGONIA",
  hours: "Mar a Dom · 19:30 – 23:30",
};

window.MENU_STATIC = [
  {
    id: "clasicos", name: "Clásicos", en: "Classic rolls", sub: "Los de siempre",
    items: [
      { id: "new-york",     name: "New York",     desc: "Salmón, palta y queso philadelphia.",  price: 15900, tag: "", img: "" },
      { id: "california",   name: "California",   desc: "Kanikama, palta y queso philadelphia.", price: 15900, tag: "", img: "" },
      { id: "philadelphia", name: "Philadelphia",  desc: "Salmón, pepino y queso philadelphia.", price: 16500, tag: "", img: "" }
    ]
  },
  {
    id: "especiales", name: "Especiales", en: "Special rolls", sub: "Creaciones de la casa",
    items: [
      { id: "ceviche-roll",   name: "Ceviche Roll",   desc: "Boniato asado, palta y queso philadelphia coronado con ceviche de salmón.", price: 16900, tag: "pop",  img: "assets/dishes/ceviche.jpeg" },
      { id: "briellante-roll",name: "Briellante Roll", desc: "Salmón, palta y queso philadelphia con queso brie, miel y nueces caramelizadas.", price: 17500, tag: "chef", img: "assets/dishes/brillante.jpeg" },
      { id: "top-tuna",       name: "Top Tuna",        desc: "Langostinos furai, palta y queso philadelphia con atún flameado y salsa teriyaki.", price: 17900, tag: "new",  img: "" }
    ]
  },
  {
    id: "veggies", name: "Veggies", en: "Vegetarian rolls", sub: "Para los verdes",
    items: [
      { id: "mango-zen",  name: "Mango Zen",  desc: "Mango, palta y queso philadelphia, coronado con semillas de sésamo.", price: 15800, tag: "veggie", img: "assets/dishes/demango.jpeg" },
      { id: "pinar-roll", name: "Pinar Roll", desc: "Hongos de pino, pepino y queso philadelphia, con morrón rojo asado y semillas de sésamo.", price: 15800, tag: "veggie", img: "" },
      { id: "andes-roll", name: "Andes Roll", desc: "Pepino, palta y queso philadelphia, con semillas de sésamo.", price: 15000, tag: "veggie", img: "" }
    ]
  },
  {
    id: "de-autor", name: "De Autor", en: "Signature rolls", sub: "Firma de la casa", featured: true,
    items: [
      { id: "patagonia-22",  name: "Patagonia 22",  desc: "Langostinos furai, queso philadelphia con guacamole y semillas de sésamo.", price: 16500, tag: "chef", img: "" },
      { id: "cerro-21",      name: "Cerro 21",       desc: "Langostinos furai y palta, con palta y semillas de sésamo.", price: 16500, tag: "", img: "" },
      { id: "piltriquitron", name: "Piltriquitrón",  desc: "Doble palta y doble philadelphia, con salmón ahumado, salsa de miel y mostaza dijón.", price: 17900, tag: "pop", img: "" },
      { id: "pink-crunch",   name: "Pink Crunch",    desc: "Salmón cocido, palta y queso philadelphia con alioli de remolacha y doritos.", price: 17900, tag: "new", img: "assets/dishes/pincrunch.jpeg" }
    ]
  },
  {
    id: "picantes", name: "¡Para los más picantes!", en: "Spicy rolls", sub: "Si te animás",
    items: [
      { id: "trucha-spicy",  name: "Trucha Spicy",  desc: "Doble palta y doble philadelphia, coronado con trucha ahumada spicy.", price: 16900, tag: "pop", img: "" },
      { id: "crab-ardiente", name: "Crab Ardiente", desc: "Langostinos furai, morrón asado y palta, coronado con kanikama y spicy mayo.", price: 16900, tag: "", img: "" },
      { id: "kani-fire",     name: "Kani Fire",     desc: "Kanikama, palta y queso philadelphia coronado con pizca de salsa sriracha.", price: 16000, tag: "new", img: "" }
    ]
  }
];

/* Cargar desde Worker, con fallback */
(async () => {
  try {
    const res = await fetch("https://22patagonia-sushi-premium.juliancrovs.workers.dev/api/menu");
    const data = await res.json();
    window.MENU = (data && Array.isArray(data) && data.length) ? data : window.MENU_STATIC;
  } catch {
    window.MENU = window.MENU_STATIC;
  }
  // Disparar evento para que React sepa que el menú está listo
  window.dispatchEvent(new Event("menu-ready"));
})();

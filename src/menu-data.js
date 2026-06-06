/* =========================================================================
   22 PATAGONIA SUSHI — Datos del menú
   Editar precios y fotos en el panel de Admin (admin.html) y exportar.
   ========================================================================= */
window.RESTAURANT = {
  name: "22 Patagonia Sushi",
  tagline: "Cocina Japonesa",
  city: "BOLSÓN, PATAGONIA",
  hours: "Mar a Dom · 19:30 – 23:30",
};

/* tag: 'pop' | 'new' | 'chef' | 'veggie' */
window.MENU = [
  {
    id: "clasicos",
    name: "Clásicos",
    en: "Classic rolls",
    sub: "Los de siempre",
    items: [
      {
        id: "new-york",
        name: "New York",
        en: "Salmon & avocado",
        desc: "Salmón, palta y queso philadelphia.",
        price: 15900,
        tag: "",
        img: ""
      },
      {
        id: "california",
        name: "California",
        en: "Crab & avocado",
        desc: "Kanikama, palta y queso philadelphia.",
        price: 15900,
        tag: "",
        img: ""
      },
      {
        id: "philadelphia",
        name: "Philadelphia",
        en: "Salmon & cream cheese",
        desc: "Salmón, pepino y queso philadelphia.",
        price: 16500,
        tag: "",
        img: ""
      }
    ]
  },
  {
    id: "especiales",
    name: "Especiales",
    en: "Special rolls",
    sub: "Creaciones de la casa",
    items: [
      {
        id: "ceviche-roll",
        name: "Ceviche Roll",
        en: "Ceviche-style roll",
        desc: "Boniato asado, palta y queso philadelphia coronado con ceviche de salmón.",
        price: 16900,
        tag: "pop",
        img: "assets/dishes/ceviche.jpeg"
      },
      {
        id: "briellante-roll",
        name: "Briellante Roll",
        en: "Brie & honey roll",
        desc: "Salmón, palta y queso philadelphia con queso brie, miel y nueces caramelizadas.",
        price: 17500,
        tag: "chef",
        img: "assets/dishes/brillante.jpeg"
      },
      {
        id: "top-tuna",
        name: "Top Tuna",
        en: "Tuna & teriyaki",
        desc: "Langostinos furai, palta y queso philadelphia con atún flameado y salsa teriyaki.",
        price: 17900,
        tag: "new",
        img: ""
      }
    ]
  },
  {
    id: "veggies",
    name: "Veggies",
    en: "Vegetarian rolls",
    sub: "Para los verdes",
    items: [
      {
        id: "mango-zen",
        name: "Mango Zen",
        en: "Mango & sesame",
        desc: "Mango, palta y queso philadelphia, coronado con semillas de sésamo.",
        price: 15800,
        tag: "veggie",
        img: "assets/dishes/demango.jpeg"
      },
      {
        id: "pinar-roll",
        name: "Pinar Roll",
        en: "Mushroom roll",
        desc: "Hongos de pino, pepino y queso philadelphia, con morrón rojo asado y semillas de sésamo.",
        price: 15800,
        tag: "veggie",
        img: ""
      },
      {
        id: "andes-roll",
        name: "Andes Roll",
        en: "Cucumber & sesame",
        desc: "Pepino, palta y queso philadelphia, con semillas de sésamo.",
        price: 15000,
        tag: "veggie",
        img: ""
      }
    ]
  },
  {
    id: "de-autor",
    name: "De Autor",
    en: "Signature rolls",
    sub: "Firma de la casa",
    featured: true,
    items: [
      {
        id: "patagonia-22",
        name: "Patagonia 22",
        en: "Signature roll",
        desc: "Langostinos furai, queso philadelphia con guacamole y semillas de sésamo.",
        price: 16500,
        tag: "chef",
        img: ""
      },
      {
        id: "cerro-21",
        name: "Cerro 21",
        en: "Shrimp & sesame",
        desc: "Langostinos furai y palta, con palta y semillas de sésamo.",
        price: 16500,
        tag: "",
        img: ""
      },
      {
        id: "piltriquitron",
        name: "Piltriquitrón",
        en: "Smoked salmon roll",
        desc: "Doble palta y doble philadelphia, con salmón ahumado, salsa de miel y mostaza dijón.",
        price: 17900,
        tag: "pop",
        img: ""
      },
      {
        id: "pink-crunch",
        name: "Pink Crunch",
        en: "Beet aioli roll",
        desc: "Salmón cocido, palta y queso philadelphia con alioli de remolacha y doritos.",
        price: 17900,
        tag: "new",
        img: "assets/dishes/pincrunch.jpeg"
      }
    ]
  },
  {
    id: "picantes",
    name: "¡Para los más picantes!",
    en: "Spicy rolls",
    sub: "Si te animás",
    items: [
      {
        id: "trucha-spicy",
        name: "Trucha Spicy",
        en: "Smoked trout spicy",
        desc: "Doble palta y doble philadelphia, coronado con trucha ahumada spicy.",
        price: 16900,
        tag: "pop",
        img: ""
      },
      {
        id: "crab-ardiente",
        name: "Crab Ardiente",
        en: "Crab & spicy mayo",
        desc: "Langostinos furai, morrón asado y palta, coronado con kanikama y spicy mayo.",
        price: 16900,
        tag: "",
        img: ""
      },
      {
        id: "kani-fire",
        name: "Kani Fire",
        en: "Sriracha roll",
        desc: "Kanikama, palta y queso philadelphia coronado con pizca de salsa sriracha.",
        price: 16000,
        tag: "new",
        img: ""
      }
    ]
  }
];

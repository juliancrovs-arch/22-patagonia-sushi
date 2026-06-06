/* =========================================================================
   22 PATAGONIA SUSHI — Datos del menú
   Editar precios en el panel de Admin (admin.html) y exportar.
   ========================================================================= */
window.RESTAURANT = {
  name: "22 Patagonia Sushi",
  tagline: "Cocina Japonesa",
  city: "Bois�n, Patagonia",
  hours: "Mar a Dom · 19:30 – 23:30",
};

/* tag: 'pop' | 'new' | 'chef' | 'veggie' */
window.MENU = [
  {
    id: "rolls",
    name: "Rolls",
    en: "Classic rolls",
    sub: "Los de siempre",
    items: [
      {
        id: "demango",
        name: "De Mango",
        en: "Mango & avocado",
        desc: "Palta, mango, pepino y sésamo tostado.",
        price: 0,
        tag: "veggie",
        img: "assets/dishes/demango.jpeg"
      },
      {
        id: "ceviche",
        name: "Ceviche",
        en: "Ceviche-style roll",
        desc: "Salmón marinado, cebolla morada, cilantro y jalapeño.",
        price: 0,
        img: "assets/dishes/ceviche.jpeg"
      },
      {
        id: "pincrunch",
        name: "Pin Crunch",
        en: "Crunchy roll",
        desc: "Salmón, queso crema y crocante de Doritos.",
        price: 0,
        tag: "pop",
        img: "assets/dishes/pincrunch.jpeg"
      }
    ]
  },
  {
    id: "premium",
    name: "Rolls Premium",
    en: "Premium rolls",
    sub: "Creaciones de la casa",
    featured: true,
    items: [
      {
        id: "brillante",
        name: "Brillante",
        en: "Honey & walnut roll",
        desc: "Langostino, queso crema, nuez caramelizada y miel artesanal.",
        price: 0,
        tag: "chef",
        img: "assets/dishes/brillante.jpeg"
      },
      {
        id: "cannifier",
        name: "Cannifier",
        en: "Spicy sesame roll",
        desc: "Salmón, palta, salsa picante de la casa y sésamo negro.",
        price: 0,
        tag: "new",
        img: "assets/dishes/cannifier.jpeg"
      }
    ]
  }
];

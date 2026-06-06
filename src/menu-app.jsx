/* =========================================================================
   22 PATAGONIA SUSHI — App principal (full-screen responsive)
   ========================================================================= */
const { useState, useEffect, useRef, useCallback } = React;

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(window.MENU);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.findIndex(c => c.id === item.id);
      if (existing >= 0) {
        return prev.map((c, i) => i === existing ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (idx) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  };

  const updateQty = (idx, qty) => {
    if (qty < 1) { removeFromCart(idx); return; }
    setCart(prev => prev.map((c, i) => i === idx ? { ...c, quantity: qty } : c));
  };

  /* topbar aparece al bajar del hero */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > window.innerHeight * 0.6);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* override con precios guardados por el admin (localStorage) */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("22ps_menu");
      if (saved) {
        const data = JSON.parse(saved);
        if (Array.isArray(data) && data.length > 0) setMenu(data);
      }
    } catch {}
  }, []);

  const goTo = useCallback((id) => {
    const el = document.getElementById("cat-" + id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return (
    <div className="app">
      <TopBar solid={scrolled} cartCount={cart.length} onCartClick={() => setCartOpen(!cartOpen)} />
      <Hero />
      <Explore cats={menu} onPick={goTo} />
      <div className="menu__body">
        {menu.map((c) => (
          <section className="catsec" key={c.id}>
            <SectionHeader cat={c} />
            <div className="cards">
              {c.items.map((item, idx) => (
                <ProductCard key={item.id} item={item} index={idx} featured={c.featured} onAdd={() => addToCart(item)} />
              ))}
            </div>
          </section>
        ))}
        <footer className="menufoot">
          <img className="menufoot__mark" src="assets/lantern-cream.png" alt="" />
          <p className="menufoot__name">22 Patagonia Sushi</p>
          <p className="menufoot__meta">{window.RESTAURANT.hours}</p>
          <p className="menufoot__city">{window.RESTAURANT.city}</p>
          <p className="menufoot__note">© CRV Studio</p>
        </footer>
      </div>
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} onQtyChange={updateQty} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

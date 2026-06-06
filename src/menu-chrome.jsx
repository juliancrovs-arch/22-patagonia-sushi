/* =========================================================================
   22 PATAGONIA SUSHI — Chrome: topbar, hero, explorar
   ========================================================================= */

function TopBar({ solid, cartCount, onCartClick }) {
  return (
    <header className={"topbar" + (solid ? " topbar--solid" : "")}>
      <img className="topbar__mark" src="assets/lantern-cream.png" alt="" />
      <span className="topbar__name">22 Patagonia Sushi</span>
      {onCartClick && (
        <button className="topbar__cart" onClick={onCartClick}>
          🛒 {cartCount > 0 && <span className="topbar__badge">{cartCount}</span>}
        </button>
      )}
    </header>
  );
}

function Hero() {
  const r = window.RESTAURANT;
  return (
    <section className="hero">
      <div className="hero__bg">
        <img src="assets/ambiente.jpeg" alt="" />
      </div>
      <div className="hero__veil"></div>
      <div className="hero__glow"></div>
      <div className="hero__content">
        <span className="hero__badge">
          <span className="hero__dot"></span>Abierto ahora
        </span>
        <img className="hero__logo" src="assets/logo-cream.png" alt="22 Patagonia Sushi" />
        <div className="hero__divider">
          <span className="hero__rule"></span>
          <span className="hero__tag">{r.tagline}</span>
          <span className="hero__rule"></span>
        </div>
        <p className="hero__city">{r.city}</p>
      </div>
      <div className="hero__scroll" aria-hidden="true">
        <span>Explorar</span>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}

function Explore({ cats, onPick }) {
  return (
    <section className="explore">
      <Reveal as="header" className="explore__head">
        <h2 className="explore__title">Explorar Carta</h2>
        <p className="explore__sub">Dos mundos, un mismo ritual</p>
      </Reveal>
      <div className="explore__grid">
        {cats.map((c, i) => (
          <CategoryCard key={c.id} cat={c} index={i} onPick={onPick} />
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { TopBar, Hero, Explore });

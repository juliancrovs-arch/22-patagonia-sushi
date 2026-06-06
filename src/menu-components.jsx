/* =========================================================================
   22 PATAGONIA SUSHI — Componentes (carta full-screen)
   ========================================================================= */
const fmt = (n) => n > 0 ? "$" + n.toLocaleString("es-AR") : null;

/* ---- tags --------------------------------------------------------------- */
const TAGS = {
  pop:    { label: "Más pedido", cls: "tag--pop" },
  new:    { label: "Nuevo",      cls: "tag--new" },
  chef:   { label: "Chef recomienda", cls: "tag--chef" },
  veggie: { label: "Veggie",     cls: "tag--veggie" },
};
function Tag({ tag }) {
  const t = TAGS[tag]; if (!t) return null;
  return <span className={"tag " + t.cls}>{t.label}</span>;
}

/* ---- reveal on scroll -------------------------------------------------- */
function Reveal({ children, className = "", delay = 0, as: Comp = "div" }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { setShown(true); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -6% 0px", threshold: 0.10 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Comp ref={ref} className={"reveal " + (shown ? "is-in " : "") + className}
      style={{ transitionDelay: shown ? delay + "ms" : "0ms" }}>
      {children}
    </Comp>
  );
}

/* ---- tarjeta de categoría (Explorar Carta) ----------------------------- */
function CategoryCard({ cat, index, onPick }) {
  const coverImg = cat.items[0]?.img;
  return (
    <Reveal delay={index * 70}>
      <button className="catcard" onClick={() => onPick(cat.id)}>
        <div className="catcard__media">
          {coverImg && <img src={coverImg} alt={cat.name} loading="lazy" />}
          <div className="catcard__shade"></div>
        </div>
        <div className="catcard__body">
          <span className="catcard__name">{cat.name}</span>
          <span className="catcard__en">{cat.en}</span>
          <span className="catcard__count">{cat.items.length} platos</span>
        </div>
        <span className="catcard__arrow" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M6 3l6 6-6 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
    </Reveal>
  );
}

/* ---- product card con foto real ---------------------------------------- */
function ProductCard({ item, index, featured, onAdd }) {
  const price = fmt(item.price);
  return (
    <Reveal delay={(index % 3) * 80}>
      <article className={"card" + (featured ? " card--feat" : "")}>
        <div className="card__media">
          <img src={item.img} alt={item.name} loading="lazy" />
          {item.tag && <div className="card__tag-wrap"><Tag tag={item.tag} /></div>}
        </div>
        <div className="card__body">
          <h3 className="card__name">{item.name}</h3>
          <span className="card__en">{item.en}</span>
          <p className="card__desc">{item.desc}</p>
          <div className="card__foot">
            <span className="card__rule"></span>
            {price
              ? <span className="card__price">{price}</span>
              : <span className="card__price card__price--tbd">Consultar</span>}
          </div>
          {onAdd && <button className="card__add" onClick={onAdd}>+ Agregar</button>}
        </div>
      </article>
    </Reveal>
  );
}

/* ---- encabezado de sección --------------------------------------------- */
function SectionHeader({ cat }) {
  return (
    <Reveal as="header" className="sec">
      <div className="sec__inner" id={"cat-" + cat.id}>
        <div className="sec__titles">
          <span className="sec__sub">{cat.sub}</span>
          <h2 className="sec__name">{cat.name}</h2>
          <span className="sec__en">{cat.en}</span>
        </div>
      </div>
    </Reveal>
  );
}

Object.assign(window, { fmt, Tag, Reveal, CategoryCard, ProductCard, SectionHeader });

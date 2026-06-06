const { useState } = React;

function Cart({ isOpen, onClose, items, onRemove, onQtyChange }) {
  const whatsappNumber = "5492994208044";
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const generateMessage = () => {
    let msg = "🍣 *Pedido 22 Patagonia Sushi*\n\n";
    items.forEach(item => {
      msg += `• ${item.name}\n  x${item.quantity} | $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
    });
    msg += `\n*Total: $${total.toLocaleString('es-AR')}*\n\nPor favor confirmar disponibilidad`;
    return encodeURIComponent(msg);
  };

  return (
    <>
      {isOpen && <div className="cart__overlay" onClick={onClose}></div>}
      <div className={`cart ${isOpen ? 'cart--open' : ''}`}>
        <div className="cart__header">
          <h2>🛒 Tu Orden</h2>
          <button className="cart__close" onClick={onClose}>✕</button>
        </div>
        
        {items.length === 0 ? (
          <p className="cart__empty">Sin productos seleccionados</p>
        ) : (
          <>
            <div className="cart__items">
              {items.map((item, idx) => (
                <div key={idx} className="cart__item">
                  <div>
                    <div className="cart__name">{item.name}</div>
                    <div className="cart__qty">x{item.quantity}</div>
                  </div>
                  <div className="cart__right">
                    <button className="cart__qty-btn" onClick={() => onQtyChange(idx, item.quantity - 1)}>−</button>
                    <span className="cart__qty-val">{item.quantity}</span>
                    <button className="cart__qty-btn" onClick={() => onQtyChange(idx, item.quantity + 1)}>+</button>
                    <button className="cart__remove" onClick={() => onRemove(idx)}>🗑</button>
                  </div>
                  <div className="cart__price">${(item.price * item.quantity).toLocaleString('es-AR')}</div>
                </div>
              ))}
            </div>
            
            <div className="cart__footer">
              <div className="cart__total">Total: ${total.toLocaleString('es-AR')}</div>
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${generateMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cart__send"
              >
                📱 Enviar a WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}

Object.assign(window, { Cart });

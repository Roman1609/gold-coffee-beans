'use client';

import React, { useState } from 'react';
import { CartItem } from '../types/coffee';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  currency: 'UAH' | 'EUR' | 'USD';
}

const GRIND_SHORT: Record<string, string> = {
  whole_bean: 'Зерно',
  espresso: 'Еспресо',
  filter_v60: 'Фільтр / V60',
  french_press: 'Френч-прес',
  cezve: 'Турка',
};

const FREE_SHIPPING_THRESHOLD_UAH = 1200;

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  currency,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const formatPrice = (uahAmount: number) => {
    if (currency === 'EUR') return `€${(uahAmount / 46).toFixed(1)}`;
    if (currency === 'USD') return `$${(uahAmount / 42).toFixed(1)}`;
    return `${Math.round(uahAmount)} ₴`;
  };

  const rawSubtotal = items.reduce(
    (acc, item) => acc + item.pricePerUnit * item.quantity,
    0
  );

  const discountAmount = rawSubtotal * (discountPercent / 100);
  const subtotal = rawSubtotal - discountAmount;
  const isFreeShipping = rawSubtotal >= FREE_SHIPPING_THRESHOLD_UAH;
  const diffToFree = Math.max(0, FREE_SHIPPING_THRESHOLD_UAH - rawSubtotal);
  const progressPercent = Math.min(100, (rawSubtotal / FREE_SHIPPING_THRESHOLD_UAH) * 100);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    if (promoCode.trim().toUpperCase() === 'AURORA10' || promoCode.trim().toUpperCase() === 'COFFEE10') {
      setDiscountPercent(10);
      setPromoSuccess('Знижку 10% успішно застосовано!');
    } else {
      setPromoError('Недійсний промокод. Спробуйте AURORA10');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="drawer-head">
          <div className="drawer-title-row">
            <h3 className="drawer-title">Кошик замовлення</h3>
            <span className="items-count">({items.length})</span>
          </div>
          <button onClick={onClose} className="btn-close-drawer" aria-label="Закрити кошик">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="shipping-meter">
          <div className="meter-label">
            {isFreeShipping ? (
              <span className="free-achieved">✓ Вітаємо! Безкоштовна доставка активована</span>
            ) : (
              <span>
                Додайте ще на <strong>{formatPrice(diffToFree)}</strong> для безкоштовної доставки
              </span>
            )}
          </div>
          <div className="meter-track">
            <div className="meter-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Items List */}
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-icon-circle">
                <Tag size={32} className="gold-icon" />
              </div>
              <h4>Ваш кошик порожній</h4>
              <p>Оберіть свіжообсмажені зерна з нашої колекції мікролотів.</p>
              <button onClick={onClose} className="btn-secondary">
                <span>До каталогу сортів</span>
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="item-details">
                    <div className="item-title-row">
                      <h4 className="item-name">{item.product.name}</h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="btn-remove"
                        title="Видалити"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <p className="item-tagline">{item.product.tagline}</p>

                    <div className="item-meta-pills">
                      <span className="meta-pill">{item.weight}</span>
                      <span className="meta-pill">{GRIND_SHORT[item.grind] || item.grind}</span>
                    </div>

                    <div className="item-bottom-row">
                      {/* Quantity Controls */}
                      <div className="qty-counter">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="qty-btn"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="qty-num">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="qty-btn"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Line Price */}
                      <span className="item-price">
                        {formatPrice(item.pricePerUnit * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="drawer-footer">
            {/* Promo Code Form */}
            <form onSubmit={applyPromo} className="promo-form">
              <input
                type="text"
                placeholder="Промокод (наприклад: AURORA10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="promo-input"
              />
              <button type="submit" className="btn-promo-apply">
                Застосувати
              </button>
            </form>
            {promoError && <p className="promo-feedback error">{promoError}</p>}
            {promoSuccess && <p className="promo-feedback success">{promoSuccess}</p>}

            {/* Price Calculations */}
            <div className="price-breakdown">
              <div className="breakdown-row">
                <span>Проміжна сума:</span>
                <span>{formatPrice(rawSubtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="breakdown-row text-gold">
                  <span>Знижка ({discountPercent}%):</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="breakdown-row">
                <span>Доставка:</span>
                <span>{isFreeShipping ? 'Безкоштовно' : 'За тарифами перевізника'}</span>
              </div>
              <div className="breakdown-row total-row">
                <span>Разом до сплати:</span>
                <span className="total-amount">{formatPrice(subtotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button onClick={onCheckout} className="btn-primary btn-checkout">
              <span>Оформити замовлення</span>
              <ArrowRight size={18} />
            </button>

            <div className="freshness-guarantee-note">
              <ShieldCheck size={14} className="gold-icon" />
              <span>Обсмажуємо щовівторка та щоп’ятниці. Доставка 24–48 год.</span>
            </div>
          </div>
        )}
      </aside>

      <style jsx>{`
        .drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          z-index: 200;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }

        .drawer-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }

        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 460px;
          height: 100vh;
          background: #140E0A;
          border-left: 1px solid var(--border-accent);
          z-index: 201;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: -20px 0 50px rgba(0, 0, 0, 0.9);
        }

        .cart-drawer.open {
          transform: translateX(0);
        }

        /* Head */
        .drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 26px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .drawer-title-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .drawer-title {
          font-size: 1.25rem;
          color: #FAF6F0;
          font-family: var(--font-serif);
        }

        .items-count {
          color: var(--accent-gold);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .btn-close-drawer {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-close-drawer:hover {
          color: #FFFFFF;
          border-color: var(--accent-gold);
        }

        /* Shipping meter */
        .shipping-meter {
          padding: 12px 26px;
          background: rgba(223, 183, 117, 0.07);
          border-bottom: 1px solid var(--border-subtle);
        }

        .meter-label {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .meter-label strong {
          color: var(--accent-gold);
        }

        .free-achieved {
          color: #3B7A57;
          font-weight: 600;
        }

        .meter-track {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .meter-fill {
          height: 100%;
          background: linear-gradient(90deg, #A67836, #DFB775);
          border-radius: 2px;
          transition: width 0.35s ease;
        }

        /* Body */
        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 22px 26px;
        }

        .empty-cart-state {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 14px;
          padding: 40px 20px;
        }

        .empty-icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(223, 183, 117, 0.1);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-cart-state h4 {
          font-size: 1.15rem;
          color: #FAF6F0;
        }

        .empty-cart-state p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          max-width: 260px;
          line-height: 1.5;
        }

        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cart-item-row {
          background: rgba(26, 18, 13, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px;
          transition: border-color 0.2s ease;
        }

        .cart-item-row:hover {
          border-color: var(--border-accent);
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .item-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .item-name {
          font-size: 0.95rem;
          color: #FAF6F0;
          font-weight: 600;
        }

        .btn-remove {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s;
        }

        .btn-remove:hover {
          color: #D46A6A;
        }

        .item-tagline {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .item-meta-pills {
          display: flex;
          gap: 6px;
          margin: 8px 0;
        }

        .meta-pill {
          font-size: 0.72rem;
          padding: 2px 8px;
          background: rgba(223, 183, 117, 0.1);
          border-radius: var(--radius-full);
          color: var(--accent-gold);
        }

        .item-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 6px;
        }

        .qty-counter {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(14, 9, 6, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          padding: 2px 8px;
        }

        .qty-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .qty-btn:hover {
          color: #FFFFFF;
        }

        .qty-num {
          font-size: 0.84rem;
          font-weight: 600;
          color: #FAF6F0;
          min-width: 18px;
          text-align: center;
        }

        .item-price {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--accent-gold);
          font-family: var(--font-serif);
        }

        /* Footer */
        .drawer-footer {
          padding: 22px 26px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          background: #110B08;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .promo-form {
          display: flex;
          gap: 8px;
        }

        .promo-input {
          flex: 1;
          padding: 8px 12px;
          background: rgba(26, 18, 13, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: #FAF6F0;
          font-size: 0.8rem;
          outline: none;
        }

        .btn-promo-apply {
          padding: 8px 14px;
          background: rgba(223, 183, 117, 0.15);
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-sm);
          color: var(--accent-gold);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-promo-apply:hover {
          background: var(--accent-gold);
          color: #0E0906;
        }

        .promo-feedback {
          font-size: 0.74rem;
          margin-top: -8px;
        }

        .promo-feedback.error {
          color: #D46A6A;
        }

        .promo-feedback.success {
          color: #3B7A57;
        }

        .price-breakdown {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .breakdown-row.text-gold {
          color: var(--accent-gold);
        }

        .breakdown-row.total-row {
          font-size: 1.05rem;
          font-weight: 600;
          color: #FAF6F0;
          margin-top: 4px;
        }

        .total-amount {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--accent-gold);
          font-family: var(--font-serif);
        }

        .btn-checkout {
          width: 100%;
        }

        .freshness-guarantee-note {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          color: var(--text-muted);
          justify-content: center;
        }
      `}</style>
    </>
  );
}

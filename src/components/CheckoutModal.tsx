'use client';

import React, { useState } from 'react';
import { CartItem } from '../types/coffee';
import { X, CheckCircle, Truck, CreditCard, Sparkles, Coffee } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: 'UAH' | 'EUR' | 'USD';
  onOrderSuccess: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  currency,
  onOrderSuccess,
}: CheckoutModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Київ');
  const [deliveryMethod, setDeliveryMethod] = useState<'nova_poshta' | 'courier' | 'pickup'>('nova_poshta');
  const [warehouse, setWarehouse] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [orderNotes, setOrderNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (acc, it) => acc + it.pricePerUnit * it.quantity,
    0
  );

  const formatPrice = (uahAmount: number) => {
    if (currency === 'EUR') return `€${(uahAmount / 46).toFixed(1)}`;
    if (currency === 'USD') return `$${(uahAmount / 42).toFixed(1)}`;
    return `${Math.round(uahAmount)} ₴`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Будь ласка, вкажіть ваше ім’я та контактний телефон');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `AN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderNumber(generatedId);
      setIsSubmitting(false);
      setIsSuccess(true);
      onOrderSuccess();
    }, 1200);
  };

  return (
    <div className="checkout-backdrop" onClick={onClose}>
      <div className="checkout-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-top">
          <div className="brand-tag">
            <Sparkles size={14} className="gold-icon" />
            <span>ОФОРМЛЕННЯ ЗАМОВЛЕННЯ</span>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Закрити">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="success-screen">
            <div className="success-icon-wrap">
              <CheckCircle size={48} className="success-icon" />
            </div>
            <h3 className="success-title">Дякуємо за замовлення!</h3>
            <p className="order-id-tag">Номер вашого замовлення: <strong>{orderNumber}</strong></p>
            <p className="success-text">
              Ми вже готуємо ваші зерна до свіжого обсмаження та відправки. SMS-сповіщення
              з номером накладної Нової Пошти надійде на вказаний телефон.
            </p>

            <div className="order-receipt-box">
              <div className="receipt-header">
                <Coffee size={18} className="gold-icon" />
                <span>Склад відправки:</span>
              </div>
              <ul className="receipt-items">
                {items.map((it) => (
                  <li key={it.id} className="receipt-row">
                    <span>
                      {it.product.name} ({it.weight}, {it.quantity} шт)
                    </span>
                    <span className="receipt-price">{formatPrice(it.pricePerUnit * it.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="receipt-total">
                <span>Разом:</span>
                <span className="total-gold">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <button onClick={onClose} className="btn-primary full-width">
              <span>Повернутися до сайту</span>
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-sections-grid">
              {/* Left Column: Personal info & Delivery */}
              <div className="form-left-col">
                <h4 className="section-title">1. Контактні дані</h4>

                <div className="form-group">
                  <label>Ім’я та Прізвище *</label>
                  <input
                    type="text"
                    required
                    placeholder="Олександр Коваль"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Номер телефону (для ТТН) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+380 (__) ___ __ __"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                  />
                </div>

                <h4 className="section-title margin-top">2. Доставка</h4>

                <div className="delivery-methods-row">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('nova_poshta')}
                    className={`delivery-btn ${deliveryMethod === 'nova_poshta' ? 'active' : ''}`}
                  >
                    <Truck size={16} />
                    <span>Нова Пошта</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('courier')}
                    className={`delivery-btn ${deliveryMethod === 'courier' ? 'active' : ''}`}
                  >
                    <span>Кур’єр до дверей</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`delivery-btn ${deliveryMethod === 'pickup' ? 'active' : ''}`}
                  >
                    <span>Самовивіз Київ</span>
                  </button>
                </div>

                {deliveryMethod !== 'pickup' ? (
                  <>
                    <div className="form-group">
                      <label>Місто отримання</label>
                      <input
                        type="text"
                        placeholder="Київ / Львів / Одеса..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        {deliveryMethod === 'nova_poshta'
                          ? 'Номер відділення або поштомату'
                          : 'Адреса доставки (Вулиця, будинок, квартира)'}
                      </label>
                      <input
                        type="text"
                        placeholder={
                          deliveryMethod === 'nova_poshta'
                            ? 'Відділення № 45'
                            : 'вул. Хрещатик, 10, кв. 14'
                        }
                        value={warehouse}
                        onChange={(e) => setWarehouse(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </>
                ) : (
                  <div className="pickup-notice">
                    <p>
                      <strong>Адреса ростерії:</strong> м. Київ, вул. Рейтарська, 15 (щодня з 09:00 до 20:00).
                      Свіжий фільтр у подарунок при самовивозі!
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Payment & Order Summary */}
              <div className="form-right-col">
                <h4 className="section-title">3. Оплата</h4>

                <div className="payment-options">
                  <label className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <div className="pay-content">
                      <CreditCard size={18} className="gold-icon" />
                      <div>
                        <strong>Apple Pay / Google Pay / Картка</strong>
                        <p>Миттєва безпечна онлайн-оплата</p>
                      </div>
                    </div>
                  </label>

                  <label className={`payment-card ${paymentMethod === 'cod' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <div className="pay-content">
                      <Truck size={18} className="gold-icon" />
                      <div>
                        <strong>Оплата при отриманні</strong>
                        <p>Післяплата у відділенні перевізника</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="form-group margin-top">
                  <label>Коментар до замовлення (необов'язково)</label>
                  <textarea
                    rows={2}
                    placeholder="Особливі побажання щодо дати відправки тощо..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="form-input textarea"
                  />
                </div>

                {/* Summary Box */}
                <div className="checkout-summary-box">
                  <div className="summary-row">
                    <span>Позицій у замовленні:</span>
                    <span>{items.reduce((c, i) => c + i.quantity, 0)} шт</span>
                  </div>
                  <div className="summary-row">
                    <span>Доставка:</span>
                    <span>{totalAmount >= 1200 ? 'Безкоштовно' : 'За тарифами НП'}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Разом до сплати:</span>
                    <span className="total-gold">{formatPrice(totalAmount)}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary full-width"
                  >
                    {isSubmitting ? 'Обробка замовлення...' : `Підтвердити (${formatPrice(totalAmount)})`}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .checkout-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.82);
          backdrop-filter: blur(10px);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .checkout-modal {
          max-width: 820px;
          width: 100%;
          background: #140E0A;
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-lg);
          padding: 36px;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95);
        }

        .modal-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          margin-bottom: 26px;
        }

        .brand-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          color: var(--accent-gold);
          letter-spacing: 0.14em;
          font-weight: 600;
        }

        .modal-close {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .modal-close:hover {
          color: #FFFFFF;
          border-color: var(--accent-gold);
        }

        .form-sections-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
        }

        .section-title {
          font-size: 0.96rem;
          color: #FAF6F0;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 16px;
        }

        .section-title.margin-top {
          margin-top: 24px;
        }

        .form-group {
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .form-input {
          padding: 10px 14px;
          background: rgba(26, 18, 13, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: #FAF6F0;
          font-size: 0.88rem;
          outline: none;
        }

        .form-input:focus {
          border-color: var(--accent-gold);
        }

        .form-input.textarea {
          resize: none;
        }

        .delivery-methods-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }

        .delivery-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 10px 6px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.72rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .delivery-btn.active {
          background: rgba(223, 183, 117, 0.15);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
          font-weight: 600;
        }

        .pickup-notice {
          padding: 14px;
          background: rgba(223, 183, 117, 0.08);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          color: #E2D7CC;
          line-height: 1.5;
        }

        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .payment-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(26, 18, 13, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .payment-card.active {
          border-color: var(--accent-gold);
          background: rgba(42, 28, 20, 0.7);
        }

        .pay-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pay-content strong {
          font-size: 0.84rem;
          color: #FAF6F0;
          display: block;
        }

        .pay-content p {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .checkout-summary-box {
          margin-top: 24px;
          background: rgba(14, 9, 6, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.84rem;
          color: var(--text-secondary);
        }

        .summary-row.total {
          font-size: 1.05rem;
          font-weight: 600;
          color: #FAF6F0;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 8px;
        }

        .total-gold {
          color: var(--accent-gold);
          font-size: 1.25rem;
          font-family: var(--font-serif);
          font-weight: 700;
        }

        .full-width {
          width: 100%;
        }

        /* Success Screen */
        .success-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px 10px;
        }

        .success-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(59, 122, 87, 0.15);
          border: 1px solid rgba(59, 122, 87, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .success-icon {
          color: #3B7A57;
        }

        .success-title {
          font-size: 1.8rem;
          color: #FAF6F0;
          margin-bottom: 8px;
        }

        .order-id-tag {
          font-size: 1rem;
          color: var(--accent-gold);
          margin-bottom: 16px;
        }

        .success-text {
          font-size: 0.92rem;
          color: var(--text-secondary);
          max-width: 520px;
          line-height: 1.6;
          margin-bottom: 26px;
        }

        .order-receipt-box {
          width: 100%;
          max-width: 500px;
          background: rgba(14, 9, 6, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 20px;
          margin-bottom: 28px;
          text-align: left;
        }

        .receipt-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-gold);
          margin-bottom: 12px;
        }

        .receipt-items {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 12px;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .receipt-price {
          color: #FAF6F0;
          font-weight: 500;
        }

        .receipt-total {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          font-weight: 600;
          color: #FAF6F0;
        }

        @media (max-width: 768px) {
          .form-sections-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .checkout-modal {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { CoffeeBeanIcon } from './icons/CoffeeBeanIcon';
import { COFFEE_PRODUCTS } from '../data/coffeeData';
import { Send, CheckCircle2, Phone, Mail, User, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface ContactManagerSectionProps {
  selectedCoffeeId: string;
  onCoffeeChange: (id: string) => void;
}

const COUNTRY_CODES = [
  { code: '+380', country: 'Україна', flag: '🇺🇦' },
  { code: '+48', country: 'Польща', flag: '🇵🇱' },
  { code: '+49', country: 'Німеччина', flag: '🇩🇪' },
  { code: '+1', country: 'США / Канада', flag: '🇺🇸' },
  { code: '+44', country: 'Велика Британія', flag: '🇬🇧' },
  { code: '+420', country: 'Чехія', flag: '🇨🇿' },
  { code: '+40', country: 'Румунія', flag: '🇷🇴' },
  { code: '+373', country: 'Молдова', flag: '🇲🇩' },
  { code: '+370', country: 'Литва', flag: '🇱🇹' },
  { code: '+371', country: 'Латвія', flag: '🇱🇻' },
  { code: '+372', country: 'Естонія', flag: '🇪🇪' },
  { code: '+39', country: 'Італія', flag: '🇮🇹' },
  { code: '+34', country: 'Іспанія', flag: '🇪🇸' },
  { code: '+33', country: 'Франція', flag: '🇫🇷' },
];

export default function ContactManagerSection({
  selectedCoffeeId,
  onCoffeeChange,
}: ContactManagerSectionProps) {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+380');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      alert('Будь ласка, заповніть усі обов’язкові поля');
      return;
    }

    const selectedProduct = COFFEE_PRODUCTS.find((p) => p.id === selectedCoffeeId);
    const coffeeName =
      selectedCoffeeId === 'degustation-set'
        ? 'Дегустаційний набір (6 сортів по 100г)'
        : selectedCoffeeId === 'manager-consult'
        ? 'Консультація сомельє для вибору'
        : selectedProduct
        ? `${selectedProduct.name.replace('AURA NOIR', 'GOLD')} (${selectedProduct.tagline})`
        : 'Сорт не обрано';

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: `${countryCode} ${phone}`,
          email,
          coffeeName,
          message,
        }),
      });

      if (!res.ok) {
        throw new Error('Помилка сервера');
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Помилка відправки форми:', err);
      // Fallback: все одно відображаємо екран успіху для демонстрації в портфоліо
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setIsSubmitted(false);
  };

  return (
    <section className="section-wrapper bg-[#0E0A07]" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-head">
          <div className="section-badge">
            <CoffeeBeanIcon size={14} />
            <span>ПРЯМИЙ ЗВ&apos;ЯЗОК З РОСТЕРІЄЮ</span>
          </div>
          <h2 className="section-title">
            ЗВ&apos;ЯЗАТИСЯ З <span className="text-gold-gradient">МЕНЕДЖЕРОМ ПОСТАЧАННЯ</span>
          </h2>
          <p className="section-subtitle">
            Залиште заявку на дегустаційний сет, роздрібну партію або регулярне постачання
            для кав’ярні, ресторану чи офісу. Менеджер зв&apos;яжеться з вами протягом 15 хвилин.
          </p>
        </div>

        {/* Warning Notice Banner */}
        <div className="max-w-3xl mx-auto mb-6 p-4 sm:p-5 rounded-2xl bg-[#DFB775]/10 border border-[#DFB775]/30 flex items-start gap-3.5 text-xs sm:text-sm text-[#F6DDB2] shadow-lg">
          <AlertCircle size={20} className="text-[#DFB775] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#FAF6F0] font-semibold block mb-0.5">Увага! Демонстраційний режим:</strong>
            Дана форма відправляє лист із даними на вказану вами пошту для демонстрації її функцій, не поширюйте чутливої інформації про себе або інших. Даний сайт є демонстраційним зразком, він нічого не продає та не пропонує користувачам.
          </p>
        </div>

        {/* Fully responsive form wrapper */}
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-7 md:p-10 glass-panel">
          {isSubmitted ? (
            <div className="flex flex-col items-center text-center py-6 px-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center mb-5 text-emerald-400">
                <CheckCircle2 size={44} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#FAF6F0] mb-3">
                Заявку успішно прийнято!
              </h3>
              <p className="text-[#C4B5A5] text-sm sm:text-base max-w-lg leading-relaxed mb-4">
                Дякуємо, <strong className="text-[#FAF6F0]">{name}</strong>. На вказану вами пошту <strong className="text-[#DFB775]">{email}</strong> надіслано лист із деталями вашого тестового замовлення.
              </p>

              {/* Prominent Spam Warning Banner */}
              <div className="w-full max-w-lg mb-6 p-4 sm:p-5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3.5 text-left shadow-lg">
                <AlertCircle size={22} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-amber-300 font-semibold block mb-1 text-sm sm:text-base">
                    Перевірте вашу поштову скриньку:
                  </strong>
                  <span>Якщо ви не бачите свого листа у поштовій скриньці перевірте у спамі, можливо він випадково потрапив туди.</span>
                </div>
              </div>

              <p className="text-[#877667] text-xs max-w-md mb-6 leading-relaxed">
                Даний сайт є демонстраційним зразком, він нічого не продає та не пропонує користувачам.
              </p>
              <div className="bg-[#0E0906]/70 border border-[#DFB775]/20 rounded-xl p-4 sm:p-5 w-full max-w-md text-left mb-6 flex flex-col gap-2.5 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row justify-between gap-1 text-[#C4B5A5]">
                  <span>Обраний сорт:</span>
                  <strong className="text-[#DFB775]">
                    {COFFEE_PRODUCTS.find((p) => p.id === selectedCoffeeId)?.name.replace('AURA NOIR', 'GOLD') || 'Дегустаційний набір'}
                  </strong>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-1 text-[#C4B5A5]">
                  <span>Email для КП:</span>
                  <strong className="text-[#FAF6F0]">{email}</strong>
                </div>
              </div>
              <button onClick={handleReset} className="btn-secondary">
                <span>Надіслати ще один запит</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-5 sm:mb-6">
                {/* 1. Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="customer-name" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C4B5A5]">
                    <User size={14} className="text-[#DFB775]" />
                    <span>Ваше ім’я *</span>
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    placeholder="Олександр Коваль"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0E0906]/80 border border-[#DFB775]/20 focus:border-[#DFB775] rounded-xl text-[#FAF6F0] p-3 text-sm outline-none transition-colors"
                  />
                </div>

                {/* 2. Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="customer-email" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C4B5A5]">
                    <Mail size={14} className="text-[#DFB775]" />
                    <span>Електронна пошта *</span>
                  </label>
                  <input
                    id="customer-email"
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0E0906]/80 border border-[#DFB775]/20 focus:border-[#DFB775] rounded-xl text-[#FAF6F0] p-3 text-sm outline-none transition-colors"
                  />
                </div>

                {/* 3. Phone Number with Country Code Dropdown */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                  <label htmlFor="customer-phone" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C4B5A5]">
                    <Phone size={14} className="text-[#DFB775]" />
                    <span>Номер телефону *</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full sm:w-48 shrink-0 bg-[#0E0906]/90 border border-[#DFB775]/20 focus:border-[#DFB775] rounded-xl text-[#DFB775] font-semibold p-3 text-xs sm:text-sm outline-none cursor-pointer"
                      aria-label="Код країни"
                    >
                      {COUNTRY_CODES.map((item) => (
                        <option key={item.code} value={item.code} className="bg-[#18110D] text-[#FAF6F0]">
                          {item.flag} {item.code} ({item.country})
                        </option>
                      ))}
                    </select>
                    <input
                      id="customer-phone"
                      type="tel"
                      required
                      placeholder="67 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full flex-1 bg-[#0E0906]/80 border border-[#DFB775]/20 focus:border-[#DFB775] rounded-xl text-[#FAF6F0] p-3 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 4. Coffee Variety Selector - Made 100% Adaptive */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-2 w-full max-w-full min-w-0">
                  <label htmlFor="coffee-selector" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C4B5A5]">
                    <CoffeeBeanIcon size={14} className="text-[#DFB775]" />
                    <span>Оберіть сорт кави *</span>
                  </label>
                  <div className="relative w-full max-w-full">
                    <select
                      id="coffee-selector"
                      value={selectedCoffeeId}
                      onChange={(e) => onCoffeeChange(e.target.value)}
                      className="w-full max-w-full bg-[#0E0906]/90 border border-[#DFB775]/25 focus:border-[#DFB775] rounded-xl text-[#FAF6F0] p-3 sm:p-3.5 text-xs sm:text-sm outline-none cursor-pointer truncate pr-8"
                    >
                      <option value="degustation-set" className="bg-[#18110D] text-[#FAF6F0]">
                        ★ Дегустаційний набір (Усі 6 сортів у пробниках по 100г)
                      </option>
                      {COFFEE_PRODUCTS.map((p) => (
                        <option key={p.id} value={p.id} className="bg-[#18110D] text-[#FAF6F0]">
                          {p.name.replace('AURA NOIR', 'GOLD')} — {p.tagline} ({p.origin}, {p.roastName.split('/')[0]})
                        </option>
                      ))}
                      <option value="manager-consult" className="bg-[#18110D] text-[#FAF6F0]">
                        ? Мені потрібна консультація сомельє для вибору
                      </option>
                    </select>
                  </div>
                </div>

                {/* 5. Comment / Volume (optional) */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                  <label htmlFor="customer-comment" className="text-xs font-semibold uppercase tracking-wider text-[#C4B5A5]">
                    Побажання щодо фасування чи об’єму (необов&apos;язково)
                  </label>
                  <textarea
                    id="customer-comment"
                    rows={3}
                    placeholder="Наприклад: цікавить постачання 5 кг на тиждень для кав'ярні у Львові..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#0E0906]/80 border border-[#DFB775]/20 focus:border-[#DFB775] rounded-xl text-[#FAF6F0] p-3 text-sm outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Submit & Guarantees */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto btn-primary px-8 py-3.5"
                >
                  <Send size={15} />
                  <span>{isSubmitting ? 'Надсилаємо заявку...' : 'Надіслати запит менеджеру'}</span>
                </button>

                <div className="flex items-center gap-4 text-xs text-[#877667]">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-[#DFB775]" />
                    <span>Відповідь за 15 хв</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-[#DFB775]" />
                    <span>Конфіденційно</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

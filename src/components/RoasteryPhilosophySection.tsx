'use client';

import React from 'react';
import { HeartHandshake, Flame, Clock, Recycle, ShieldCheck } from 'lucide-react';
import { CoffeeBeanIcon } from './icons/CoffeeBeanIcon';

export default function RoasteryPhilosophySection() {
  const pillars = [
    {
      icon: <HeartHandshake size={24} className="text-[#DFB775]" />,
      tag: 'DIRECT TRADE',
      title: 'Прямий контакт з плантаціями',
      desc: 'Купуємо зерно безпосередньо у фермерів мікролотів, сплачуючи на 45% більше за біржовий рівень цін для підтримки сталих практик.',
    },
    {
      icon: <Flame size={24} className="text-[#DFB775]" />,
      tag: 'CAST-IRON ROASTING',
      title: 'Чавунний ростер Giesen W15A',
      desc: 'Подвійний чавунний барабан забезпечує стабільну термоінерцію та плавно карамелізує натуральні цукри зерна.',
    },
    {
      icon: <Clock size={24} className="text-[#DFB775]" />,
      tag: 'PEAK 48 HOURS',
      title: 'Відправка за 48 годин після купінгу',
      desc: 'Обсмажуємо зерно під замовлення щовівторка та щоп’ятниці. Ви отримуєте свіжий лот в ідеальному вікні дегазації.',
    },
    {
      icon: <Recycle size={24} className="text-[#DFB775]" />,
      tag: 'AROMALOCK™ TECH',
      title: '100% захист від кисню та світла',
      desc: 'Багатошаровий бар’єрний матеріал з японським одностороннім клапаном випускає CO2, зберігаючи леткі ароматичні сполуки.',
    },
  ];

  return (
    <section className="section-wrapper bg-[#130E0A]/40" id="philosophy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-head">
          <div className="section-badge">
            <CoffeeBeanIcon size={14} />
            <span>СТАНДАРТИ ЯКОСТІ SCA</span>
          </div>
          <h2 className="section-title">
            ФІЛОСОФІЯ ТА <span className="text-gold-gradient">БЕЗКОМПРОМІСНИЙ КРАФТ</span>
          </h2>
          <p className="section-subtitle">
            Ми не віримо в комерційну масову каву. Кожне зерно Gold Coffee Beans — це синергія
            природного терруару, поваги до праці фермера та прецизійного термопрофілю.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {pillars.map((p, idx) => (
            <div key={idx} className="glass-panel glass-panel-hover p-5 sm:p-6 flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-[#DFB775]/10 border border-[#DFB775]/25 flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <span className="text-[10px] font-bold tracking-widest text-[#DFB775] mb-2 uppercase">
                {p.tag}
              </span>
              <h3 className="font-serif text-base sm:text-lg text-[#FAF6F0] mb-2 leading-snug">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#C4B5A5] leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Sensory Manifesto Banner */}
        <div className="glass-panel p-5 sm:p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 border-[#DFB775]/25">
          <div className="flex items-center gap-4 text-left">
            <ShieldCheck size={36} className="text-[#DFB775] shrink-0" />
            <div>
              <h4 className="font-serif text-base sm:text-lg text-[#FAF6F0] mb-1">
                Гарантія свіжості та смаку 100%
              </h4>
              <p className="text-xs sm:text-sm text-[#C4B5A5] leading-relaxed">
                Якщо смаковий профіль кави не відповідатиме заявленим дескрипторам у вашому методі приготування — ми безкоштовно замінимо пачку або повернемо кошти.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center shrink-0 py-2 px-5 rounded-xl bg-[#DFB775]/10 border border-[#DFB775]/35 text-center">
            <span className="font-serif font-bold text-xl sm:text-2xl text-[#DFB775]">88+ SCA</span>
            <span className="text-[10px] tracking-wider text-[#C4B5A5] uppercase">SPECIALTY ONLY</span>
          </div>
        </div>
      </div>
    </section>
  );
}

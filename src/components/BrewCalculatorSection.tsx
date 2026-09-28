'use client';

import React, { useState, useEffect } from 'react';
import { BREW_GUIDES } from '../data/coffeeData';
import { Play, Pause, RotateCcw, Clock, Thermometer, Sliders, CheckCircle2 } from 'lucide-react';

export default function BrewCalculatorSection() {
  const [selectedMethodId, setSelectedMethodId] = useState('v60');
  const [coffeeGrams, setCoffeeGrams] = useState(18);

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const activeGuide =
    BREW_GUIDES.find((g) => g.id === selectedMethodId) || BREW_GUIDES[0];

  // Recalculate water ml dynamically
  const waterMl = Math.round(coffeeGrams * activeGuide.ratioMultiplier);

  // Reset timer on method change
  const handleSelectMethod = (id: string) => {
    setSelectedMethodId(id);
    const guide = BREW_GUIDES.find((g) => g.id === id);
    if (guide) {
      setCoffeeGrams(guide.defaultCoffeeGrams);
    }
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  return (
    <section className="brew-section" id="brew-guide">
      <div className="container">
        {/* Section Header */}
        <div className="section-head">
          <div className="head-badge">
            <Sliders size={14} className="gold-icon" />
            <span>РИТУАЛ ЕКСТРАКЦІЇ</span>
          </div>
          <h2 className="section-title">
            ІНТЕРАКТИВНИЙ КАЛЬКУЛЯТОР <br />
            <span className="text-gold-gradient">ТА РИТУАЛ ЗАВАРЮВАННЯ</span>
          </h2>
          <p className="section-subtitle">
            Золотий перетин екстракції: пропорції, температура води та точний таймер
            для кожного альтернативного методу.
          </p>

          {/* Brew Method Tabs */}
          <div className="method-tabs">
            {BREW_GUIDES.map((guide) => (
              <button
                key={guide.id}
                onClick={() => handleSelectMethod(guide.id)}
                className={`method-tab ${selectedMethodId === guide.id ? 'active' : ''}`}
              >
                <span>{guide.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Calculator and Steps Grid */}
        <div className="brew-grid">
          {/* Left: Dynamic Ratio & Settings */}
          <div className="brew-settings-card glass-panel">
            <div className="method-intro">
              <h3 className="intro-title">{activeGuide.name}</h3>
              <p className="intro-subtitle">{activeGuide.subtitle}</p>
            </div>

            {/* Slider: Coffee grams */}
            <div className="control-slider-box">
              <div className="slider-label-row">
                <span className="slider-label">Кількість кави:</span>
                <span className="slider-value">{coffeeGrams} г</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                step="1"
                value={coffeeGrams}
                onChange={(e) => setCoffeeGrams(Number(e.target.value))}
                className="range-input"
              />
              <div className="slider-ticks">
                <span>10г (1 чашка)</span>
                <span>20г (2 чашки)</span>
                <span>35г+ (Сервер)</span>
              </div>
            </div>

            {/* Parameters Grid */}
            <div className="params-matrix">
              <div className="param-cell">
                <span className="param-lbl">Вода (90–95°C):</span>
                <span className="param-val text-gold">{waterMl} мл</span>
              </div>
              <div className="param-cell">
                <span className="param-lbl">Пропорція:</span>
                <span className="param-val">{activeGuide.ratio}</span>
              </div>
              <div className="param-cell">
                <div className="cell-header">
                  <Thermometer size={14} className="icon-gold" />
                  <span className="param-lbl">Температура води:</span>
                </div>
                <span className="param-val">{activeGuide.waterTempC}°C</span>
              </div>
              <div className="param-cell">
                <span className="param-lbl">Рекомендований помел:</span>
                <span className="param-val small">{activeGuide.grindSize}</span>
              </div>
            </div>

            {/* Stopwatch Widget */}
            <div className="timer-box">
              <div className="timer-display-row">
                <Clock size={20} className="icon-gold" />
                <span className="timer-digits">{formatTimer(timerSeconds)}</span>
                <span className="timer-target">/ {formatTimer(activeGuide.totalTimeSec)}</span>
              </div>

              <div className="timer-buttons">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`btn-timer-toggle ${isTimerRunning ? 'running' : ''}`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause size={16} /> <span>Пауза</span>
                    </>
                  ) : (
                    <>
                      <Play size={16} /> <span>Почати таймер</span>
                    </>
                  )}
                </button>
                <button onClick={resetTimer} className="btn-timer-reset" title="Скинути">
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Step-by-Step Pouring Timeline */}
          <div className="brew-steps-card glass-panel">
            <h4 className="steps-header">Покроковий протокол заварювання</h4>

            <div className="steps-timeline">
              {activeGuide.steps.map((step, idx) => (
                <div key={idx} className="step-row">
                  <div className="step-time-badge">
                    <span>{step.time}</span>
                  </div>
                  <div className="step-content">
                    <h5 className="step-title">{step.title}</h5>
                    <p className="step-instruction">{step.instruction}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pro-tip-box">
              <CheckCircle2 size={16} className="tip-icon" />
              <span>
                <strong>Порада бариста:</strong> Використовуйте фільтровану або мінералізовану воду
                із загальною мінералізацією (TDS) 75–120 ppm для максимального розкриття квіткових нот.
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .brew-section {
          padding: 120px 0;
          background: transparent;
          position: relative;
          z-index: 1;
        }

        .section-head {
          text-align: center;
          max-width: 820px;
          margin: 0 auto 50px;
        }

        .head-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(223, 183, 117, 0.1);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--accent-gold);
          margin-bottom: 20px;
        }

        .section-title {
          font-size: clamp(2.1rem, 3.8vw, 3.2rem);
          line-height: 1.15;
          margin-bottom: 16px;
        }

        .section-subtitle {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 36px;
        }

        .method-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .method-tab {
          padding: 10px 22px;
          background: rgba(26, 18, 13, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .method-tab:hover {
          color: #FAF6F0;
          border-color: var(--accent-gold);
        }

        .method-tab.active {
          background: var(--accent-gold);
          color: #0E0906;
          border-color: var(--accent-gold);
          font-weight: 600;
        }

        /* Grid */
        .brew-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 36px;
        }

        .brew-settings-card,
        .brew-steps-card {
          padding: 36px;
          border-radius: var(--radius-lg);
        }

        .intro-title {
          font-size: 1.5rem;
          color: #FAF6F0;
          margin-bottom: 4px;
        }

        .intro-subtitle {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 26px;
        }

        /* Slider */
        .control-slider-box {
          background: rgba(14, 9, 6, 0.5);
          padding: 20px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .slider-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .slider-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--accent-gold);
          font-family: var(--font-serif);
        }

        .range-input {
          width: 100%;
          height: 6px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          accent-color: var(--accent-gold);
          cursor: pointer;
        }

        .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 8px;
        }

        /* Parameters */
        .params-matrix {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }

        .param-cell {
          background: rgba(26, 18, 13, 0.5);
          border: 1px solid var(--border-subtle);
          padding: 14px;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cell-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .icon-gold {
          color: var(--accent-gold);
        }

        .param-lbl {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .param-val {
          font-size: 1.15rem;
          font-weight: 600;
          color: #FAF6F0;
        }

        .param-val.text-gold {
          color: var(--accent-gold);
        }

        .param-val.small {
          font-size: 0.88rem;
          font-weight: 400;
          color: var(--text-secondary);
        }

        /* Timer */
        .timer-box {
          background: linear-gradient(135deg, rgba(32, 22, 16, 0.9) 0%, rgba(18, 13, 9, 0.9) 100%);
          border: 1px solid var(--border-accent);
          padding: 20px 24px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .timer-display-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .timer-digits {
          font-size: 2rem;
          font-family: monospace;
          font-weight: 700;
          color: #FAF6F0;
          letter-spacing: 0.05em;
        }

        .timer-target {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .timer-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-timer-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: var(--accent-gold);
          color: #0E0906;
          border: none;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-timer-toggle.running {
          background: #B35431;
          color: #FFFFFF;
        }

        .btn-timer-reset {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* Steps */
        .steps-header {
          font-size: 1.15rem;
          color: #FAF6F0;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .steps-timeline {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 28px;
        }

        .step-row {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 16px;
          align-items: flex-start;
        }

        .step-time-badge {
          padding: 6px 10px;
          background: rgba(223, 183, 117, 0.12);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--accent-gold);
          text-align: center;
          font-family: monospace;
        }

        .step-title {
          font-size: 0.95rem;
          color: #FAF6F0;
          margin-bottom: 4px;
        }

        .step-instruction {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.55;
        }

        .pro-tip-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 18px;
          background: rgba(59, 122, 87, 0.12);
          border: 1px solid rgba(59, 122, 87, 0.25);
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          color: #E2D7CC;
          line-height: 1.5;
        }

        .tip-icon {
          color: #3B7A57;
          flex-shrink: 0;
          margin-top: 2px;
        }

        @media (max-width: 900px) {
          .brew-grid {
            grid-template-columns: 1fr;
          }
          .brew-settings-card,
          .brew-steps-card {
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
}

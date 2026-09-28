'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CatalogSection from '../components/CatalogSection';
import RoasteryPhilosophySection from '../components/RoasteryPhilosophySection';
import ReviewsSection from '../components/ReviewsSection';
import ContactManagerSection from '../components/ContactManagerSection';
import Footer from '../components/Footer';

export default function Home() {
  const [selectedCoffeeId, setSelectedCoffeeId] = useState('degustation-set');

  // Scroll to catalog section
  const handleExploreClick = () => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to contact form
  const handleContactClick = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When "Замовити" is clicked on a coffee card in the catalog:
  // Auto-selects that coffee variety in the form and smooth-scrolls down to the form
  const handleOrderCoffee = (productId: string) => {
    setSelectedCoffeeId(productId);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0806] text-[#FAF6F0] relative">
      {/* Navigation Header */}
      <Header onContactClick={handleContactClick} />

      {/* Main Content */}
      <main>
        {/* Hero Section with Video that plays once on load and halts on completion */}
        <HeroSection
          onExploreClick={handleExploreClick}
          onContactClick={handleContactClick}
        />

        {/* Minimalist Catalog of Coffee Varieties */}
        <CatalogSection onOrderClick={handleOrderCoffee} />

        {/* Roastery Craft & Giesen Standards */}
        <RoasteryPhilosophySection />

        {/* Q-Grader Verdicts & Reviews */}
        <ReviewsSection />

        {/* Supply Manager Contact Form */}
        <ContactManagerSection
          selectedCoffeeId={selectedCoffeeId}
          onCoffeeChange={setSelectedCoffeeId}
        />
      </main>

      {/* Luxury Footer */}
      <Footer />
    </div>
  );
}

import React from 'react';
import Header from './layout/Header';
import { Hero, Benefits, Programs, Testimonials, Location, FAQ, Quiz, CTA } from './sections';
import { Footer } from './layout/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#FEFEFE]">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Programs />
        <Testimonials />
        <Location />
        <FAQ />
        <Quiz />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
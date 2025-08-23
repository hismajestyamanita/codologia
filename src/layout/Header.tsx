import React, { useState, useEffect } from 'react';
import { Code, Menu, X } from 'lucide-react';

import UnifiedSignupModal from '../shared/UnifiedSignupModal';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUnifiedSignupModal, setShowUnifiedSignupModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    closeMobileMenu();
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 60; // Высота хедера + отступ
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    closeMobileMenu();
  };

  const openUnifiedSignupModal = () => {
    setShowUnifiedSignupModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeUnifiedSignupModal = () => {
    setShowUnifiedSignupModal(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <header className="w-full fixed top-0 z-50 transition-all duration-500 ease-in-out px-4 pt-4">
      <div className={`mx-auto transition-all duration-500 ease-in-out ${
        isScrolled ? 'max-w-4xl' : 'max-w-6xl'
      }`}>
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg px-8 py-4">
        <nav className="flex items-center justify-between">
          <button onClick={scrollToTop} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-brand-blue rounded-medium flex items-center justify-center shadow-lg">
              <Code className="w-6 h-6 text-white" aria-label="Логотип школы программирования Кодология" />
            </div>
            <span className="text-2xl font-bold text-brand-black" aria-label="Кодология - школа программирования для детей в Архангельске">Кодология</span>
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-brand-black/80 hover:text-brand-blue transition-all duration-300 font-medium"
            >
              О школе
            </button>
            <button 
              onClick={() => scrollToSection('programs')}
              className="text-brand-black/80 hover:text-brand-blue transition-all duration-300 font-medium"
            >
              Программы
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-brand-black/80 hover:text-brand-blue transition-all duration-300 font-medium"
            >
              Отзывы
            </button>
            <button 
              onClick={() => scrollToSection('contacts')}
              className="text-brand-black/80 hover:text-brand-blue transition-all duration-300 font-medium"
            >
              Контакты
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-brand-black" />
            ) : (
              <Menu className="w-6 h-6 text-brand-black" />
            )}
          </button>

          {/* Desktop CTA Button */}
          <button 
            onClick={openUnifiedSignupModal}
            className="hidden lg:block relative overflow-hidden bg-brand-blue/90 backdrop-blur-sm text-brand-white px-6 py-3 rounded-full hover:bg-brand-blue transition-all duration-300 font-medium border border-brand-white/20 shadow-lg shadow-brand-blue/50"
            style={{
              boxShadow: '0 0 20px rgb(61 157 242), 0 0 40px rgb(61 157 242 / 30%)'
            }}
          >
            <span className="relative z-10">Записаться</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white/30 to-transparent w-full h-full -translate-x-full animate-shimmer"></div>
          </button>
        </nav>
        </div>
      </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={closeMobileMenu}
        >
          <div 
            className="fixed top-0 left-0 right-0 bg-white/20 backdrop-blur-md border-b border-white/30 shadow-2xl transform transition-transform duration-500 ease-out animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-20 pb-8 px-8 rounded-b-3xl" style={{ paddingTop: '90px' }}>
              <nav className="space-y-6">
                <button 
                  onClick={() => scrollToSection('about')}
                  className="block w-full text-center text-xl font-medium text-white hover:text-brand-blue transition-colors py-4 border-b border-white/20"
                >
                  О школе
                </button>
                <button 
                  onClick={() => scrollToSection('programs')}
                  className="block w-full text-center text-xl font-medium text-white hover:text-brand-blue transition-colors py-4 border-b border-white/20"
                >
                  Программы
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="block w-full text-center text-xl font-medium text-white hover:text-brand-blue transition-colors py-4 border-b border-white/20"
                >
                  Отзывы
                </button>
                <button 
                  onClick={() => scrollToSection('contacts')}
                  className="block w-full text-center text-xl font-medium text-white hover:text-brand-blue transition-colors py-4 border-b border-white/20"
                >
                  Контакты
                </button>
                
                <button 
                  onClick={openUnifiedSignupModal}
                  className="w-full mt-8 relative overflow-hidden bg-brand-blue/90 backdrop-blur-sm text-brand-white px-6 py-4 rounded-full hover:bg-brand-blue transition-all duration-300 font-medium shadow-lg border border-brand-white/20"
                >
                  <span className="relative z-10">Записаться</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white/30 to-transparent w-full h-full -translate-x-full animate-shimmer"></div>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Unified Signup Modal */}
      {showUnifiedSignupModal && (
        <UnifiedSignupModal onClose={closeUnifiedSignupModal} />
      )}
    </>
  );
};

export default Header;
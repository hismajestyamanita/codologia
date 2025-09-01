import React, { useState } from 'react';
import { ArrowRight, Phone, Clock } from 'lucide-react';
import UnifiedSignupModal from '../shared/UnifiedSignupModal';
import sendLead from '../shared/sendLead';
import { useScrollAnimation, useStaggeredAnimation } from '../shared/hooks/useScrollAnimation';

const CTA = () => {
  const [showUnifiedSignupModal, setShowUnifiedSignupModal] = useState(false);
  const titleAnimation = useScrollAnimation({ delay: 0 });
  const subtitleAnimation = useScrollAnimation({ delay: 200 });
  const { containerRef: featuresRef, visibleItems: visibleFeatures } = useStaggeredAnimation(3, 400, 150);
  const buttonsAnimation = useScrollAnimation({ delay: 800 });

  const openUnifiedSignupModal = () => {
    setShowUnifiedSignupModal(true);
    document.body.style.overflowY = 'hidden';
  };

  const closeUnifiedSignupModal = () => {
    setShowUnifiedSignupModal(false);
    document.body.style.overflowY = '';
  };

  return (
    <>
      <section id="cta" className="w-full bg-gradient-to-br from-brand-green to-accent-lightGreen flex flex-col">
        {/* Белый прямоугольник сверху */}
        <div className="w-full h-16 bg-brand-white rounded-b-[64px] shadow-lg"></div>
        
        {/* Content контейнер */}
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-16 flex flex-col gap-6 text-center">
          <h2 
            ref={titleAnimation.ref as React.RefObject<HTMLHeadingElement>}
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-brand-black animate-on-scroll-large ${titleAnimation.isVisible ? 'visible' : ''}`}
          >
            Начните с{' '}
            <span className="text-brand-white">бесплатного занятия</span>{' '}
            — ничего не теряете
          </h2>
          
          <p 
            ref={subtitleAnimation.ref as React.RefObject<HTMLParagraphElement>}
            className={`text-lg sm:text-xl text-brand-black max-w-2xl mx-auto opacity-90 animate-on-scroll ${subtitleAnimation.isVisible ? 'visible' : ''}`}
          >
            Первое занятие — полностью бесплатно, без скрытых платежей и обязательств. Свяжемся в течение рабочего дня.
          </p>

          <div 
            ref={featuresRef as React.RefObject<HTMLDivElement>}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className={`flex items-center justify-center gap-3 text-brand-black animate-on-scroll ${visibleFeatures[0] ? 'visible' : ''}`}>
              <Clock className="w-6 h-6" />
              <span className="font-medium">90 минут</span>
            </div>
            <div className={`flex items-center justify-center gap-3 text-brand-black animate-on-scroll ${visibleFeatures[1] ? 'visible' : ''}`}>
              <Phone className="w-6 h-6" />
              <span className="font-medium">Бесплатно</span>
            </div>
            <div className={`flex items-center justify-center gap-3 text-brand-black animate-on-scroll ${visibleFeatures[2] ? 'visible' : ''}`}>
              <ArrowRight className="w-6 h-6" />
              <span className="font-medium">Без обязательств</span>
            </div>
          </div>

          <div 
            ref={buttonsAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`flex flex-col sm:flex-row gap-6 justify-center animate-on-scroll ${buttonsAnimation.isVisible ? 'visible' : ''}`}
          >
            <button 
              onClick={openUnifiedSignupModal}
              className="relative overflow-hidden bg-brand-black text-brand-white px-8 py-4 rounded-small hover:bg-gray-800 hover:scale-105 hover:shadow-2xl hover:shadow-brand-black/50 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2 group"
              style={{
                boxShadow: '0 0 20px rgb(1 6 12 / 30%), 0 0 40px rgb(1 6 12 / 20%)'
              }}
            >
              <span className="relative z-10">Записаться сейчас</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              {/* Постоянный блик */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/20 to-transparent w-full h-full -translate-x-full animate-shimmer"></div>
              {/* Блик при наведении */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/40 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out transform -skew-x-12"></div>
              {/* Внутреннее свечение */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F23]/0 via-[#FFFFFF]/10 to-[#0F0F23]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button 
              onClick={() => {
                // Если мы на странице спасибо (showResults), сначала скрываем её
              const element = document.getElementById('quiz');
              if (element) {
                const headerHeight = 60;
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight;
                
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              }}}
              className="border-2 border-brand-black text-brand-black px-8 py-4 rounded-small hover:bg-brand-black hover:text-brand-white transition-colors font-semibold text-lg"
            >
              Подобрать программу
            </button>
          </div>

          <p className="text-sm text-brand-black opacity-75">
            * Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </div>
        
        {/* Место для фотографий - только для десктопа и планшета */}
        <div className="hidden md:block w-full">
          <div className="mx-auto px-16 -mt-10" style={{ width: 'min(100%, 1200px)' }}>
            <div className="grid grid-cols-2 gap-0">
              {/* Первая фотография */}
              <div className="aspect-[3/2] flex items-center justify-center overflow-hidden">
                <img 
                  src="/assets/img/08-cta/08-cta-boy-01.webp" 
                  alt="Ученик школы программирования Кодология за работой"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Вторая фотография */}
              <div className="aspect-[3/2] flex items-center justify-center overflow-hidden">
                <img 
                  src="/assets/img/08-cta/08-cta-boy-02.webp" 
                  alt="Студент изучает программирование в IT-школе Кодология"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Черный прямоугольник снизу */}
        <div className="w-full h-16 bg-brand-black rounded-t-[64px]"></div>
      </section>

      {showUnifiedSignupModal && (
        <UnifiedSignupModal onClose={closeUnifiedSignupModal} />
      )}
    </>
  );
};

export default CTA;

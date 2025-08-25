import React from 'react';
import { useState, useEffect } from 'react';
import { Gamepad2, Building, Clock, Heart } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../shared/hooks/useScrollAnimation';

const Benefits = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  
  const titleAnimation = useScrollAnimation({ delay: 0 });
  const { containerRef: cardsRef, visibleItems: visibleCards } = useStaggeredAnimation(4, 200, 150);

  const benefits = [
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "Без зубрёжки",
      description: "учим через игры, мемы и визуал",
      image: "/assets/img/02-benefits/02-benefits-card-01.webp"
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Модули как лего",
      description: "собираете то, что реально интересно",
      image: "/assets/img/02-benefits/02-benefits-card-02.webp"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Мягкий старт",
      description: "не перегружаем, 1 занятие в неделю",
      image: "/assets/img/02-benefits/02-benefits-card-03.webp"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Крутые проекты",
      description: "свои игры, приложения и сайты\n— которые реально работают и впечатляют",
      image: "/assets/img/02-benefits/02-benefits-card-04.webp"
    }
  ];

  // Автопрокрутка каждые 4 секунды
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % benefits.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, benefits.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % benefits.length);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + benefits.length) % benefits.length);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartY(touch.clientY);
    setCurrentY(touch.clientY);
    setIsDragging(true);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    setCurrentY(touch.clientY);
    const diffY = touch.clientY - startY;
    setTranslateY(diffY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diffY = currentY - startY;
    const threshold = 50;
    
    if (Math.abs(diffY) > threshold) {
      if (diffY > 0) {
        prevSlide(); // Свайп вниз - предыдущий слайд
      } else {
        nextSlide(); // Свайп вверх - следующий слайд
      }
    }
    
    setIsDragging(false);
    setTranslateY(0);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setStartY(e.clientY);
    setCurrentY(e.clientY);
    setIsDragging(true);
    setIsAutoPlaying(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    setCurrentY(e.clientY);
    const diffY = e.clientY - startY;
    setTranslateY(diffY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diffY = currentY - startY;
    const threshold = 50;
    
    if (Math.abs(diffY) > threshold) {
      if (diffY > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setIsDragging(false);
    setTranslateY(0);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      const diffY = currentY - startY;
      const threshold = 50;
      
      if (Math.abs(diffY) > threshold) {
        if (diffY > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      }
      
      setIsDragging(false);
      setTranslateY(0);
      setTimeout(() => setIsAutoPlaying(true), 8000);
    }
  };

  return (
    <section id="about" className="w-full bg-gray-50 flex flex-col">
      {/* Белый прямоугольник сверху - только на десктопе */}
      <div className="hidden md:block w-full h-16 bg-brand-white rounded-b-[64px] shadow-lg relative z-10"></div>
      
      {/* Content контейнер */}
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-16 flex flex-col gap-6">
        <div className="text-center mb-16">
        <div className="text-center mb-1 md:mb-4">
          <h2 
            ref={titleAnimation.ref as React.RefObject<HTMLHeadingElement>}
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-black animate-on-scroll-large ${titleAnimation.isVisible ? 'visible' : ''}`}
          >
            Чтобы ребёнок не просто учился, а{' '}
            <span className="text-brand-blue">ждал следующего занятия</span>
          </h2>
        </div>
        </div>

        {/* Мобильные карточки */}
        <div className="md:hidden relative overflow-visible -mx-8 mt-8" style={{ height: '280px' }}>
          <div 
            className={`flex flex-col transition-transform duration-700 ease-out ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} touch-pan-y select-none relative`}
            style={{
              transform: `translateY(calc(-${currentSlide * 180}px + 40px + ${translateY}px))`,
              transition: isDragging ? 'none' : 'transform 700ms ease-out'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {benefits.map((benefit, index) => {
              const distance = Math.abs(index - currentSlide);
              const isActive = index === currentSlide;
              const isVisible = distance <= 1;
              
              // Динамическое масштабирование и градиентная прозрачность
              let scale = 1;
              let opacity = 1;
              let blur = 'blur(0px)';
              let zIndex = 1;
              
              if (isActive) {
                scale = 1; // Центральная карточка
                opacity = 1; // Полная непрозрачность
                zIndex = 10;
              } else if (distance === 1) {
                scale = 0.85; // Соседние карточки
                opacity = 0.2; // Промежуточная прозрачность
                // Проверяем направление - верхняя или нижняя карточка
                if (index < currentSlide) {
                  opacity = 0.05; // Верхняя карточка - 5%
                } else {
                  opacity = 0.2; // Нижняя карточка - 20%
                }
              } else {
                scale = 0.7; // Дальние карточки
                opacity = 0.05; // Почти полная прозрачность
                zIndex = 1;
              }
              
              if (!isVisible) {
                opacity = 0; // Полная прозрачность для невидимых
              }
              
              return (
                <div 
                  key={`mobile-benefit-${index}`}
                  className="w-full flex-shrink-0 transition-all duration-700 ease-out absolute"
                  style={{
                    height: '160px',
                    top: `${index * 180}px`,
                    transform: `scale(${scale})`,
                    opacity,
                    filter: blur,
                    zIndex,
                    transformOrigin: 'center center'
                  }}
                >
                  <div style={{ paddingLeft: '15px', paddingRight: '15px', height: '160px' }}>
                    <div className={`group bg-[#FEFEFE] rounded-3xl transition-all duration-500 overflow-hidden relative h-full ${
                      isActive 
                        ? 'shadow-2xl' 
                        : 'shadow-lg'
                    }`}>
                      {/* Изображение */}
                      <div className="relative h-full overflow-hidden">
                        <img 
                          src={benefit.image} 
                          alt={`${benefit.title} - курсы программирования для детей в Архангельске, обучение ${benefit.title.toLowerCase()}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-black/50"></div>
                      </div>
                      
                      {/* Контент */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="text-brand-blue mb-3 drop-shadow-lg">
                          {benefit.icon}
                        </div>
                        
                        <h3 className="text-lg font-bold text-white mb-2 drop-shadow-lg">
                          {benefit.title}
                        </h3>
                        <p className="text-white/90 leading-relaxed drop-shadow-lg text-sm">
                          {benefit.description.includes('\n') 
                            ? benefit.description.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                  {line}
                                  {index < benefit.description.split('\n').length - 1 && <br />}
                                </React.Fragment>
                              ))
                            : benefit.description
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Индикатор-полосочка */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="relative w-16 h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-brand-green rounded-full transition-all duration-700 ease-out shadow-lg shadow-brand-green/50"
                style={{
                  width: `${100 / benefits.length}%`,
                  transform: `translateX(${currentSlide * 100}%)`
                }}
              />
            </div>
          </div>
        </div>

        <div 
          ref={cardsRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-1 w-full"
        >
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`group bg-[#FEFEFE] rounded-3xl shadow-lg transition-all duration-500 animate-on-scroll overflow-hidden ${visibleCards[index] ? 'visible' : ''}`}
            >
              {/* Изображение для планшета и ПК */}
              <div className="hidden md:block relative h-56 overflow-hidden">
                <img 
                  src={benefit.image} 
                  alt={`${benefit.title} - IT-школа Кодология Архангельск, обучение детей программированию`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Контент */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {/* Иконка для мобильной версии */}
                <div className="md:hidden text-brand-blue mb-4">
                  {benefit.icon}
                </div>
                
                {/* Иконка для планшета и ПК - над заголовком */}
                <div className="hidden md:block text-brand-blue mb-4 drop-shadow-lg">
                  {benefit.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 drop-shadow-lg">
                  {benefit.title}
                </h3>
                <p className="text-white/90 leading-relaxed drop-shadow-lg">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Нижний прямоугольник */}
      <div className="w-full h-16 bg-brand-white rounded-t-[64px]"></div>
    </section>
  );
};

export default Benefits;
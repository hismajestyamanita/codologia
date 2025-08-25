import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollAnimation } from '../shared/hooks/useScrollAnimation';
import { useParallax } from '../shared/hooks/useParallax';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const titleAnimation = useScrollAnimation({ delay: 0 });
  const statsAnimation = useScrollAnimation({ delay: 200 });
  const sliderAnimation = useScrollAnimation({ delay: 400 });
  
  // Refs для параллакса
  const sectionRef = useRef<HTMLDivElement>(null);
  const greenRef = useRef<HTMLImageElement>(null);
  const pinkRef = useRef<HTMLImageElement>(null);
  const redRef = useRef<HTMLImageElement>(null);

  const testimonials = [
    {
      name: "Жанна Панова",
      text: "Спасибо большое за занятия, сын с большим удовольствием посещает их, дома прорабатывает, то что проходили. Вообще все замечательно, педагог профессионально всё объясняет…",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Марина Смелкова",
      text: "Дочка 13. Задумались о будущей профессии, выбрали программу в Кодологии. Занятия проходят раз в неделю… Большое спасибо организаторам!",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Ирина Мельник",
      text: "Сыну 8 лет. На занятия ходим 2‑ой год. За это время научился рисовать, делать игры и презентации. Рекомендую Кодологию всем!",
      image: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Татьяна Третьякова",
      text: "Сыну 9 лет, очень нравится ваша школа программирования. Уже на практике применяет то, что освоил.",
      image: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Лариса Дёмина",
      text: "Сыну 7 лет, ходим недавно, но ему очень нравится. Узнаёт много нового, обязательно будем продолжать ходить!",
      image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Валентина Камалютдинова",
      text: "Внуку 10 лет, ходит 2 год, очень нравится, узнаёт много нового, спасибо Анечке!",
      image: "https://images.pexels.com/photos/1181717/pexels-photo-1181717.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Ирина Веселкова",
      text: "…в студию пошёл сначала младший (6 лет), потом старший (8 лет). Для младшего — игровая форма, для старшего — офисные программы. Обстановка располагает приходить снова и снова 😊",
      image: "https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Анастасия Кузнецова",
      text: "Ребёнку 8 лет. Начали с создания игр. Преподаватель внимательный, после уроков — отчёт. Домашку делает с удовольствием. Рады, что попали в Кодологию 😊",
      image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Ирина Серкова",
      text: "Сыну 8 лет, занимаемся второй год. Сейчас он умеет создавать анимации, игры, работает с Word и Excel. Спасибо педагогам!",
      image: "https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Оксана Збарская",
      text: "Мой сын проходил курс по Scratch 3 недели. Занимался и в офисе, и дистанционно. Ему очень всё понравилось…",
      image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Екатерина Попова",
      text: "Очень познавательный курс \"Компьютерная грамотность\", ребёнок в восторге. Отдельное спасибо преподавателю Анне.",
      image: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Ольга Салихова",
      text: "Сын впервые занимался на компьютерных курсах. Всё было хорошо организовано, ребёнок был занят познавательной деятельностью — не просто играл в игры.",
      image: "https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  // Автопрокрутка каждые 5 секунд
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      // Если дошли до конца основного массива, плавно сбрасываем к началу
      if (nextIndex >= testimonials.length * 2) {
        setTimeout(() => setCurrentIndex(testimonials.length), 0);
        return nextIndex;
      }
      return nextIndex;
    });
    setTimeout(() => setIsAutoPlaying(true), 10000); // Возобновить автопрокрутку через 10 сек
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const prevIndex = prev - 1;
      // Если ушли в минус, плавно перебрасываем в конец
      if (prevIndex < 0) {
        setTimeout(() => setCurrentIndex(testimonials.length - 1), 0);
        return testimonials.length * 2 - 1;
      }
      return prevIndex;
    });
    setTimeout(() => setIsAutoPlaying(true), 10000); // Возобновить автопрокрутку через 10 сек
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  return (
    <section id="testimonials" className="w-full bg-gray-50 flex flex-col">
      {/* Белый прямоугольник сверху */}
      <div className="w-full h-16 bg-brand-white rounded-b-[64px] shadow-lg"></div>
      
      {/* Content контейнер */}
      <div ref={sectionRef} className="w-full relative overflow-hidden">
        {/* Декоративные изображения на фоне */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Зеленые скобки - левый верхний угол */}
          <img
            ref={greenRef}
            src="/assets/img/04-testimonials/04-testimonials-green-skobs.webp"
            alt=""
            className="absolute -top-20 -left-20 w-96 h-96 pointer-events-none"
            data-rotate="rotate(12deg)"
          />
          
          {/* Розовая стрелка - правый верхний угол */}
          <img
            ref={pinkRef}
            src="/assets/img/04-testimonials/04-testimonials-arrow-pink.webp"
            alt=""
            className="absolute -top-16 -right-16 w-96 h-96 pointer-events-none"
            data-rotate="rotate(-175deg)"
          />
          
          {/* Красные скобки - левый нижний угол */}
          <img
            ref={redRef}
            src="/assets/img/04-testimonials/04-testimonials-red-skobs.webp"
            alt=""
            className="absolute -bottom-16 -left-16 w-96 h-96 pointer-events-none"
            data-rotate="rotate(-12deg)"
          />
        </div>
        
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-16 flex flex-col gap-6">
        <div className="text-center mb-16">
        <div className="text-center mb-16 md:mb-16 mb-8">
          <h2 
            ref={titleAnimation.ref as React.RefObject<HTMLHeadingElement>}
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-brand-black animate-on-scroll-large ${titleAnimation.isVisible ? 'visible' : ''}`}
          >
            Вот, что говорят{' '}
            <span className="text-brand-green">родители и&nbsp;дети</span>{' '}
            после занятий
          </h2>
          
          <div 
            ref={statsAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`flex flex-row justify-center items-center gap-6 mt-8 animate-on-scroll ${statsAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-green mb-2">900+</div>
              <div className="text-gray-600">родителей уже выбрали нас</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-green mb-2">150+</div>
              <div className="text-gray-600">остались с нами более 3 лет</div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-card">
            Все отзывы взяты с нашей{' '}
            <a 
              href="https://vk.com/arh_codologia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-blue hover:text-brand-green transition-colors font-medium underline"
            >
              группы ВКонтакте
            </a>
          </p>
        </div>
        </div>
        

        {/* Слайдер без ограничений Content */}
        <div 
          ref={sliderAnimation.ref as React.RefObject<HTMLDivElement>}
          className={`relative animate-on-scroll pb-20 w-full md:-mt-8 -mt-4 ${sliderAnimation.isVisible ? 'visible' : ''}`}
        >
          {/* Desktop Slider */}
          <div className="hidden md:block overflow-visible">
            <div className="flex justify-center">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * 320}px)`,
                transition: currentIndex === testimonials.length && 'none' // Убираем анимацию при сбросе
              }}
            >
              {/* Создаем 4 копии массива для плавной бесконечной прокрутки */}
              {testimonials.concat(testimonials, testimonials, testimonials).map((testimonial, index) => (
                <div 
                  key={`${testimonial.name}-${index}`}
                  className="w-80 flex-shrink-0 px-2"
                >
                  <div className="bg-brand-white p-card rounded-medium shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col justify-between">
                    {/* Верхняя часть: звезды и отзыв */}
                    <div>
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-brand-green text-brand-green" />
                        ))}
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">
                        "{testimonial.text}"
                      </p>
                    </div>
                    
                    {/* Нижняя часть: аватарка и имя */}
                    <div className="flex items-center gap-4 mt-6">
                      <div>
                        <div className="font-semibold text-brand-black">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">родитель</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Mobile Slider */}
          <div className="md:hidden overflow-visible relative pb-8">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-10 hover:bg-white hover:scale-110 hover:shadow-xl"
            >
              <ChevronLeft className="w-5 h-5 text-brand-black" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-10 hover:bg-white hover:scale-110 hover:shadow-xl"
            >
              <ChevronRight className="w-5 h-5 text-brand-black" />
            </button>

            <div className="overflow-visible">
            <div 
              className="flex transition-transform duration-500 ease-in-out cursor-grab active:cursor-grabbing touch-pan-x"
              style={{ 
                transform: `translateX(calc(50vw - 160px - ${currentIndex * 320}px))`
              }}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                // Store initial touch position
                e.currentTarget.setAttribute('data-start-x', touch.clientX.toString());
              }}
              onTouchEnd={(e) => {
                const touch = e.changedTouches[0];
                const startX = parseFloat(e.currentTarget.getAttribute('data-start-x') || '0');
                const diffX = startX - touch.clientX;
                
                // Если свайп больше 50px
                if (Math.abs(diffX) > 50) {
                  if (diffX > 0) {
                    nextSlide(); // Свайп влево - следующий слайд
                  } else {
                    prevSlide(); // Свайп вправо - предыдущий слайд
                  }
                }
              }}
            >
              {/* Мобильная версия также с множественными копиями */}
              {testimonials.concat(testimonials, testimonials, testimonials).map((testimonial, index) => (
                <div 
                  key={`mobile-${testimonial.name}-${index}`}
                  className="w-80 flex-shrink-0 px-4 pb-4"
                >
                  <div className="bg-brand-white p-6 rounded-medium shadow-lg h-full flex flex-col justify-between">
                    {/* Верхняя часть: звезды и отзыв */}
                    <div>
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-brand-green text-brand-green" />
                        ))}
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed text-sm">
                        "{testimonial.text}"
                      </p>
                    </div>
                    
                    {/* Нижняя часть: аватарка и имя */}
                    <div className="flex items-center gap-3 mt-6">
                      <div>
                        <div className="font-semibold text-brand-black text-sm">{testimonial.name}</div>
                        <div className="text-xs text-gray-500">родитель</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
          
          {/* Desktop Navigation Buttons */}

          {/* Desktop Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-lg items-center justify-center transition-all duration-300 z-10 hover:bg-white hover:scale-110 hover:shadow-xl text-brand-black hover:text-brand-blue"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-lg items-center justify-center transition-all duration-300 z-10 hover:bg-white hover:scale-110 hover:shadow-xl text-brand-black hover:text-brand-blue"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

        </div>
      </div>
      </div>
      
      {/* Параллакс для декоративных изображений */}
      {useParallax(
        [
          { el: greenRef, speed: 0.35, base: 0 },  // медленнее страницы
          { el: pinkRef,  speed: 0.50, base: 0 },  // ещё медленнее
          { el: redRef,   speed: 0.20, base: 0 },  // самый «дальний»
        ],
        sectionRef
      )}
      
      {/* Нижний прямоугольник */}
      <div className="w-full h-16 bg-brand-white rounded-t-[64px]"></div>
    </section>
  );
};

export default Testimonials;
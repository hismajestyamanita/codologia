import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../shared/hooks/useScrollAnimation';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const titleAnimation = useScrollAnimation({ delay: 0 });
  const { containerRef: faqRef, visibleItems: visibleFAQs } = useStaggeredAnimation(5, 200, 100);

  const faqs = [
    {
      question: "Что будет на пробном?",
      answer: "Занятие проводится в мини-группе, в соответствии с программой выбранного модуля. После занятия ребёнок поймёт, комфортно ли ему в этой группе, а преподаватель даст фидбек — подойдёт ли модуль именно вашему ребёнку."
    },
    {
      question: "Если ребёнку не понравится занятие?",
      answer: "Предложим ребёнку другую программу. Дайте честную обратную связь, и мы для него подберём идеальную программу."
    },
    {
      question: "А что если он пропустит занятие?",
      answer: "У нас прозрачная система переноса. Предупредите хотя бы за час до занятия — оплату за занятие перенесём в полном объёме."
    },
    {
      question: "Почему вам можно доверять?",
      answer: "Сеть Кодология работает с 2017 года, филиал в Архангельске — с 2019 года."
    },
    {
      question: "Сколько стоит абонемент?",
      answer: "Абонемент на 4 занятия стоит 2 400₽ для детей 7 лет, 3 600₽ для детей 8+ лет. Предоплата (за абонемент платите сразу), но списываем с абонемента только за реально посещённые занятия."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      id="faq" 
      className="w-full bg-brand-black flex flex-col relative"
    >
      {/* Фоновое изображение */}
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: 'url(/assets/img/06-faq/06-faq-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: window.innerWidth < 768 ? 'center 120px' : 'center 10px',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Белый прямоугольник сверху */}
      <div className="w-full h-16 bg-white rounded-b-[64px] shadow-lg relative z-10"></div>
      
      {/* Content контейнер */}
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-16 flex flex-col gap-6 relative z-10">
        <div className="text-center mb-4">
          <h2 
            ref={titleAnimation.ref as React.RefObject<HTMLHeadingElement>}
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-brand-white animate-on-scroll-large ${titleAnimation.isVisible ? 'visible' : ''}`}
          >
            Честно отвечаем на всё, что{' '}
            <span className="text-brand-blue">вас может волновать</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <div 
          ref={faqRef as React.RefObject<HTMLDivElement>}
          className="flex flex-col gap-4"
        >
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl overflow-hidden animate-on-scroll transition-all duration-300 hover:-translate-y-1 ${visibleFAQs[index] ? 'visible' : ''}`}
              style={{
                height: openIndex === index ? 'auto' : '48px',
                borderRadius: '32px',
                minHeight: '64px'
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full px-4 py-4 text-left flex items-center justify-between transition-all duration-300 group relative overflow-hidden ${
                  openIndex === index 
                    ? 'bg-white/90 hover:bg-white/95' 
                    : 'hover:bg-white/90'
                }`}
                style={{ height: '64px' }}
              >
                <h3 className={`text-lg font-semibold pr-4 transition-colors duration-300 relative z-10 ${
                  openIndex === index 
                    ? 'text-brand-black group-hover:text-brand-blue' 
                    : 'text-white group-hover:text-brand-black'
                }`}>
                  {faq.question}
                </h3>
                <div className="relative z-10">
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-brand-green group-hover:text-brand-blue flex-shrink-0 transition-all duration-300" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-brand-green group-hover:text-brand-blue flex-shrink-0 transition-all duration-300" />
                  )}
                </div>
                
                {/* Фирменный блик при ховере */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white/50 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className={`px-4 pb-4 transition-all duration-300 ${
                  openIndex === index ? 'bg-white/90' : ''
                }`}>
                  <p className={`leading-relaxed transition-colors duration-300 ${
                    openIndex === index ? 'text-brand-black/90' : 'text-white/90'
                  }`}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
      
      {/* Нижний прямоугольник */}
      <div className="w-full h-16 bg-brand-white rounded-t-[64px] relative z-10"></div>
    </section>
  );
};

export default FAQ;
import React from 'react';
import { Code, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer id="contacts" className="w-full bg-brand-black text-brand-white">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 flex flex-col gap-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <button onClick={scrollToTop} className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-brand-blue rounded-small flex items-center justify-center">
                <Code className="w-6 h-6 text-brand-white" aria-label="Логотип IT-школы Кодология Архангельск" />
              </div>
              <span className="text-2xl font-bold" aria-label="Кодология - обучение детей программированию в Архангельске">Кодология</span>
            </button>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Школа программирования для детей в Архангельске. 
              Помогаем детям от 7 до 17 лет освоить IT через игры и проекты.
            </p>
            <div className="mt-4 text-sm text-gray-500 leading-relaxed">
              <p className="mb-1">ИП Шумилова Наталья Александровна</p>
              <p className="mb-1">ОГРНИП 319290100031804</p>
              <p>ИНН 290128188013</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Навигация</h3>
            <div className="space-y-3">
              <button 
                onClick={() => scrollToSection('programs')}
                className="block text-gray-400 hover:text-brand-blue transition-colors"
              >
                Программы
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="block text-gray-400 hover:text-brand-blue transition-colors"
              >
                Отзывы
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="block text-gray-400 hover:text-brand-blue transition-colors"
              >
                Вопросы
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+7 (950) 661-39-51</span>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>г. Архангельск, ул. Ломоносова, 199<br/>г. Архангельск, пр. Московский, 49</span>
              </div>
            </div>
          </div>
        </div>

        {/* Декоративное изображение — крупное, прижато к низу блока */}
        <div className="relative pointer-events-none" style={{ minHeight: '320px' }}>
          <img
            src="/assets/img/09-footer/09-footer-comp-01.webp"
            alt=""
            className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-60 w-[90vw] max-w-[1400px] h-auto md:w-[1100px]"
            style={{ transform: 'translate(-50%, 0) translateZ(0)' }}
          />
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 Кодология. Все права защищены.
          </p>
          <div className="flex gap-6">
            <a 
              href="/assets/documents/politika-konfidencialnosti.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-brand-blue transition-colors text-sm"
            >
              Политика конфиденциальности
            </a>
            <a 
              href="/assets/documents/dogovor-oferta.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-brand-blue transition-colors text-sm"
            >
              Договор-оферта
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

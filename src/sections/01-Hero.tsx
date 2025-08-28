import React, { useState } from 'react';
import { ArrowRight, X, User, Phone, Check, AlertCircle } from 'lucide-react';
import sendLead from '../shared/sendLead';
import { trackEvent } from '../shared/analytics';

const Hero = () => {
  const [phoneInput, setPhoneInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    phone: '',
    name: '',
    childName: '',
    product: '',
    consent: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);

  // Маска для телефона
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    // Если нет цифр - возвращаем пустую строку
    if (numbers.length === 0) return '';
    
    // Если начинается с 7 или 8, убираем первую цифру
    let cleanNumbers = numbers;
    if (numbers.startsWith('7') || numbers.startsWith('8')) {
      cleanNumbers = numbers.slice(1);
    }
    
    // Если после очистки нет цифр - возвращаем пустую строку
    if (cleanNumbers.length === 0) return '';
    
    // Форматируем номер
    if (cleanNumbers.length <= 3) return `+7 (${cleanNumbers}`;
    if (cleanNumbers.length <= 6) return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3)}`;
    if (cleanNumbers.length <= 8) return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3, 6)}-${cleanNumbers.slice(6)}`;
    return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3, 6)}-${cleanNumbers.slice(6, 8)}-${cleanNumbers.slice(8, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Если пользователь полностью очистил поле
    if (inputValue === '') {
      setPhoneInput('');
      return;
    }
    
    const formatted = formatPhone(inputValue);
    setPhoneInput(formatted);
  };

  const handleSubmitPhone = () => {
    if (phoneInput.length < 18) {
      alert('Пожалуйста, введите корректный номер телефона');
      return;
    }
    setModalData({ ...modalData, phone: phoneInput });
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'unset';
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!modalData.name.trim()) {
      newErrors.name = 'Пожалуйста, укажите ваше имя';
    }
    
    if (!modalData.childName.trim()) {
      newErrors.childName = 'Пожалуйста, укажите имя ребенка';
    }
    
    if (!modalData.product) {
      newErrors.product = 'Пожалуйста, выберите продукт';
    }
    
    if (!modalData.consent) {
      newErrors.consent = 'Необходимо дать согласие на обработку персональных данных';
    }
    
    return newErrors;
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const ok = await sendLead({
        parentName: modalData.name,      // имя родителя
        childName: modalData.childName,  // ИМЯ РЕБЁНКА — ВАЖНО
        phone: modalData.phone,
        program: modalData.product || "Не знаю, помогите подобрать",
        source: "hero-modal",
      });
      

      trackEvent(ok ? "lead_success" : "lead_fail", { where: "HeroModal" });
      
      closeModal();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      
      // Сброс формы
      setPhoneInput('');
      setModalData({
        phone: '',
        name: '',
        childName: '',
        product: '',
        consent: true
      });
    } catch (error) {
      alert('Произошла ошибка. Попробуйте еще раз или позвоните нам.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setModalData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'phone') {
      // Применяем маску телефона
      if (value === '') {
        setModalData(prev => ({ ...prev, [name]: '' }));
      } else {
        const formatted = formatPhone(value);
        setModalData(prev => ({ ...prev, [name]: formatted }));
      }
    } else {
      setModalData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const scrollToQuiz = () => {
    const element = document.getElementById('quiz');
    if (element) {
      const headerHeight = 60;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const utpItems = [
    "Подберите модули по интересам: от игр до создания сайтов",
    "Занятия всего по 90 минут — ребёнок не устанет",
    "От 2 400₽ за 4 занятия, оплата только за посещённые",
    "Бесплатное пробное занятие без обязательств",
    "Персональный план обучения для каждого ребенка",
    "Два удобных филиала в Архангельске"
  ];

  return (
    <>
      <section className="w-full bg-white relative overflow-hidden min-h-screen">
        {/* Декоративные 3D объекты */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          {/* Левый верхний объект */}
          <img
            src="/assets/img/01-hero/03-hero-morgen.webp"
            alt=""
            className="absolute -left-20 animate-breathe opacity-80 transform scale-125"
            style={{ 
              animationDuration: '6s',
              transform: 'translateZ(0)',
              top: '130px',
              width: '384px',
              height: '384px'
            }}
          />
          
          {/* Правый верхний объект */}
          <img
            src="/assets/img/01-hero/02-hero-cube.webp"
            alt=""
            className="absolute animate-breathe-reverse opacity-80"
            style={{ 
              animationDuration: '8s',
              transform: 'translateZ(0)',
              top: '134px',
              right: '-214px',
             width: '450px',
             height: '450px'
            }}
          />
        </div>

        {/* Декоративные 3D объекты - только мобильная версия */}
        <div className="absolute inset-0 pointer-events-none md:hidden">
          {/* Левый объект - сбоку от текста */}
          <img
            src="/assets/img/01-hero/03-hero-morgen.webp"
            alt=""
            className="absolute animate-breathe opacity-60 transform scale-75"
            style={{ 
              animationDuration: '6s',
              transform: 'translateZ(0) scale(0.75)',
              top: '200px',
              left: '-150px',
              width: '200px',
              height: '200px'
            }}
          />
          
          {/* Правый объект - сбоку от текста */}
          <img
            src="/assets/img/01-hero/02-hero-cube.webp"
            alt=""
            className="absolute animate-breathe-reverse opacity-60 transform scale-75"
            style={{ 
              animationDuration: '8s',
              transform: 'translateZ(0) scale(0.75)',
              top: '300px',
              right: '-150px',
              width: '200px',
              height: '200px'
            }}
          />
        </div>

        {/* Основной контент */}
        <div className="relative z-10">
          {/* Hero блок */}
          <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 pt-32 pb-16">
            {/* Заголовок и подзаголовок */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-brand-black leading-tight mb-6">
                Отвлеките ребёнка от компьютерных игр и научите программировать за{' '}
                <span className="text-brand-green">1,5 часа в неделю</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Запишитесь на пробное занятие и получите персональный план обучения!
              </p>
            </div>

            {/* Форма ввода телефона */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <div className="flex-1 max-w-md">
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={handlePhoneChange}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-full text-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all relative z-20"
                    style={{ pointerEvents: 'auto', position: 'relative' }}
                  />
                </div>
                <button
                  onClick={handleSubmitPhone}
                  className="relative overflow-hidden px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 group whitespace-nowrap text-brand-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(61, 157, 242, 0.9)',
                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), 0 0 10px rgba(61, 157, 242, 0.6)',
                    filter: 'brightness(1)',
                    pointerEvents: 'auto',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.5) saturate(1.3)';
                    e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(255,255,255,0.6), 0 0 100px rgba(61, 157, 242, 1), 0 0 150px rgba(61, 157, 242, 0.9), 0 0 200px rgba(61, 157, 242, 0.8), 0 0 250px rgba(61, 157, 242, 0.6)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(1)';
                    e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(255,255,255,0.4), 0 0 10px rgba(61, 157, 242, 0.6)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                >
                  <span className="relative z-10">{isSubmitting ? 'Отправляем заявку...' : 'Записаться бесплатно'}</span>
                  <ArrowRight className="w-5 h-5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/60 to-transparent w-full h-full -translate-x-full animate-shimmer"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Бегущая строка с УТП */}
          <div className="w-full overflow-hidden py-4 mb-16">
            <div className="flex animate-carousel-smooth whitespace-nowrap">
              {/* Дублируем массив для бесконечной прокрутки */}
              {[...utpItems, ...utpItems, ...utpItems].map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 mx-3 flex items-center gap-3 hover:bg-white/30 transition-all duration-300"
                  style={{ backdropFilter: 'blur(10px)' }}
                >
                  <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></div>
                  <span className="text-brand-black font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Блок с героем */}
          <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8" style={{ marginTop: '-500px' }}>
            <div className="relative flex flex-col items-center">
              {/* Изображение ребенка */}
              <div className="relative mb-8">
                <img
                  src="/assets/img/01-hero/01-hero-kid.webp"
                  alt="Ученик школы программирования Кодология"
                  className="w-auto h-auto max-w-none"
                />
                
                {/* Кнопка поверх изображения */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ marginTop: '500px' }}>
                  <button
                    onClick={scrollToQuiz}
                    className="relative overflow-hidden text-brand-black px-8 py-4 rounded-full transition-all duration-300 font-medium border border-brand-white/20 shadow-lg animate-bounce-slow z-20"
                    style={{
                      background: 'linear-gradient(to right, #90EE90, #7CF23D, #90EE90)',
                      boxShadow: '0 0 30px rgb(124 242 61), 0 0 60px rgb(124 242 61 / 60%), 0 0 100px rgb(124 242 61 / 40%)',
                      animation: 'levitate 3s ease-in-out infinite',
                      filter: 'brightness(1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'brightness(1.5) saturate(1.3)';
                      e.currentTarget.style.boxShadow = '0 0 60px rgb(124 242 61), 0 0 100px rgb(124 242 61 / 80%), 0 0 150px rgb(124 242 61 / 60%), 0 0 200px rgb(124 242 61 / 40%)';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'brightness(1)';
                      e.currentTarget.style.boxShadow = '0 0 30px rgb(124 242 61), 0 0 60px rgb(124 242 61 / 60%), 0 0 100px rgb(124 242 61 / 40%)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <span className="relative z-10">Подобрать программу</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white/30 to-transparent w-full h-full -translate-x-full animate-shimmer"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-fade-in-up">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-brand-black">Получите бесплатное пробное занятие</h2>
                <p className="text-sm text-gray-600 mt-1">Заполните форму, и мы свяжемся с вами</p>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleModalSubmit} className="p-6 space-y-6">
              {/* Телефон (readonly) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 text-brand-blue" />
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={modalData.phone}
                  onChange={handleModalChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-small transition-all duration-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>

              {/* Имя родителя */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 text-brand-blue" />
                  Имя родителя *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={modalData.name}
                  onChange={handleModalChange}
                  className={`w-full px-4 py-3 border rounded-small transition-all duration-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Анна Петрова"
                />
                {errors.name && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 text-brand-blue" />
                  Имя ребенка *
                </label>
                <input
                  type="text"
                  name="childName"
                  required
                  value={modalData.childName}
                  onChange={handleModalChange}
                  className={`w-full px-4 py-3 border rounded-small transition-all duration-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent ${
                    errors.childName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Максим"
                />
                {errors.childName && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.childName}</span>
                  </div>
                )}
              </div>

              {/* Выбор продукта */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Желаемая программа *
                </label>
                <select
                  name="product"
                  required
                  value={modalData.product}
                  onChange={handleModalChange}
                  className={`w-full px-4 py-3 border rounded-small transition-all duration-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent ${
                    errors.product ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Выберите желаемую программу</option>
                  <option value="Не знаю, помогите подобрать">Не знаю, помогите подобрать</option>
                  <option value="Компьютерная грамотность и первые игры (8-10 лет)">Компьютерная грамотность и первые игры (8-10 лет)</option>
                  <option value="Мобильные приложения и веб-разработка (10-12 лет)">Мобильные приложения и веб-разработка (10-12 лет)</option>
                  <option value="Профессиональная IT-разработка (13+ лет)">Профессиональная IT-разработка (13+ лет)</option>
                  <option value="Компьютерные каникулы">Компьютерные каникулы</option>
                  <option value="Компьютерный дизайн">Компьютерный дизайн</option>
                  <option value="Компьютерная грамотность">Компьютерная грамотность</option>
                </select>
                {errors.product && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.product}</span>
                  </div>
                )}
              </div>

              {/* Согласие на обработку данных */}
              <div className={`p-4 rounded-small transition-all duration-300 ${
                errors.consent ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
              }`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={modalData.consent}
                      onChange={handleModalChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                      modalData.consent 
                        ? 'bg-brand-blue border-brand-blue'
                        : 'bg-white border-gray-300 hover:border-brand-blue'
                    }`}>
                      {modalData.consent && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 leading-relaxed">
                    Даю согласие на{' '}
                    <a 
                      href="/assets/documents/soglasie-na-obrabotku-dannyh.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:text-brand-green underline transition-colors"
                    >
                      обработку персональных данных
                    </a>
                    {' '}и{' '}
                    <a 
                      href="/assets/documents/dogovor-oferta.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:text-brand-green underline transition-colors"
                    >
                      договор-оферту
                    </a>
                  </span>
                </label>
                {errors.consent && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.consent}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative overflow-hidden py-4 rounded-small font-semibold text-lg flex items-center justify-center gap-2 group transition-all duration-300 bg-gradient-to-r from-brand-green via-accent-brightGreen to-brand-green text-brand-black hover:scale-105 hover:shadow-2xl hover:shadow-accent-brightGreen/80 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: '0 0 30px #7CF23D/40, 0 0 60px #7CF23D/20'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.boxShadow = '0 0 60px #00FF41/90, 0 0 120px #00FF41/60, 0 0 180px #00FF41/40';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.boxShadow = '0 0 30px #7CF23D/40, 0 0 60px #7CF23D/20';
                  }
                }}
              >
                <span className="relative z-10">
                  {isSubmitting ? 'Отправляем заявку...' : 'Получить пробное занятие'}
                </span>
                {!isSubmitting && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                )}
                
                {!isSubmitting && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/40 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out transform -skew-x-12"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/60 to-transparent w-full h-full -translate-x-full animate-shimmer"></div>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast уведомление */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-brand-green text-brand-black px-6 py-4 rounded-small shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5" />
            <span className="font-medium">Спасибо! Мы свяжемся с вами в течение рабочего дня.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
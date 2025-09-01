import React, { useState } from 'react';
import { ArrowRight, X, User, Phone, Check, AlertCircle } from 'lucide-react';
import sendLead from '../shared/sendLead';
import { trackEvent } from '../shared/analytics';
import UnifiedSignupModal from '../shared/UnifiedSignupModal';
import PhoneInput from '../shared/PhoneInput';

const Hero = () => {
  const [phoneInput, setPhoneInput] = useState('');
  const [showSignup, setShowSignup] = useState(false);
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
    if (phoneInput.length !== 10) {
      alert('Пожалуйста, введите корректный номер телефона');
      return;
    }
    setModalData({ ...modalData, phone: phoneInput });
    setShowSignup(true);
    document.body.style.overflowY = 'hidden';
  };

  const closeModal = () => {
    setShowSignup(false);
    document.body.style.overflowY = '';
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
        phone: '+7${modalData.phone}',
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
        {/* Декоративные 3D объекты (десктоп) */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          {/* Левый верхний — ПК v2 */}
          <img
            src="/assets/img/01-hero/02-hero-pc2.webp"
            alt=""
            className="absolute animate-breathe"
            style={{ 
              animationDuration: '6s',
              transform: 'translateZ(0)',
              top: '340px',
              left: '-80px',
              width: '360px',
              height: '360px',
              opacity: 1
            }}
          />

          {/* Правый верхний — ПК */}
          <img
            src="/assets/img/01-hero/01-hero-pc.webp"
            alt=""
            className="absolute animate-breathe-reverse"
            style={{ 
              animationDuration: '8s',
              transform: 'translateZ(0)',
              top: '340px',
              right: '-120px',
              width: '520px',
              height: '520px',
              opacity: 1
            }}
          />
        </div>

        {/* Декоративные 3D объекты (мобильные) */}
        <div className="absolute inset-0 pointer-events-none md:hidden">
          {/* Левый — ПК v2 */}
          <img
            src="/assets/img/01-hero/02-hero-pc2.webp"
            alt=""
            className="absolute animate-breathe"
            style={{ 
              animationDuration: '6s',
              transform: 'translateZ(0)',
              top: '240px',
              left: '-120px',
              width: '140px',
              height: '140px',
              opacity: 1
            }}
          />

          {/* Правый — ПК */}
          <img
            src="/assets/img/01-hero/01-hero-pc.webp"
            alt=""
            className="absolute animate-breathe-reverse"
            style={{ 
              animationDuration: '8s',
              transform: 'translateZ(0)',
              top: '260px',
              right: '-120px',
              width: '160px',
              height: '160px',
              opacity: 1
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
              <div className="flex flex-row items-center justify-center gap-3">
                <div className="relative z-10 flex-1 min-w-0">
                  <PhoneInput
                    value={phoneInput}
                    onChange={setPhoneInput}
                    size="hero"
                    placeholder="960 123-45-67"
                    inputClassName="w-full px-4 border rounded-full"
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

      {showSignup && (
        <UnifiedSignupModal
          onClose={closeModal}
          initialPhone={phoneInput}
          selectedProgram=""
          source="hero-modal"
        />
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

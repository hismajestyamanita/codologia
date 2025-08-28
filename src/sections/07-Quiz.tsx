import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, User, Calendar, Target, Gamepad2, Code, Check, AlertCircle, Phone } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../shared/hooks/useScrollAnimation';
import sendLead from '../shared/sendLead';
import { trackEvent } from '../shared/analytics';

interface QuizAnswer {
  id: string;
  text: string;
  value: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[];
}

interface QuizResults {
  age: string;
  experience: string;
  interests: string;
  goals: string;
  time: string;
}

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // ---- Квиз: форматирование ответов для ТГ ----
  const titles: Record<string, string> = {
    age: 'Возраст ребёнка',
    experience: 'Опыт',
    interests: 'Интересы',
    goals: 'Цель обучения',
    format: 'Формат занятий',
  };

  const getAnswerText = (qid: string) => {
    const q = questions.find(q => q.id === qid);
    const val = answers[qid];
    if (!q || !val) return '—';
    const a = q.answers.find(a => a.value === val);
    return a ? a.text : '—';
  };

  const buildQuizSummary = () => {
    return [
      `${titles.age}: ${getAnswerText('age')}`,
      `${titles.experience}: ${getAnswerText('experience')}`,
      `${titles.interests}: ${getAnswerText('interests')}`,
      `${titles.goals}: ${getAnswerText('goals')}`,
      `${titles.format}: ${getAnswerText('format')}`,
    ].join('\n');
  };

  const [showResults, setShowResults] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    childName: '',
    childAge: '',
    consent: true // Изначально галочка стоит
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const questions: QuizQuestion[] = [
    {
      id: 'age',
      question: 'Сколько лет вашему ребёнку?',
      answers: [
        { id: 'age0', text: '7 лет и меньше', value: 'very_young' },
        { id: 'age1', text: '8-10 лет', value: 'young' },
        { id: 'age2', text: '11-13 лет', value: 'middle' },
        { id: 'age3', text: '14+ лет', value: 'teen' }
      ]
    },
    {
      id: 'experience',
      question: 'Есть ли у ребёнка опыт работы с компьютером?',
      answers: [
        { id: 'exp1', text: 'Нет компьютера дома', value: 'no_computer' },
        { id: 'exp2', text: 'Нет, только игры и YouTube', value: 'none' },
        { id: 'exp3', text: 'Знает основы компьютерной грамотности', value: 'basic' },
        { id: 'exp4', text: 'Основы проги/занимался ранее в другом кружке', value: 'advanced' }
      ]
    },
    {
      id: 'interests',
      question: 'Что больше всего привлекает ребёнка?',
      answers: [
        { id: 'int1', text: '3D игры и виртуальная реальность', value: 'games_3d' },
        { id: 'int2', text: 'Мобильные приложения и сайты', value: 'mobile_web' },
        { id: 'int3', text: 'Программирование на Python, C++, Unity', value: 'professional' },
        { id: 'int4', text: 'Пока не знаем, хотим попробовать всё', value: 'explore' }
      ]
    },
    {
      id: 'goals',
      question: 'Какая главная цель обучения?',
      answers: [
        { id: 'goal1', text: 'Отвлечь от бесполезных компьютерных игр', value: 'distract' },
        { id: 'goal2', text: 'Развить логическое мышление и творчество', value: 'development' },
        { id: 'goal3', text: 'Определиться с будущей профессией', value: 'career' },
        { id: 'goal4', text: 'Создать портфолио реальных проектов', value: 'portfolio' },
        { id: 'goal5', text: 'Другое', value: 'other' }
      ]
    },
    {
      id: 'format',
      question: 'Какой формат занятий предпочитаете?',
      answers: [
        { id: 'format1', text: 'Индивидуальные занятия', value: 'individual' },
        { id: 'format2', text: 'Групповые занятия в мини группах до 10 человек', value: 'group' }
      ]
    },
    {
      id: 'contact',
      question: 'Как с вами связаться?',
      answers: [] // Пустой массив, так как это будет форма
    }
  ];

  const getRecommendations = (results: QuizResults) => {
    // Возвращаем стандартный результат независимо от ответов
    return {
      program: 'Персональная программа обучения',
      price: 'от 2 400₽',
      description: 'Подберем идеальную программу под интересы и уровень вашего ребенка',
      offer: '',
      skills: []
    };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, укажите ваше имя';
    }
    
    if (!formData.childName.trim()) {
      newErrors.childName = 'Пожалуйста, укажите имя ребенка';
    }
    
    if (!formData.childAge) {
      newErrors.childAge = 'Пожалуйста, выберите возраст ребенка';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Пожалуйста, укажите номер телефона';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Неправильный формат номера телефона';
    }
    
    if (!formData.consent) {
      newErrors.consent = 'Необходимо дать согласие на обработку персональных данных';
    }
    
    return newErrors;
  };

  const scrollToField = (fieldName: string) => {
    const element = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Устанавливаем фокус с анимацией
      setTimeout(() => {
        setFocusedField(fieldName);
        element.focus();
        
        // Убираем фокус через 3 секунды
        setTimeout(() => {
          setFocusedField(null);
        }, 3000);
      }, 300);
    }
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleContactSubmit = async (contactData: { name: string; phone: string }) => {
    try {
      const summary = buildQuizSummary();
  
      const ok = await sendLead({
        name: contactData.name,
        phone: contactData.phone,
        // age / childName тут обычно нет, ок
        message: summary,              // <-- ВСЕ ОТВЕТЫ КВИЗА
        source: "quiz-form",
      });
  
      trackEvent(ok ? "lead_success" : "lead_fail", { where: "Quiz", stage: "contact" });
    } catch (e) {
      console.error("quiz sendLead error", e);
    } finally {
      setAnswers(prev => ({ ...prev, contact: JSON.stringify(contactData) }));
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); scrollToField(Object.keys(validationErrors)[0]); return; }
    setIsSubmitting(true);
    try {
      const summary = buildQuizSummary();
  
      const ok = await sendLead({
        name: formData.name,
        childName: formData.childName,   // если есть — тоже увидим в ТГ
        age: formData.childAge,          // можно оставить, но дублируется с summary — по желанию
        phone: formData.phone,
        message: summary,                // <-- ВСЕ ОТВЕТЫ КВИЗА
        source: "quiz-form",
      });
  
      trackEvent(ok ? "lead_success" : "lead_fail", { where: "Quiz" });
      setShowResults(true);
    } catch (error) {
      alert('Произошла ошибка. Попробуйте еще раз или позвоните нам.');
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getFieldClassName = (fieldName: string) => {
    const baseClasses = "w-full px-4 py-3 border rounded-small transition-all duration-300";
    const focusClasses = "focus:ring-2 focus:ring-[#3D9DF2] focus:border-transparent";
    
    if (errors[fieldName]) {
      return `${baseClasses} border-red-500 bg-red-50 ${focusedField === fieldName ? 'ring-2 ring-red-500 animate-pulse' : ''}`;
    }
    
    if (focusedField === fieldName) {
      return `${baseClasses} border-red-500 ring-2 ring-red-500 animate-pulse`;
    }
    
    return `${baseClasses} border-gray-300 ${focusClasses}`;
  };

  const results = getRecommendations(answers as QuizResults);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showForm) {
    return (
      <section className="w-full py-20 bg-white">
        <div className="max-w-2xl mx-auto px-8">
          <div className="bg-[#FEFEFE] rounded-2xl p-8 shadow-2xl animate-fade-in-up">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-[#7CF23D] mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F0F23] mb-4">
                Отлично! Записываемся на бесплатное занятие
              </h2>
              <p className="text-gray-600">
                Заполните форму, и мы свяжемся с вами в течение 30 минут
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className={getFieldClassName('name')}
                    placeholder="Анна Петрова"
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fade-in-up">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleFormChange}
                    className={getFieldClassName('phone')}
                    placeholder="+7 (999) 123-45-67"
                  />
                  {errors.phone && (
                    <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fade-in-up">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя ребёнка *
                  </label>
                  <input
                    type="text"
                    name="childName"
                    required
                    value={formData.childName}
                    onChange={handleFormChange}
                    className={getFieldClassName('childName')}
                    placeholder="Максим"
                  />
                  {errors.childName && (
                    <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fade-in-up">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.childName}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Возраст ребёнка *
                  </label>
                  <select
                    name="childAge"
                    required
                    value={formData.childAge}
                    onChange={handleFormChange}
                    className={getFieldClassName('childAge')}
                  >
                    <option value="">Выберите возраст</option>
                    <option value="Не знаю, помогите подобрать">Не знаю, помогите подобрать</option>
                    {Array.from({ length: 12 }, (_, i) => i + 7).map(age => (
                      <option key={age} value={age}>{age} лет</option>
                    ))}
                  </select>
                  {errors.childAge && (
                    <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fade-in-up">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.childAge}</span>
                    </div>
                  )}
                </div>
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
                      checked={formData.consent}
                      onChange={handleFormChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                      formData.consent 
                        ? 'bg-[#3D9DF2] border-[#3D9DF2]'
                        : 'bg-white border-gray-300 hover:border-[#3D9DF2]'
                    }`}>
                      {formData.consent && (
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
                      className="text-[#3D9DF2] hover:text-[#7CF23D] underline transition-colors"
                    >
                      обработку персональных данных
                    </a>
                    {' '}и{' '}
                    <a 
                      href="/assets/documents/dogovor-oferta.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#3D9DF2] hover:text-[#7CF23D] underline transition-colors"
                    >
                      договор-оферту
                    </a>
                  </span>
                </label>
                {errors.consent && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-2 animate-fade-in-up">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.consent}</span>
                  </div>
                )}
              </div>


              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative overflow-hidden py-4 rounded-small font-semibold text-lg flex items-center justify-center gap-2 group transition-all duration-300 bg-gradient-to-r from-[#7CF23D] via-[#00FF41] to-[#7CF23D] text-[#0F0F23] hover:scale-105 hover:shadow-2xl hover:shadow-[#00FF41]/80 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: '0 0 30px #7CF23D/40, 0 0 60px #7CF23D/20'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.boxShadow = '0 0 60px #00FF41/90, 0 0 120px #00FF41/60, 0 0 180px #00FF41/40, inset 0 0 30px rgba(255,255,255,0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.boxShadow = '0 0 30px #7CF23D/40, 0 0 60px #7CF23D/20';
                  }
                }}
              >
                <span className="relative z-10">
                  {isSubmitting ? 'Отправляем заявку...' : 'Записаться на бесплатное занятие'}
                </span>
                {!isSubmitting && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                )}
                
                {/* Анимации */}
                {!isSubmitting && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/40 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out transform -skew-x-12"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/60 to-transparent w-full h-full -translate-x-full animate-shimmer"></div>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </div>
        </div>
      </section>
    );
  }

  if (showResults) {
    return (
      <section className="w-full py-4 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-[#7CF23D] mx-auto mb-6" />
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0F0F23] mb-6">
              Спасибо за ответы!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Мы свяжемся с вами в ближайшее время и предложим дату бесплатного занятия
            </p>
            
            <div className="bg-[#7CF23D] bg-opacity-10 p-8 rounded-2xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-[#0F0F23] mb-4">
                Персональная программа обучения
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                Подберем идеальную программу под интересы и уровень вашего ребенка
              </p>
              <div className="text-3xl font-bold text-[#7CF23D]">
                от 2 400₽
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <User className="w-8 h-8 text-[#3D9DF2] mx-auto mb-3" />
              <h4 className="font-semibold text-[#0F0F23] mb-2">Свяжемся в течение дня</h4>
              <p className="text-sm text-gray-600">Наш менеджер перезвонит и предложит удобное время</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <Calendar className="w-8 h-8 text-[#3D9DF2] mx-auto mb-3" />
              <h4 className="font-semibold text-[#0F0F23] mb-2">Бесплатное занятие</h4>
              <p className="text-sm text-gray-600">Первое занятие полностью бесплатно, без обязательств</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <Target className="w-8 h-8 text-[#3D9DF2] mx-auto mb-3" />
              <h4 className="font-semibold text-[#0F0F23] mb-2">Персональная программа</h4>
              <p className="text-sm text-gray-600">Подберем программу под интересы ребенка</p>
            </div>
          </div>

          <div className="text-center bg-gray-50 p-8 rounded-2xl">
            <p className="text-lg text-gray-600 mb-4">
              Ожидайте звонка в рабочее время
            </p>
            <p className="text-sm text-gray-500">
              Пн-Пт: 9:00-18:00 • Сб-Вс: 10:00-16:00
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quiz" className="w-full bg-white relative">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 flex flex-col gap-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F0F23] mb-3">
            Подберём идеальную программу для{' '}
            <span className="text-[#7CF23D]">вашего ребёнка</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-0">
            Ответьте на {questions.length} вопросов и получите персональную рекомендацию
          </p>
        </div>

        <div className="max-w-4xl mx-auto w-full -mt-4">
          <div className="bg-[#FEFEFE] border-2 border-gray-100 rounded-2xl p-8 shadow-lg">
            
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">
                Вопрос {currentQuestion + 1} из {questions.length}
              </span>
              <span className="text-sm font-medium text-[#3D9DF2]">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#3D9DF2] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F0F23] mb-8 text-center">
              {questions[currentQuestion].question}
            </h3>

            {questions[currentQuestion].id === 'contact' ? (
              <ContactForm onSubmit={handleContactSubmit} />
            ) : (
              <div className="space-y-4">
                {questions[currentQuestion].answers.map((answer) => (
                  <button
                    key={answer.id}
                    onClick={() => handleAnswer(questions[currentQuestion].id, answer.value)}
                    className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-[#3D9DF2] hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg text-gray-800 group-hover:text-[#3D9DF2]">
                        {answer.text}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#3D9DF2] opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0 || questions[currentQuestion].id === 'contact'}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-[#3D9DF2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад
            </button>

            <div className="flex gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index <= currentQuestion ? 'bg-[#3D9DF2]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            🔒 Ваши данные защищены и не передаются третьим лицам
          </p>
        </div>

        {/* Декоративные изображения под квизом */}
        <div className="relative mt-8 pointer-events-none">
          {/* Синий курсор - левый нижний угол */}
          <img
            src="/assets/img/07-quiz/07-quiz-arrow.webp"
            alt=""
            className="absolute w-1/4 h-auto animate-breathe"
            style={{ left: '-120px', bottom: '42px', transform: 'rotate(30deg)' }}
          />
          
          {/* Зеленый палец - правый нижний угол */}
          <img
            src="/assets/img/07-quiz/07-quiz-finger.webp"
            alt=""
            className="absolute -bottom-6 w-1/4 h-auto animate-breathe-reverse"
            style={{ right: '-120px', transform: 'rotate(-95deg)' }}
          />
        </div>
      </div>
    </section>
  );
};

// Компонент формы контактов
interface ContactFormProps {
  onSubmit: (data: { name: string; phone: string }) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Маска для телефона (как на первом экране)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Если пользователь полностью очистил поле
      if (value === '') {
        setFormData(prev => ({ ...prev, [name]: '' }));
      } else {
        const formatted = formatPhone(value);
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, укажите ваше имя';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Пожалуйста, укажите номер телефона';
    } else if (formData.phone.length < 18) {
      newErrors.phone = 'Неправильный формат номера телефона';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <User className="w-4 h-4 text-[#3D9DF2]" />
          Ваше имя *
        </label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-small transition-all duration-300 focus:ring-2 focus:ring-[#3D9DF2] focus:border-transparent ${
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

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 text-[#3D9DF2]" />
          Номер телефона *
        </label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-small transition-all duration-300 focus:ring-2 focus:ring-[#3D9DF2] focus:border-transparent ${
            errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="+7 (___) ___-__-__"
        />
        {errors.phone && (
          <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.phone}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full relative overflow-hidden py-4 rounded-small font-semibold text-lg flex items-center justify-center gap-2 group transition-all duration-300 bg-gradient-to-r from-[#7CF23D] via-[#00FF41] to-[#7CF23D] text-[#0F0F23] hover:scale-105 hover:shadow-2xl hover:shadow-[#00FF41]/80 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          boxShadow: '0 0 30px #7CF23D/40, 0 0 60px #7CF23D/20'
        }}
      >
        <span className="relative z-10">
          {isSubmitting ? 'Отправляем...' : 'Получить рекомендацию'}
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

      <p className="text-xs text-gray-500 text-center">
        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
      </p>
    </form>
  );
};

export default Quiz;
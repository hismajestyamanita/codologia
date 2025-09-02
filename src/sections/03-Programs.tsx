import React, { useState } from 'react';
import { ArrowRight, X, Clock, Users, Target, BookOpen, Code, Gamepad2, Palette, Monitor, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../shared/hooks/useScrollAnimation';
import UnifiedSignupModal from '../shared/UnifiedSignupModal';
import QuestionModal from '../shared/QuestionModal';

const Programs = () => {
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [showUnifiedSignupModal, setShowUnifiedSignupModal] = useState(false);
  const [selectedProgramForSignup, setSelectedProgramForSignup] = useState('');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const titleAnimation = useScrollAnimation({ delay: 0 });
  const { containerRef: programsRef, visibleItems: visiblePrograms } = useStaggeredAnimation(3, 200, 200);

  // Correct paths to images located in public/assets/img/03-programs
  const imageSrc = [
    '/assets/img/03-programs/03-programs-card-01-gamepad.webp',
    '/assets/img/03-programs/03-programs-card-02-globus.webp',
    '/assets/img/03-programs/03-programs-card-03-retro-pc.webp',
    '/assets/img/03-programs/03-programs-card-04-kanikuly.webp',
    '/assets/img/03-programs/03-programs-card-05-ux-ui.webp',
    '/assets/img/03-programs/03-programs-card-06-gramotnost.webp'
  ];

  const programs = [
    {
      age: "8–10 лет",
      title: "Программирование",
      badges: ["3D-игры Kodu", "Презентации", "Scratch-анимация"],
      price: "3 600₽",
      fullDescription: {
        duration: "1 занятие в неделю по 2 академических часа (90 минут)",
        period: "За учебный год с сентября по май",
        mainSkills: [
          "Программирование 3D игр в программе Kodu",
          "Компьютерная грамотность и создание презентаций",
          "Пиксельная и растровая графика",
          "Программирование игр и мультфильмов в Scratch"
        ],
        goals: "Занятия рассчитаны на овладение детьми основными умениями информационного характера, такими как: поиск и выделение необходимой информации, структурирование и визуализация информации и самостоятельное создание алгоритмов при решении проблем творческого и поискового характера.",
        skills: [
          "Пользоваться стандартным графическим интерфейсом компьютера",
          "Определять назначение файла по его расширению",
          "Выполнять основные операции с файлами",
          "Применять текстовый процессор для набора, редактирования и форматирования текстов",
          "Создавать презентации для поддержки своих выступлений",
          "Создавать и форматировать документы в Microsoft Word",
          "Работать с данными в программе Microsoft Excel",
          "Искать и систематизировать данные в сети Интернет",
          "Создавать презентации с графикой, анимацией и звуками",
          "Создавать мультипликационные фильмы и компьютерные игры",
          "Освоить правила разработки алгоритмов",
          "Понять принципы построения скриптов",
          "Создавать программы на языке Scratch",
          "Работать с графическими объектами",
          "Создавать рисунки и иллюстрации",
          "Программировать анимацию в среде CoSpaces",
          "Планировать свою деятельность при создании проекта",
          "Представлять результаты своей работы публично"
        ]
      }
    },
    {
      age: "10–12 лет",
      title: "Программирование",
      badges: ["Мобильные приложения", "Сайты на Tilda", "VR-проекты"],
      price: "3 600₽",
      fullDescription: {
        duration: "4 занятия в месяц по 2 академических часа (90 минут)",
        period: "С сентября по май",
        mainSkills: [
          "Создание мобильных приложений в MIT App Inventor",
          "Создание сайтов с помощью конструктора Tilda",
          "3D проекты в программе CoSpaces (виртуальная реальность)",
          "Создание и редактирование видеоигр в Construct3",
          "Курс 'Белый хакер' - основы кибербезопасности",
          "Создание мобильных приложений в Thunkable"
        ],
        goals: "Мы помогаем ребятам сделать первые шаги по одному из современных и перспективных путей развития IT-индустрии, повышаем мотивацию изучения программирования и создания собственных прикладных программ, подготавливаем платформу для изучения в дальнейшем более сложных языков программирования.",
        skills: [
          "Использовать приобретенные знания и умения в практической деятельности и повседневной жизни",
          "Оценивать возможности применения ИТ технологий для решения конкретной задачи",
          "Анализировать результаты своей деятельности и результаты других учащихся",
          "Создавать мобильные приложения в среде программирования MIT App Inventor",
          "Создавать свои сайты с помощью конструктора Tilda",
          "Получить общее понятие о виртуальной реальности",
          "Создавать 3D проекты в программе CoSpaces",
          "Искать ошибки программного кода и производить отладку программ",
          "Понимать процесс разработки видеоигр",
          "Создавать и редактировать видеоигру средствами Construct3",
          "Создавать уровни для 2D игр",
          "Моделировать поведение персонажей и объектов видеоигры",
          "Настраивать различные игровые механики",
          "Связывать в единое целое несколько игровых уровней",
          "Создавать игровые конструкции различных жанров и тематик",
          "Решать задачи, используя логическое и аналитическое мышление",
          "Решать геометрические задачи в среде Pencil Code",
          "Применять координаты при построении фигур",
          "Задавать перемещение объекта в виде формулы и координатным методом",
          "Изучить основы кибербезопасности, сетевых атак, криптографии на курсе 'Белый хакер'",
          "Пользоваться интерфейсом программы на английском языке",
          "Создавать мобильные приложения в программе Thunkable",
          "Применять в решении задач воображение и творческий подход"
        ]
      }
    },
    {
      age: "13+ лет",
      title: "Программирование",
      badges: ["JavaScript", "Python/C++", "Unity/Arduino"],
      price: "3 600₽",
      fullDescription: {
        duration: "4 занятия в месяц по 2 академических часа (90 минут)",
        period: "С сентября по май",
        mainSkills: [
          "Изучение языка гипертекстовой разметки HTML",
          "Разработка динамических страниц с использованием PHP",
          "Подключение JavaScript на 2 году обучения",
          "Знакомство с языками программирования Python, С++, C#",
          "Создание игр на Unity и проектов на Arduino",
          "Изучение операционной системы Linux"
        ],
        goals: "Помогаем сделать первые шаги по одному из современных и перспективных путей развития IT-индустрии, повышаем мотивацию изучения программирования и создания собственных прикладных программ. Занятия посвящены методам и способам развития творческого мышления учеников и помогает им адаптироваться к будущей взрослой жизни.",
        skills: [
          "Создавать полноценные рабочие проекты для портфолио",
          "Развивать алгоритмическое мышление для быстрого освоения компьютерных технологий",
          "Формировать межпредметные умения для реализации способностей в различных областях",
          "Видеть и формулировать задачи новых применений компьютера",
          "Применять полученные знания в будущей профессиональной деятельности",
          "Работать с современными языками программирования",
          "Создавать динамические веб-страницы",
          "Разрабатывать игры и интерактивные приложения",
          "Работать с микроконтроллерами Arduino",
          "Использовать операционную систему Linux",
          "Программировать на Python, C++, C#",
          "Создавать проекты на Unity",
          "Разрабатывать веб-приложения с JavaScript",
          "Формировать профессиональное портфолио",
          "Адаптироваться к современным IT-технологиям",
          "Развивать творческое и критическое мышление",
          "Планировать и реализовывать сложные проекты",
          "Работать в команде над IT-проектами"
        ]
      }
    },
    {
      age: "Любой возраст",
      title: "Компьютерные каникулы",
      badges: ["5 проектов", "Графика + 3D + Код", "Интенсив 5 дней"],
      price: "1 200₽",
      fullDescription: {
        duration: "5 дней подряд по 3 академических часа в день",
        period: "За одну смену на школьных каникулах",
        mainSkills: [
          "Создание цифровых проектов в разных форматах",
          "Освоение базовых навыков графики и анимации",
          "Основы 3D-моделирования и визуализации",
          "Знакомство с программированием через геймификацию",
          "Разработка собственного портфолио из 5 проектов"
        ],
        goals: "Интенсивное погружение в мир цифрового творчества за короткий срок. Ребенок создаст 5 проектов и получит ключевые навыки, направит энергию и интерес к гаджетам в созидательное русло.",
        skills: [
          "Создание цифровых проектов на практике",
          "Работа с графическими редакторами",
          "Основы 3D-моделирования",
          "Создание анимации и интерактивных элементов",
          "Базовые принципы программирования",
          "Работа в команде над проектами",
          "Презентация своих работ",
          "Развитие креативного мышления",
          "Освоение инструментов для цифрового творчества",
          "Создание портфолио из реализованных проектов"
        ]
      }
    },
    {
      age: "Любой возраст",
      title: "Компьютерный дизайн",
      badges: ["SketchUp 3D", "Krita графика", "Tilda сайты"],
      price: "3 600₽",
      fullDescription: {
        duration: "4 занятия в месяц по 2 академических часа (90 минут)",
        period: "С сентября по май",
        mainSkills: [
          "3D-моделирование в SketchUp (создание объектов, интерьеров)",
          "Цифровая графика в Krita (иллюстрации, концепт-арты)",
          "Обработка изображений в GIMP (ретушь, коллажи)",
          "Веб-дизайн на Tilda (создание сайтов без программирования)"
        ],
        goals: "Практическое освоение профессиональных инструментов для создания цифровых проектов. Развитие технических, проектных и визуальных компетенций через реализацию готовых работ.",
        skills: [
          "Создание 3D-моделей объектов и интерьеров в SketchUp",
          "Разработка цифровых иллюстраций и концепт-артов в Krita",
          "Ретушь фотографий и создание коллажей в GIMP",
          "Создание и публикация сайтов на Tilda",
          "Работа с композицией, цветом и типографикой",
          "Адаптация дизайна под мобильные устройства",
          "Структурирование и презентация проектов",
          "Критическая оценка и улучшение своих работ",
          "Формирование портфолио из реализованных проектов",
          "Освоение профессиональных инструментов дизайна"
        ]
      }
    },
    {
      age: "Любой возраст",
      title: "Компьютерная грамотность",
      badges: ["Файлы + папки", "Офисный пакет", "Безопасный интернет"],
      price: "900₽",
      fullDescription: {
        duration: "10 занятий по 2 академических часа (90 минут)",
        period: "Интенсивный курс",
        mainSkills: [
          "Основы работы с компьютером и файловой системой",
          "Создание и оформление текстовых документов",
          "Обработка данных в электронных таблицах",
          "Создание профессиональных презентаций"
        ],
        goals: "Научить ребенка уверенно работать с компьютером, обрабатывать информацию и создавать профессиональные презентации для учёбы и проектов. Развитие организационных навыков и критического мышления.",
        skills: [
          "Создание и сортировка папок и файлов",
          "Определение типов файлов по расширениям",
          "Безопасный поиск информации в интернете",
          "Создание оформленных текстовых документов",
          "Вставка изображений и таблиц в документы",
          "Работа с электронными таблицами и формулами",
          "Построение диаграмм и графиков",
          "Создание презентаций с единым стилем",
          "Добавление анимации и переходов в слайды",
          "Подготовка к выступлениям с презентациями",
          "Организация информации и данных",
          "Критическая оценка интернет-источников",
          "Визуальная коммуникация и сторителлинг",
          "Самостоятельное решение компьютерных задач"
        ]
      }
    }
  ];

  // Генерируем корректное название для селекта модалки
  const getSignupProgramTitle = (p: { age: string; title: string }) => {
    const age = (p.age || '').replace(/\s/g, '');
    if (p.title === 'Программирование') {
      if (/8–?10лет|8–?10/.test(age)) return 'Программирование (8–10 лет)';
      if (/10–?12лет|10–?12/.test(age)) return 'Программирование (10–12 лет)';
      if (/13\+лет|13\+/.test(age)) return 'Программирование (13+ лет)';
    }
    return p.title;
  };

  const openModal = (index: number) => {
    setSelectedProgram(index);
    document.body.style.overflowY = 'hidden';
  };

  const closeModal = () => {
    setSelectedProgram(null);
    document.body.style.overflowY = '';
  };

  const openUnifiedSignupModal = (programTitle?: string) => {
    setSelectedProgramForSignup(programTitle || '');
    setShowUnifiedSignupModal(true);
    document.body.style.overflowY = 'hidden';
  };

  const closeUnifiedSignupModal = () => {
    setShowUnifiedSignupModal(false);
    document.body.style.overflowY = '';
  };

  const openQuestionModal = () => {
    setShowQuestionModal(true);
    document.body.style.overflowY = 'hidden';
  };

  const closeQuestionModal = () => {
    setShowQuestionModal(false);
    document.body.style.overflowY = '';
  };

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % programs.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + programs.length) % programs.length);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setCurrentX(touch.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    setCurrentX(touch.clientX);
    const diffX = touch.clientX - startX;
    setTranslateX(diffX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diffX = currentX - startX;
    const threshold = 50; // минимальное расстояние для свайпа
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        prevSlide(); // Свайп вправо - предыдущий слайд
      } else {
        nextSlide(); // Свайп влево - следующий слайд
      }
    }
    
    setIsDragging(false);
    setTranslateX(0);
  };

  // Mouse events for desktop drag
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    setCurrentX(e.clientX);
    const diffX = e.clientX - startX;
    setTranslateX(diffX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diffX = currentX - startX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setIsDragging(false);
    setTranslateX(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      const diffX = currentX - startX;
      const threshold = 50;
      
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      }
      
      setIsDragging(false);
      setTranslateX(0);
    }
  };
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <section id="programs" className="w-full bg-brand-white">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 flex flex-col gap-6">
          <div className="text-center mb-8 md:mb-8">
            <h2 
              ref={titleAnimation.ref as React.RefObject<HTMLHeadingElement>}
              className={`text-3xl sm:text-4xl md:text-5xl font-bold text-brand-black animate-on-scroll-large ${titleAnimation.isVisible ? 'visible' : ''}`}
            >
              Программы для каждого возраста —{' '}
              <br />
              <span className="text-brand-green">от Kodu до JavaScript</span>
            </h2>
          </div>

          {/* Desktop Grid */}
          <div className="w-full">
            <div className="hidden md:flex md:flex-col md:gap-6 overflow-visible w-full p-0">
              {/* Первый ряд карточек */}
              <div 
                ref={programsRef as React.RefObject<HTMLDivElement>}
                className="flex gap-6 overflow-visible w-full p-0"
              >
              {programs.slice(0, 3).map((program, index) => (
                <div 
                  key={index} 
                  className={`group shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative hover:z-10 overflow-hidden hover:shadow-[0_0_60px_20px_rgba(124,242,61,0.9)] animate-on-scroll w-full ${visiblePrograms[index] ? 'visible' : ''}`} 
                  style={{ borderRadius: '24px' }}
                >
                  <div 
                    className="aspect-[3/4] relative p-6"
                  >
                    {/* Image Background */}
                    <img
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none select-none"
                      src={imageSrc[index]}
                      alt=""
                      loading="lazy"
                      draggable={false}
                    />
                    {/* Dark overlay for better text contrast */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 pointer-events-none"
                    />

                    {/* Program features as badges - top-left corner */}
                    <div className="relative z-10">
                      <div className="flex flex-wrap gap-2 justify-start">
                        {program.badges.map((badge, idx) => {
                          return (
                            <div key={idx} className="relative overflow-hidden bg-[#FEFEFE]/15 backdrop-blur-md border border-[#FEFEFE]/20 text-[#FEFEFE] px-3 py-1 rounded-small text-xs font-medium shadow-sm transition-all duration-300 cursor-pointer group/badge">
                              <span className="relative z-10">{badge}</span>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/40 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/40 to-transparent w-full h-full -translate-x-full group-hover/badge:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Grouped content container */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 z-10">
                      {/* Age badge */}
                      <div className="flex justify-start">
                        <div className="relative overflow-hidden bg-[#FEFEFE]/20 backdrop-blur-md border border-[#FEFEFE]/30 text-[#FEFEFE] px-4 py-2 rounded-medium text-sm font-semibold shadow-lg transition-all duration-300 cursor-pointer group/age">
                          <span className="relative z-10">{program.age}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/50 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/50 to-transparent w-full h-full -translate-x-full group-hover/age:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold leading-tight text-[#FEFEFE]">
                        {program.title}
                      </h3>
                      
                      {/* Price */}
                      <div className="text-2xl font-bold text-[#FEFEFE]">
                       <span className="text-[#FEFEFE]">{program.price}</span>
                      </div>
                      
                      {/* Buttons Row */}
                      <div className="flex gap-3 w-full">
                        <button 
                          onClick={() => openUnifiedSignupModal(getSignupProgramTitle(program))}
                          className="w-full relative overflow-hidden bg-gradient-to-r from-brand-green via-accent-brightGreen to-brand-green text-brand-black font-bold py-3 px-4 rounded-medium transition-all duration-300 flex items-center justify-center gap-2 group/signup shadow-lg hover:shadow-2xl hover:shadow-brand-green/60 hover:scale-105"
                          style={{
                            boxShadow: '0 0 20px #7CF23D/40, 0 0 40px #7CF23D/20, inset 0 0 20px rgba(255,255,255,0.2)'
                          }}
                        >
                          <span className="relative z-10 text-sm">Записаться</span>
                          <Star className="w-4 h-4 group-hover/signup:rotate-180 group-hover/signup:scale-110 transition-all duration-500" />
                          <div className="absolute inset-0 rounded-medium border-2 border-[#FFFFFF]/30 pointer-events-none"></div>
                          <div className="absolute inset-1 rounded-medium border border-[#FFFFFF]/20 pointer-events-none"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/60 to-transparent w-full h-full -translate-x-full animate-shimmer"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/40 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/50 to-transparent w-full h-full -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                        </button>
                        <button 
                          onClick={() => openModal(index)}
                          className="w-full relative overflow-hidden bg-brand-white/20 backdrop-blur-md border border-brand-white/30 hover:bg-brand-white/90 text-brand-white hover:text-brand-black font-semibold py-3 px-4 rounded-medium transition-all duration-300 flex items-center justify-center gap-2 group/button shadow-lg"
                        >
                          <span className="relative z-10 text-sm">Подробнее</span>
                          <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white/40 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white/50 to-transparent w-full h-full -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
              
              {/* Второй ряд карточек */}
              <div className="flex gap-6 overflow-visible w-full p-0">
              {programs.slice(3, 6).map((program, index) => (
                <div 
                  key={`second-${index}`} 
                  className={`group shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative hover:z-10 overflow-hidden hover:shadow-[0_0_60px_20px_rgba(124,242,61,0.9)] animate-on-scroll w-full ${visiblePrograms[index] ? 'visible' : ''}`} 
                  style={{ borderRadius: '24px' }}
                >
                  <div 
                    className="aspect-[3/4] relative p-6"
                  >
                    {/* Image Background */}
                    <img
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none select-none"
                      src={imageSrc[index + 3]}
                      alt=""
                      loading="lazy"
                      draggable={false}
                    />
                    {/* Dark overlay for better text contrast */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 pointer-events-none"
                    />

                    {/* Program features as badges - top-left corner */}
                    <div className="relative z-10">
                      <div className="flex flex-wrap gap-2 justify-start">
                        {program.badges.map((badge, idx) => {
                          return (
                            <div key={idx} className="relative overflow-hidden bg-[#FEFEFE]/15 backdrop-blur-md border border-[#FEFEFE]/20 text-[#FEFEFE] px-3 py-1 rounded-small text-xs font-medium shadow-sm transition-all duration-300 cursor-pointer group/badge">
                              <span className="relative z-10">{badge}</span>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/40 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/40 to-transparent w-full h-full -translate-x-full group-hover/badge:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Grouped content container */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 z-10">
                      {/* Age badge */}
                      <div className="flex justify-start">
                        <div className="relative overflow-hidden bg-[#FEFEFE]/20 backdrop-blur-md border border-[#FEFEFE]/30 text-[#FEFEFE] px-4 py-2 rounded-medium text-sm font-semibold shadow-lg transition-all duration-300 cursor-pointer group/age">
                          <span className="relative z-10">{program.age}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/50 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/50 to-transparent w-full h-full -translate-x-full group-hover/age:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold leading-tight text-[#FEFEFE]">
                        {program.title}
                      </h3>
                      
                      {/* Price */}
                      <div className="text-2xl font-bold text-[#FEFEFE]">
                       <span className="text-[#FEFEFE]">{program.price}</span>
                      </div>
                      
                      {/* Buttons Row */}
                      <div className="flex gap-3 w-full">
                        <button 
                          onClick={() => openUnifiedSignupModal(getSignupProgramTitle(program))}
                          className="w-full relative overflow-hidden bg-gradient-to-r from-brand-green via-accent-brightGreen to-brand-green text-brand-black font-bold py-3 px-4 rounded-medium transition-all duration-300 flex items-center justify-center gap-2 group/signup shadow-lg hover:shadow-2xl hover:shadow-brand-green/60 hover:scale-105"
                          style={{
                            boxShadow: '0 0 20px #7CF23D/40, 0 0 40px #7CF23D/20, inset 0 0 20px rgba(255,255,255,0.2)'
                          }}
                        >
                          <span className="relative z-10 text-sm">Записаться</span>
                          <Star className="w-4 h-4 group-hover/signup:rotate-180 group-hover/signup:scale-110 transition-all duration-500" />
                          <div className="absolute inset-0 rounded-medium border-2 border-[#FFFFFF]/30 pointer-events-none"></div>
                          <div className="absolute inset-1 rounded-medium border border-[#FFFFFF]/20 pointer-events-none"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/60 to-transparent w-full h-full -translate-x-full animate-shimmer"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/40 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/50 to-transparent w-full h-full -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                        </button>
                        
                        <button 
                          onClick={() => openModal(index + 3)}
                          className="w-full relative overflow-hidden bg-brand-white/20 backdrop-blur-md border border-brand-white/30 hover:bg-brand-white/90 text-brand-white hover:text-brand-black font-semibold py-3 px-4 rounded-medium transition-all duration-300 flex items-center justify-center gap-2 group/button shadow-lg"
                        >
                          <span className="relative z-10 text-sm">Подробнее</span>
                          <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white/40 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white/50 to-transparent w-full h-full -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative overflow-visible px-4 pb-8">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute -left-2 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg flex items-center justify-center transition-all duration-700 ease-out z-20 hover:bg-white/30 hover:scale-110 hover:shadow-xl"
            >
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg flex items-center justify-center transition-all duration-700 ease-out z-20 hover:bg-white/30 hover:scale-110 hover:shadow-xl"
            >
              <ChevronRight className="w-7 h-7 text-white" />
            </button>

            <div 
              className={`touch-pan-x select-none overflow-visible ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                className="flex"
                style={{
                  transform: `translateX(calc(-${currentSlide * 100}% + ${translateX}px))`,
                  transition: isDragging ? 'none' : 'transform 700ms ease-out'
                }}
              >
                {programs.concat(programs, programs).map((program, index) => {
                  const actualIndex = index % programs.length;
                  const relativeIndex = index - currentSlide;
                  const distance = Math.abs(relativeIndex);
                  
                  let scale = 1;
                  if (distance === 0) scale = 1;
                  else if (distance === 1) scale = 0.9;
                  else scale = 0.8;
                  
                  let opacity = 1;
                  if (distance === 0) opacity = 1;
                  else if (distance === 1) opacity = 0.7;
                  else opacity = 0.3;
                  
                  const blur = distance > 1 ? 'blur(2px)' : 'blur(0px)';
                  const zIndex = 10 - distance;
                  
                  return (
                  <div 
                    key={`mobile-${actualIndex}-${index}`} 
                    className="w-full flex-shrink-0 px-2 transition-all duration-700 ease-out"
                    style={{
                      transform: `scale(${scale}) translateY(${distance > 0 ? distance * 10 : 0}px)`,
                      opacity,
                      filter: blur,
                      zIndex
                    }}
                  >
                    <div 
                      className={`group shadow-lg hover:shadow-2xl transition-all duration-700 ease-out hover:-translate-y-2 relative overflow-hidden ${
                        distance === 0 
                          ? 'shadow-[0_0_40px_10px_rgba(124,242,61,0.6)] hover:shadow-[0_0_80px_30px_rgba(124,242,61,0.9)]' 
                          : ''
                      }`}
                      style={{ 
                        borderRadius: '24px',
                        boxShadow: distance === 0 
                          ? '0 0 40px 10px rgba(124,242,61,0.6), 0 20px 40px rgba(0,0,0,0.3)' 
                          : '0 10px 30px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div className="aspect-[3/4.2] relative">
                        {/* Image for mobile */}
                        <img
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none select-none"
                          src={imageSrc[actualIndex]}
                          alt=""
                          loading="lazy"
                          draggable={false}
                        />
                        {/* Dark overlay for better text contrast */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 pointer-events-none"
                        />

                        {/* Program features as badges - top-left corner */}
                        <div className="absolute top-4 left-4 right-4">
                          <div className="flex flex-wrap gap-2 justify-start">
                            {program.badges.map((badge, idx) => {
                              return (
                                <div key={idx} className="relative overflow-hidden bg-[#FEFEFE]/15 backdrop-blur-md border border-[#FEFEFE]/20 text-[#FEFEFE] px-3 py-1 rounded-small text-xs font-medium shadow-sm transition-all duration-700 ease-out cursor-pointer group/badge">
                                  <span className="relative z-10">{badge}</span>
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/40 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/40 to-transparent w-full h-full -translate-x-full group-hover/badge:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Grouped content container */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                          {/* Age badge */}
                          <div className="flex justify-start">
                            <div className="relative overflow-hidden bg-[#FEFEFE]/20 backdrop-blur-md border border-[#FEFEFE]/30 text-[#FEFEFE] px-4 py-2 rounded-medium text-sm font-semibold shadow-lg transition-all duration-700 ease-out cursor-pointer group/age">
                              <span className="relative z-10">{program.age}</span>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/50 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEFEFE]/50 to-transparent w-full h-full -translate-x-full group-hover/age:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                            </div>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-lg font-bold leading-tight text-[#FEFEFE] transition-all duration-700 ease-out">
                            {program.title}
                          </h3>
                          
                          {/* Price */}
                          <div className="text-xl font-bold text-[#FEFEFE] transition-all duration-700 ease-out">
                           <span className="text-[#FEFEFE]">{program.price}</span>
                          </div>
                          
                          {/* Buttons Row */}
                          <div className="flex gap-3">
                            <button 
                              onClick={() => openUnifiedSignupModal(getSignupProgramTitle(program))}
                              className="flex-1 relative overflow-hidden bg-gradient-to-r from-brand-green via-accent-brightGreen to-brand-green text-brand-black font-bold py-3 px-4 rounded-medium transition-all duration-700 ease-out flex items-center justify-center gap-2 group/signup shadow-lg hover:shadow-2xl hover:shadow-brand-green/60 hover:scale-105"
                              style={{
                                boxShadow: '0 0 20px #7CF23D/40, 0 0 40px #7CF23D/20, inset 0 0 20px rgba(255,255,255,0.2)'
                              }}
                            >
                              <span className="relative z-10 text-sm text-center">Записаться</span>
                              <Star className="w-4 h-4 group-hover/signup:rotate-180 group-hover/signup:scale-110 transition-all duration-500" />
                              <div className="absolute inset-0 rounded-medium border-2 border-[#FFFFFF]/30 pointer-events-none"></div>
                              <div className="absolute inset-1 rounded-medium border border-[#FFFFFF]/20 pointer-events-none"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/60 to-transparent w-full h-full -translate-x-full animate-shimmer"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white/40 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white/50 to-transparent w-full h-full -translate-x-full group-hover/signup:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                            </button>
                            
                            <button 
                              onClick={() => openModal(actualIndex)}
                              className="flex-1 relative overflow-hidden bg-brand-white/20 backdrop-blur-md border border-brand-white/30 hover:bg-brand-white/90 text-brand-white hover:text-brand-black font-semibold py-3 px-4 rounded-medium transition-all duration-700 ease-out flex items-center justify-center gap-2 group/button shadow-lg"
                            >
                              <span className="relative z-10 text-sm text-center">Подробнее</span>
                              <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-700 ease-out" />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white/40 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white/50 to-transparent w-full h-full -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 ease-out transform -skew-x-12"></div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6 px-4">
              {programs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-700 ease-out backdrop-blur-sm border border-white/20 ${
                    index === currentSlide 
                      ? 'bg-brand-blue scale-125 shadow-lg shadow-brand-blue/50' 
                      : 'bg-white/30 hover:bg-white/50 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedProgram !== null && programs[selectedProgram].fullDescription && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleModalClick}
        >
          <div className="bg-brand-white rounded-medium max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-brand-white border-b border-gray-200 p-card flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-brand-black">{programs[selectedProgram].title}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="bg-brand-green text-brand-black px-3 py-1 rounded-full text-sm font-semibold">
                    {programs[selectedProgram].age}
                  </span>
                  <span className="text-2xl font-bold text-brand-green">
                    {programs[selectedProgram].price}
                  </span>
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-card">
              <div className="grid md:grid-cols-2 gap-gap mb-8">
                <div className="bg-brand-blue bg-opacity-10 p-card rounded-small">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-brand-blue" />
                    <h3 className="text-lg font-semibold text-brand-black">Формат занятий</h3>
                  </div>
                  <p className="text-gray-700">{programs[selectedProgram].fullDescription!.duration}</p>
                  <p className="text-gray-600 text-sm mt-2">{programs[selectedProgram].fullDescription!.period}</p>
                </div>

                <div className="bg-brand-green bg-opacity-10 p-card rounded-small">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-brand-green" />
                    <h3 className="text-lg font-semibold text-brand-black">Основные направления</h3>
                  </div>
                  <ul className="space-y-2">
                    {programs[selectedProgram].fullDescription!.mainSkills.map((skill, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-brand-green rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-brand-blue" />
                  <h3 className="text-xl font-semibold text-brand-black">Цели обучения</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {programs[selectedProgram].fullDescription!.goals}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Code className="w-6 h-6 text-brand-green" />
                  <h3 className="text-xl font-semibold text-brand-black">Что изучит ребенок</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {programs[selectedProgram].fullDescription!.skills.map((skill, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-small">
                      <div className="w-2 h-2 bg-brand-green rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    closeModal();
                    openUnifiedSignupModal(programs[selectedProgram].title);
                  }}
                  className="flex-1 bg-gradient-to-r from-brand-green to-accent-brightGreen text-brand-black py-2 md:py-4 px-4 md:px-6 rounded-full md:rounded-small hover:shadow-lg hover:shadow-brand-green/50 transition-all duration-300 font-semibold text-sm md:text-lg flex items-center justify-center gap-2 md:gap-3 group relative overflow-hidden"
                  style={{
                    boxShadow: 'inset 0 0 50px #00FF00, inset 0 0 100px #00FF00, 0 0 50px #00FF00, 0 0 100px #00FF00, 0 0 150px #00FF00'
                  }}
                >
                  <span className="relative z-10">Записаться бесплатно</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-12 group-hover:opacity-0 transition-all duration-500 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/70 to-transparent w-full h-full -translate-x-full animate-shimmer"></div>
                </button>
                <button 
                  onClick={() => {
                    closeModal();
                    openQuestionModal();
                  }}
                  className="flex-1 border-2 border-brand-blue text-brand-blue py-2 md:py-4 px-4 md:px-6 rounded-full md:rounded-small hover:bg-brand-blue hover:text-brand-white transition-colors font-semibold text-sm md:text-lg flex items-center justify-center gap-2 group"
                >
                  <span className="relative z-10">
                    <span className="md:hidden">Есть вопрос?</span>
                    <span className="hidden md:inline">Задать вопрос</span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showUnifiedSignupModal && (
        <UnifiedSignupModal 
          onClose={closeUnifiedSignupModal}
          selectedProgram={selectedProgramForSignup}
        />
      )}

      {/* Question Modal */}
      {showQuestionModal && (
        <QuestionModal onClose={closeQuestionModal} />
      )}
    </>
  );
};

export default Programs;

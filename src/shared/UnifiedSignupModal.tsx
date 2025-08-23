import React, { useState } from 'react';
import { X, User, Baby, Phone, ArrowRight, Check, AlertCircle } from 'lucide-react';
import sendLead from '../shared/sendLead';
import { trackEvent } from './analytics';

interface UnifiedSignupModalProps {
  onClose: () => void;
  initialPhone?: string;
  selectedProgram?: string;
}

const UnifiedSignupModal: React.FC<UnifiedSignupModalProps> = ({ 
  onClose, 
  initialPhone = '',
  selectedProgram = ''
}) => {
  // Функция для определения возрастной группы по названию программы
  const getAgeGroupFromProgram = (programTitle: string) => {
    if (programTitle.includes('8-10') || programTitle.includes('Компьютерная грамотность')) {
      return 'Компьютерная грамотность и первые игры (8-10 лет)';
    }
    if (programTitle.includes('10-12') || programTitle.includes('Мобильные приложения')) {
      return 'Мобильные приложения и веб-разработка (10-12 лет)';
    }
    if (programTitle.includes('13+') || programTitle.includes('Профессиональная')) {
      return 'Профессиональная IT-разработка (13+ лет)';
    }
    return '';
  };

  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    ageGroup: getAgeGroupFromProgram(selectedProgram),
    phone: initialPhone,
    consent: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Маска для телефона
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    
    let cleanNumbers = numbers;
    if (numbers.startsWith('7') || numbers.startsWith('8')) {
      cleanNumbers = numbers.slice(1);
    }
    
    if (cleanNumbers.length === 0) return '';
    
    if (cleanNumbers.length <= 3) return `+7 (${cleanNumbers}`;
    if (cleanNumbers.length <= 6) return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3)}`;
    if (cleanNumbers.length <= 8) return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3, 6)}-${cleanNumbers.slice(6)}`;
    return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3, 6)}-${cleanNumbers.slice(6, 8)}-${cleanNumbers.slice(8, 10)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'phone') {
      if (value === '') {
        setFormData(prev => ({ ...prev, [name]: '' }));
      } else {
        const formatted = formatPhone(value);
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
    } else {
      setFormData(prev => ({
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Пожалуйста, укажите ваше имя';
    }
    
    if (!formData.childName.trim()) {
      newErrors.childName = 'Пожалуйста, укажите имя ребенка';
    }
    
    if (!formData.ageGroup) {
      newErrors.ageGroup = 'Пожалуйста, выберите возрастную группу';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Пожалуйста, укажите номер телефона';
    } else if (formData.phone.length < 18) {
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
      
      setTimeout(() => {
        setFocusedField(fieldName);
        element.focus();
        
        setTimeout(() => {
          setFocusedField(null);
        }, 3000);
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      const firstErrorField = Object.keys(validationErrors)[0];
      scrollToField(firstErrorField);
      return;
    }

    setIsSubmitting(true);

    try {
      const ok = await sendLead({
        name: formData.parentName,
        phone: formData.phone,
        program: formData.ageGroup,
        source: "unified-signup-modal",
      });

      trackEvent(ok ? "lead_success" : "lead_fail", { where: "UnifiedSignupModal" });
      
      alert('Спасибо за заявку! Мы свяжемся с вами в течение рабочего дня для записи на бесплатное занятие.');
      onClose();
    } catch (error) {
      alert('Произошла ошибка. Попробуйте еще раз или позвоните нам.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleModalClick}
    >
      <div 
        className="bg-[#FEFEFE] rounded-medium max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FEFEFE] border-b border-gray-200 p-6 flex items-center justify-between rounded-t-medium">
          <div>
            <h2 className="text-2xl font-bold text-[#0F0F23]">Записаться на занятие</h2>
            <p className="text-sm text-gray-600 mt-1">Заполните форму, и мы свяжемся с вами в течение рабочего дня</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Телефон */}
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
              className={getFieldClassName('phone')}
              placeholder="+7 (___) ___-__-__"
            />
            {errors.phone && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fade-in-up">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>

          {/* Имя родителя */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 text-[#3D9DF2]" />
              Как к вам обращаться? *
            </label>
            <input
              type="text"
              name="parentName"
              required
              value={formData.parentName}
              onChange={handleInputChange}
              className={getFieldClassName('parentName')}
              placeholder="Анна Петрова"
            />
            {errors.parentName && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fade-in-up">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.parentName}</span>
              </div>
            )}
          </div>

          {/* Имя ребенка */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Baby className="w-4 h-4 text-[#7CF23D]" />
              Имя ребенка *
            </label>
            <input
              type="text"
              name="childName"
              required
              value={formData.childName}
              onChange={handleInputChange}
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

          {/* Возрастная группа */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Baby className="w-4 h-4 text-[#7CF23D]" />
              Желаемая программа *
            </label>
            <select
              name="ageGroup"
              required
              value={formData.ageGroup}
              onChange={handleInputChange}
              className={getFieldClassName('ageGroup')}
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
            {errors.ageGroup && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fade-in-up">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.ageGroup}</span>
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
                  checked={formData.consent}
                  onChange={handleInputChange}
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

          {/* Преимущества */}
          <div className="bg-[#7CF23D] bg-opacity-10 p-4 rounded-small">
            <h3 className="font-semibold text-[#0F0F23] mb-2">Что вас ждет:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Бесплатное пробное занятие 90 минут</li>
              <li>• Персональный план обучения для ребенка</li>
              <li>• Без обязательств и скрытых платежей</li>
              <li>• Свяжемся в течение рабочего дня</li>
            </ul>
          </div>

          {/* Submit Button */}
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
              {isSubmitting ? 'Отправляем заявку...' : 'Записаться бесплатно'}
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
  );
};

export default UnifiedSignupModal;
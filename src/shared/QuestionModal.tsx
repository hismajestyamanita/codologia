import React, { useState } from 'react';
import { X, User, Phone, ArrowRight, Check, AlertCircle } from 'lucide-react';
import sendLead from '../shared/sendLead';
import { trackEvent } from './analytics';
import { dispatchToast } from '../shared/GlobalToast';

interface QuestionModalProps {
  onClose: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    consent: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, укажите ваше имя';
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
      // Отправляем лид в Telegram
      const ok = await sendLead({
        name: formData.name,
        phone: formData.phone,
        program: "Вопрос",
        source: "question-modal",
      });      

      trackEvent(ok ? "lead_success" : "lead_fail", { where: "QuestionModal" });
      
      dispatchToast('');
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
            <h2 className="text-2xl font-bold text-[#0F0F23]">Задать вопрос</h2>
            <p className="text-sm text-gray-600 mt-1">Скажите, как с вами связаться, и мы ответим на любой интересующий вас вопрос</p>
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
          {/* Имя */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 text-[#3D9DF2]" />
              Как к вам обращаться? *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
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
              placeholder="+7 (999) 123-45-67"
            />
            {errors.phone && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-fade-in-up">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.phone}</span>
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
          <div className="bg-[#3D9DF2] bg-opacity-10 p-4 rounded-small">
            <h3 className="font-semibold text-[#0F0F23] mb-2">Что вас ждет:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Персональная консультация по программам</li>
              <li>• Ответы на все ваши вопросы</li>
              <li>• Помощь в выборе подходящего курса</li>
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
              {isSubmitting ? 'Отправляем...' : 'Отправить'}
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
  );
};

export default QuestionModal;
import React, { useState } from 'react';
import { X, Calendar, User, Phone, Baby, ArrowRight } from 'lucide-react';
import sendLead from '../shared/sendLead';
import { trackEvent } from './analytics';

interface LeadFormProps {
  onClose: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    childName: '',
    childAge: '',
    preferredDate: '',
    preferredTime: 'morning'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Генерируем даты на месяц вперед
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = daysOfWeek[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      const formattedDate = `${dayOfWeek} ${day} ${month} ${year}`;
      const value = date.toISOString().split('T')[0];
      
      dates.push({ label: formattedDate, value });
    }
    
    return dates;
  };

  const dateOptions = generateDateOptions();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Отправляем лид в Telegram
      const ok = await sendLead({
        name: formData.parentName,
        phone: formData.phone,
        age: formData.childAge,
        program: "Запись на занятие",
        source: "lead-form",
      });

      trackEvent(ok ? "lead_success" : "lead_fail", { where: "LeadForm" });
      
      alert('Спасибо! Мы свяжемся с вами в течение рабочего дня для подтверждения записи.');
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

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleModalClick}
    >
      <div 
        className="bg-[#FEFEFE] rounded-medium max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FEFEFE] border-b border-gray-200 p-card flex items-center justify-between rounded-t-medium">
          <div>
            <h2 className="text-2xl font-bold text-[#0F0F23]">Записаться на занятие</h2>
            <p className="text-sm text-gray-600 mt-1">Заполните форму, и мы свяжемся с вами</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-card space-y-6">
          {/* Имя родителя */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 text-[#3D9DF2]" />
              Ваше имя *
            </label>
            <input
              type="text"
              name="parentName"
              required
              value={formData.parentName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-small focus:ring-2 focus:ring-[#3D9DF2] focus:border-transparent transition-all"
              placeholder="Анна Петрова"
            />
          </div>

          {/* Телефон */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 text-[#3D9DF2]" />
              Телефон *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-small focus:ring-2 focus:ring-[#3D9DF2] focus:border-transparent transition-all"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          {/* Имя ребенка и возраст */}
          <div className="grid grid-cols-2 gap-4">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-small focus:ring-2 focus:ring-[#3D9DF2] focus:border-transparent transition-all"
                placeholder="Максим"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-[#7CF23D]" />
                Возраст *
              </label>
              <select
                name="childAge"
                required
                value={formData.childAge}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-small focus:ring-2 focus:ring-[#3D9DF2] focus:border-transparent transition-all"
              >
                <option value="">Выберите</option>
                {Array.from({ length: 12 }, (_, i) => i + 7).map(age => (
                  <option key={age} value={age}>{age} лет</option>
                ))}
              </select>
            </div>
          </div>

          {/* Желаемая дата */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 text-[#3D9DF2]" />
              Желаемая дата занятия
            </label>
            <select
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-small focus:ring-2 focus:ring-[#3D9DF2] focus:border-transparent transition-all text-base custom-scrollbar"
            >
              <option value="">Выберите удобную дату</option>
              {dateOptions.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value}
                  className="py-3 px-4 text-base hover:bg-[#3D9DF2] hover:text-white"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Время */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Удобное время
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="preferredTime"
                  value="morning"
                  checked={formData.preferredTime === 'morning'}
                  onChange={handleInputChange}
                  className="text-[#3D9DF2] focus:ring-[#3D9DF2]"
                />
                <span className="text-sm">Утром (9:00-12:00)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="preferredTime"
                  value="afternoon"
                  checked={formData.preferredTime === 'afternoon'}
                  onChange={handleInputChange}
                  className="text-[#3D9DF2] focus:ring-[#3D9DF2]"
                />
                <span className="text-sm">Днем (12:00-16:00)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="preferredTime"
                  value="evening"
                  checked={formData.preferredTime === 'evening'}
                  onChange={handleInputChange}
                  className="text-[#3D9DF2] focus:ring-[#3D9DF2]"
                />
                <span className="text-sm">Вечером (16:00-19:00)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="preferredTime"
                  value="weekend"
                  checked={formData.preferredTime === 'weekend'}
                  onChange={handleInputChange}
                  className="text-[#3D9DF2] focus:ring-[#3D9DF2]"
                />
                <span className="text-sm">Выходные</span>
              </label>
            </div>
          </div>

          {/* Преимущества */}
          <div className="bg-[#7CF23D] bg-opacity-10 p-4 rounded-small">
            <h3 className="font-semibold text-[#0F0F23] mb-2">Что вас ждет:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Бесплатное пробное занятие 90 минут</li>
              <li>• Персональный план обучения</li>
              <li>• Без обязательств и скрытых платежей</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full relative overflow-hidden bg-[#7CF23D] text-[#0F0F23] py-4 rounded-small hover:bg-green-400 hover:scale-105 hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">
              {isSubmitting ? 'Отправляем...' : 'Записаться бесплатно'}
            </span>
            {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />}
            {/* Блик */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/40 to-transparent w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out transform -skew-x-12"></div>
          </button>

          <p className="text-xs text-gray-500 text-center">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
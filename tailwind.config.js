/** @type {import('tailwindcss').Config} */
import { colors as brandColors } from './src/shared/colors.ts';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 🎨 Фирменные цвета
      colors: {
        brand: brandColors.brand,
        accent: brandColors.accent,
      },
      fontFamily: {
        'sans': ['Manrope', 'sans-serif'],
      },
      letterSpacing: {
        'tight-1': '-0.01em',
        'tight-4': '-0.04em',
      },
      // 🎨 СИСТЕМА ЗАКРУГЛЕНИЙ
      borderRadius: {
        'small': '12px',    // Маленькое закругление
        'medium': '24px',   // Среднее закругление  
        'large': '32px',    // Большое закругление
        'full': '9999px'    // Полностью круглое
      },
      // 📏 СИСТЕМА ОТСТУПОВ
      spacing: {
        'content': '32px',  // Основные отступы контента
        'card': '24px',     // Отступы внутри карточек
        'gap': '24px',      // Промежутки между элементами
        'gap-small': '16px' // Маленькие промежутки
      }
    },
  },
  plugins: [],
};

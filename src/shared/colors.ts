// 🎨 Фирменная цветовая палитра Кодология
export const colors = {
  // Основные фирменные цвета
  brand: {
    black: '#01060C',      // Фирменный черный (обновлен)
    blue: '#3D9DF2',       // Фирменный голубой
    green: '#7CF23D',      // Фирменный зеленый
    white: '#FEFEFE',      // Фирменный белый
  },
  
  // Дополнительные цвета
  accent: {
    brightGreen: '#00FF41', // Яркий зеленый для градиентов
    lightGreen: '#90EE90',  // Светло-зеленый для градиентов
  },
  
  // Системные цвета
  system: {
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    red: {
      50: '#FEF2F2',
      500: '#EF4444',
    },
    white: '#FFFFFF',
    transparent: 'transparent',
  }
} as const;

// Типы для TypeScript
export type BrandColors = typeof colors.brand;
export type AccentColors = typeof colors.accent;
export type SystemColors = typeof colors.system;
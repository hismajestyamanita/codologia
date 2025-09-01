import React from 'react';

type Props = {
  value: string;                      // только 10 цифр
  onChange: (digits: string) => void; // наружу отдаём 10 цифр
  inputClassName?: string;            // классы инпута (берём из getFieldClassName, чтобы совпасть со стилем других полей)
  size?: 'default' | 'hero';          // hero — крупнее
  placeholder?: string;               // по умолчанию "960 123-45-67"
};

export default function PhoneInput({
  value,
  onChange,
  inputClassName = '',
  size = 'default',
  placeholder = '960 123-45-67',
}: Props) {
  const digits = (value || '').replace(/\D/g, '').slice(0, 10);

  // Формат "XXX XXX-XX-XX"
  const fmt = (d: string) => {
    if (!d) return '';
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
    if (d.length <= 8) return `${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
  };

  const base = size === 'hero'
    ? 'h-12 text-base md:h-14 md:text-lg'   // крупнее для Hero
    : 'h-11 text-base';                     // как у остальных полей

  return (
    <div className="relative w-full">
      {/* фиксированный префикс +7, не перехватывает клики */}
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 select-none">+7</span>
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        className={[
          // чтобы выглядеть ТОЧНО как другие поля — классы инпута передаём снаружи
          'w-full pl-12 pr-4 rounded-small border outline-none',
          'placeholder-gray-400',
          'focus:ring-2 focus:ring-green-300 focus:border-green-400',
          base,
          inputClassName,
        ].join(' ')}
        value={fmt(digits)}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
        placeholder={placeholder}
      />
    </div>
  );
}

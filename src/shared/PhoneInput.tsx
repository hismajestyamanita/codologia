import React from 'react';

type Props = {
  value: string;                      // храним только 10 цифр
  onChange: (digits: string) => void; // наружу отдаём 10 цифр
  inputClassName?: string;            // классы инпута (берём из твоей формы, чтобы стиль совпал)
  size?: 'default' | 'hero';          // hero — крупнее на первом экране
  placeholder?: string;               // дефолт: "960 123-45-67"
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
    ? 'h-12 text-base md:h-14 md:text-lg'
    : 'h-11 text-base';

  return (
    <div className="relative w-full">
      {/* фиксированный префикс +7 — ЧЁРНЫЙ, клики не перехватывает */}
      <span
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 select-none"
        aria-hidden="true"
      >
        +7
      </span>

      {/* ВАЖНО: никаких своих бордеров/скруглений/колец.
          Всё приходит из inputClassName, чтобы поле выглядело как остальные. */}
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        className={[
          'w-full pl-12 pr-4',
          'placeholder-gray-400',
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

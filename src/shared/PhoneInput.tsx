import React from 'react';

type Props = {
  value: string;
  onChange: (digits: string) => void;
  inputClassName?: string;
  size?: 'default' | 'hero';
  placeholder?: string;
};

export default function PhoneInput({
  value,
  onChange,
  inputClassName = '',
  size = 'default',
  placeholder = '960 123-45-67',
}: Props) {
  const digits = (value || '').replace(/\D/g, '').slice(0, 10);

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
      {/* фиксированный префикс +7, стилизуем идентично тексту */}
      <span
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-normal text-base md:text-lg leading-none tracking-tight"
      >
        +7
      </span>

      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        className={[
          'w-full pl-14 pr-4', // увеличил отступ слева, чтобы цифры начинались после +7 без лишнего зазора
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

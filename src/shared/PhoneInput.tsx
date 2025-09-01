import React, { useState } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
}

export default function PhoneInput({ value, onChange }: PhoneInputProps) {
  // Берём только цифры
  const digits = value.replace(/\D/g, '').slice(0, 10);

  // Форматируем как (XXX) XXX-XX-XX
  let formatted = '';
  if (digits.length > 0) {
    formatted = `(${digits.slice(0, 3)}`;
    if (digits.length >= 4) formatted += `) ${digits.slice(3, 6)}`;
    if (digits.length >= 7) formatted += `-${digits.slice(6, 8)}`;
    if (digits.length >= 9) formatted += `-${digits.slice(8, 10)}`;
  }

  return (
    <div className="flex items-center border rounded px-2 py-2">
      <span className="mr-2 font-medium">+7</span>
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={15}
        className="flex-1 outline-none"
        value={formatted}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
          onChange(raw);
        }}
        placeholder="(XXX) XXX-XX-XX"
      />
    </div>
  );
}

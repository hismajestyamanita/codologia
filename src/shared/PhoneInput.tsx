import React from "react";

interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  inputClassName?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "(___) ___-__-__",
  inputClassName = "",
}) => {
  // форматирование телефона: 9601234567 → 960 123-45-67
  const fmt = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    const parts = [];
    if (digits.length > 0) parts.push(digits.substring(0, 3));
    if (digits.length > 3) parts.push(digits.substring(3, 6));
    if (digits.length > 6) parts.push(digits.substring(6, 8));
    if (digits.length > 8) parts.push(digits.substring(8, 10));
    return parts.join(parts.length > 2 ? "-" : " ");
  };

  return (
    <div className="relative w-full">
      {/* Префикс +7 без рамки, без кликабельности */}
      <span
        className={`absolute left-4 top-1/2 -translate-y-1/2 select-none text-gray-700 ${inputClassName}`}
      >
        +7
      </span>

      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        className={[
          "w-full pl-14 pr-4",
          "placeholder-gray-400",
          "border rounded-lg",
          "focus:ring-2 focus:ring-green-400 focus:outline-none",
          "transition-colors",
          inputClassName,
        ].join(" ")}
        value={fmt(value)}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
        }
        placeholder={placeholder}
      />
    </div>
  );
};

export default PhoneInput;

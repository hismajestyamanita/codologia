import React from "react";

interface PhoneInputProps {
  value: string;                  // храним только 10 цифр
  onChange: (val: string) => void;
  placeholder?: string;           // пример: 960 123-45-67
  inputClassName?: string;        // стиль внешней рамки/скругления/фокуса (как у остальных полей)
  size?: "default" | "hero";      // hero — крупнее на первом экране
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "960 123-45-67",
  inputClassName = "",
  size = "default",
}) => {
  // формат: 9601234567 -> 960 123-45-67
  const fmt = (digits: string) => {
    const d = (digits || "").replace(/\D/g, "").slice(0, 10);
    if (!d) return "";
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
    if (d.length <= 8) return `${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
  };

  const base = size === "hero"
    ? "h-12 text-base md:h-14 md:text-lg"
    : "h-11 text-base";

  return (
    <div className="relative z-0 w-full">
      <input
        type="tel"
        inputMode="numeric"
        // ВАЖНО: НЕ ставим pattern, иначе HTML-валидация ругается на пробелы/дефисы.
        className={[
          "w-full pr-4",
          "placeholder-gray-400",
          base,
          inputClassName,
          "pl-12 relative", // отступ под +7
        ].join(" ")}
        value={fmt(value)}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
        }
        placeholder={placeholder}
      />

      {/* префикс +7 через псевдоэлемент */}
      <style jsx>{`
        input[type="tel"]::before {
          content: "+7";
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: inherit;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          line-height: inherit;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default PhoneInput;

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

  // Отступ цифр под сдвинутый префикс +7
  const padLeftPx = size === "hero" ? 64 : 58;

  return (
    <div className="relative w-full">
      {/* Префикс +7: без рамок, клики не перехватывает, шрифт наследует от инпута */}
      <span
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-5 select-none text-current"
        style={{
          fontFamily: "inherit",
          fontSize: "inherit",
          lineHeight: "inherit",
          fontWeight: "inherit",
        }}
        aria-hidden="true"
      >
        +7
      </span>

      <input
        type="tel"
        inputMode="numeric"
        // ВАЖНО: НЕ ставим pattern, иначе HTML-валидация ругается на пробелы/дефисы.
        className={[
          "w-full pr-4",
          "placeholder-gray-400",
          base,
          inputClassName, // внешняя рамка/скругление/фокус — как у остальных полей
        ].join(" ")}
        style={{ paddingLeft: `${padLeftPx}px` }}
        value={fmt(value)}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
        placeholder={placeholder}
      />
    </div>
  );
};

export default PhoneInput;

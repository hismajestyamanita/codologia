import React from "react";

interface PhoneInputProps {
  value: string;                  // храним только 10 цифр
  onChange: (val: string) => void;
  placeholder?: string;           // отображаем: 960 123-45-67
  inputClassName?: string;        // сюда прилетает стиль ОТ ДРУГИХ ПОЛЕЙ ( внешняя рамка/скругление/фокус )
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
    <div className="relative w-full">
      {/* префикс +7: НЕ имеет бордера и не перехватывает клики */}
      <span
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 select-none text-gray-700"
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
        pattern="[0-9]*"
        // ВАЖНО: здесь НЕТ своих border/rounded/focus классов —
        // внешний контур придёт из inputClassName, как у остальных полей
        className={[
          "w-full pl-14 pr-4",
          "placeholder-gray-400",
          base,
          inputClassName, // <-- тянем внешний стиль поля формы
        ].join(" ")}
        value={fmt(value)}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
        placeholder={placeholder}
      />
    </div>
  );
};

export default PhoneInput;

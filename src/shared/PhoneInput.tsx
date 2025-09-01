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

  // Высота поля на уровне кнопки: делаем 56px (h-14) для hero и 48px (h-12) по умолчанию
  const base = size === "hero"
    ? "h-14 text-base md:h-14 md:text-lg"
    : "h-12 text-base";

  return (
    <div className="flex items-center w-full relative z-0">
      <span
        className="pl-4 pr-2 text-current select-none"
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
        className={[
          "flex-1 w-full pr-4",
          "placeholder-gray-400",
          base,
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

import React from "react";

interface PhoneInputProps {
  value: string;                  // храним только 10 цифр
  onChange: (val: string) => void;
  placeholder?: string;           // пример: 960 123-45-67
  inputClassName?: string;        // СТИЛЬ РАМКИ/ФОКУСА — применяем к ОБОЛОЧКЕ
  size?: "default" | "hero";      // hero — крупнее на первом экране
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "960 123-45-67",
  inputClassName = "",
  size = "default",
}) => {
  // 9601234567 -> 960 123-45-67
  const fmt = (digits: string) => {
    const d = (digits || "").replace(/\D/g, "").slice(0, 10);
    if (!d) return "";
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
    if (d.length <= 8) return `${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
  };

  // высота/кегль берём на ОБОЛОЧКЕ, чтобы всё внутри совпадало
  const shellBase =
    size === "hero"
      ? "h-14 md:h-14 text-base md:text-lg inline-flex w-auto px-5 md:px-6 whitespace-nowrap"
      : "h-11 text-base w-full px-4 inline-flex";

  return (
    // ОБОЛОЧКА: сюда прилетит твой inputClassName (рамка, закругление, фокус)
    <div className={["relative z-0 flex items-center", shellBase, inputClassName, "focus-within:ring-inherit"].join(" ")}>
      {/* +7 — часть потока, один шрифт с цифрами */}
      <span className="select-none text-current mr-[0.5ch]">+7</span>

      {/* Сам инпут — прозрачный, без своей рамки, держит только текст */}
      <input
        type="tel"
        inputMode="numeric"
        className={[
          "h-full bg-transparent outline-none border-0 focus:outline-none",
          size === "hero" ? "w-[12.5ch] md:w-[14ch]" : "w-full flex-1",
          "placeholder-gray-400",
        ].join(" ")}
        value={fmt(value)}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
        placeholder={placeholder}
      />
    </div>
  );
};

export default PhoneInput;

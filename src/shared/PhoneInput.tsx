import React from "react";

type Props = {
  value: string;                      // 10 цифр без +7
  onChange: (digits: string) => void; // наружу отдаём 10 цифр
  inputClassName?: string;            // классы поля (внешняя рамка/фокус/скругление)
  size?: "default" | "hero";          // hero — крупнее для первого экрана
  placeholder?: string;               // "960 123-45-67"
};

export default function PhoneInput({
  value,
  onChange,
  inputClassName = "",
  size = "default",
  placeholder = "960 123-45-67",
}: Props) {
  const digits = (value || "").replace(/\D/g, "").slice(0, 10);

  // формат "XXX XXX-XX-XX"
  const fmt = (d: string) => {
    if (!d) return "";
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
    if (d.length <= 8) return `${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
  };

  // размеры текста инпута как у остальных полей
  const base = size === "hero"
    ? "h-12 text-base md:h-14 md:text-lg"
    : "h-11 text-base";

  // тонкая подгонка зазора между +7 и цифрами (двинул вправо)
  const padLeftPx = size === "hero" ? 64 : 58; // было тесно — добавил +4px

  return (
    <div className="relative z-0 w-full">
      {/* +7 — без рамок, клики не перехватывает, шрифт наследует от инпута */}
      <span
        className="pointer-events-none absolute z-0 left-5 top-1/2 -translate-y-1/2 select-none text-current"
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
          "relative z-0 w-full pr-4",
          "placeholder-gray-400",
          base,
          inputClassName, // внешняя рамка/фокус/скругление приходят отсюда
        ].join(" ")}
        style={{ paddingLeft: `${padLeftPx}px` }}
        value={fmt(digits)}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
        }
        placeholder={placeholder}
      />
    </div>
  );
}

import React from "react";

type Props = {
  value: string;
  onChange: (digits: string) => void;
  inputClassName?: string;
  size?: "default" | "hero";
  placeholder?: string;
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

  const base =
    size === "hero"
      ? "h-12 text-base md:h-14 md:text-lg"
      : "h-11 text-base";

  return (
    <div className="relative z-0 w-full flex items-center">
      <span
        className="text-current ml-4"
        style={{
          fontFamily: "inherit",
          fontSize: "inherit",
          lineHeight: "inherit",
          fontWeight: "inherit",
        }}
      >
        +7&nbsp;
      </span>
      <input
        type="tel"
        inputMode="numeric"
        className={[
          "w-full pr-4 outline-none",
          "placeholder-gray-400",
          base,
          inputClassName,
        ].join(" ")}
        style={{ paddingLeft: 0 }}
        value={fmt(digits)}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
        }
        placeholder={placeholder}
      />
    </div>
  );
}

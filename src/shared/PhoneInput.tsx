import React, { useState, useEffect, useRef } from "react";

interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  inputClassName?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  className = "",
  inputClassName = "",
}) => {
  const [internalValue, setInternalValue] = useState(value.replace(/^\+7/, ""));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value.replace(/^\+7/, ""));
  }, [value]);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    let result = "";

    if (digits.length > 0) {
      result = digits.slice(0, 3);
    }
    if (digits.length >= 4) {
      result += " " + digits.slice(3, 6);
    }
    if (digits.length >= 7) {
      result += "-" + digits.slice(6, 8);
    }
    if (digits.length >= 9) {
      result += "-" + digits.slice(8, 10);
    }

    return result;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setInternalValue(raw);
    onChange("+7" + raw);
  };

  const displayValue = formatPhone(internalValue);

  return (
    <div className={`relative w-full ${className}`}>
      <span
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-5 select-none text-current z-0"
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
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        className={[
          "relative z-0 w-full pr-4",
          "placeholder-gray-400",
          "appearance-none block rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-base",
          inputClassName,
        ].join(" ")}
        style={{ paddingLeft: "3rem" }}
        value={displayValue}
        onChange={handleChange}
        placeholder="000 000-00-00"
      />
    </div>
  );
};

export default PhoneInput;

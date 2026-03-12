import React from "react";

interface TextareaProps {
  name?: string; // ✅ changed to optional
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

const TextArea: React.FC<TextareaProps> = ({
  name,
  placeholder = "Enter your message",
  rows = 3,
  value = "",
  onChange,
  className = "",
  disabled = false,
  error = false,
  hint = "",
}) => {
  return (
    <div className="relative">
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${
          className
        } ${
          disabled
            ? "bg-gray-100 opacity-50 text-gray-500 cursor-not-allowed"
            : ""
        } ${
          error
            ? "border-error-500 focus:ring-error-500/10"
            : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10"
        }`}
      />

      {hint && (
        <p
          className={`mt-2 text-sm ${
            error
              ? "text-error-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;
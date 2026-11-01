import { Checkbox as HeadlessCheckbox } from "@headlessui/react";
import clsx from "clsx";
import { forwardRef, type ReactNode } from "react";

interface TagCheckboxProps {
  children: ReactNode;
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  value?: string;
  className?: string;
}

export const TagCheckbox = forwardRef<HTMLSpanElement, TagCheckboxProps>(
  (
    {
      children,
      label,
      checked,
      defaultChecked,
      onChange,
      disabled = false,
      name,
      value,
      className,
    },
    ref,
  ) => {
    return (
      <HeadlessCheckbox
        ref={ref}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
        name={name}
        value={value}
        className={clsx(
          // Layout
          "group inline-flex items-center gap-150",
          "rounded-10 bg-neutral-0 border-2",
          "px-250 py-150",

          // Default state
          "border-blue-100 text-neutral-900",

          // Checked state
          "data-checked:border-blue-600",

          // Focus
          "outline-none focus-visible:ring-2",
          "focus-visible:ring-blue-600",

          // Disabled
          "data-disabled:cursor-not-allowed",
          "data-disabled:opacity-50",

          className,
        )}
      >
        {/* Checkbox indicator */}
        <span
          aria-hidden="true"
          className={clsx(
            "flex shrink-0 items-center justify-center",
            "rounded-4 border-2",
            "border-blue-100 bg-white",
            "transition-all duration-200",
            "group-data-checked:border-blue-600",
            "group-data-checked:bg-blue-600",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={clsx(
              "size-4 text-white opacity-0",
              "transition-opacity duration-200",
              "group-data-checked:opacity-100",
            )}
          >
            <path
              d="M5 12.5L10 17L19 7"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {/* Label */}
        <span className="text-preset-6-regular leading-none">{label}</span>
        {children}
      </HeadlessCheckbox>
    );
  },
);

TagCheckbox.displayName = "TagCheckbox";

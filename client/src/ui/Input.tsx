import {
  Description,
  Field,
  Input as HeadlessInput,
  Label,
} from "@headlessui/react";
import clsx from "clsx";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

type InputSize = "default";
type InputVariant = "default";

interface InputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "size" | "className"
> {
  label?: string;
  description?: string;
  error?: string;
  size?: InputSize;
  variant?: InputVariant;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  wrapperClassName?: string;
}

const sizes: Record<InputSize, string> = {
  default: "px-200 py-150 text-preset-6-regular",
};

const variants: Record<InputVariant, string> = {
  default: "border border-neutral-400 bg-neutral-0",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      size = "default",
      variant = "default",
      startIcon,
      endIcon,
      fullWidth = false,
      className,
      wrapperClassName,
      disabled,
      required,
      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(error);

    return (
      <Field
        disabled={disabled}
        className={clsx(
          "flex flex-col gap-1.5",
          fullWidth && "w-full",
          wrapperClassName,
        )}
      >
        {label && (
          <Label className="text-sm font-medium text-gray-700 data-disabled:opacity-50">
            {label}
            {required && (
              <span aria-hidden="true" className="ml-1 text-red-700">
                *
              </span>
            )}
          </Label>
        )}

        <div className="relative">
          {startIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              {startIcon}
            </span>
          )}

          <HeadlessInput
            {...props}
            ref={ref}
            disabled={disabled}
            required={required}
            invalid={hasError}
            className={clsx(
              "rounded-10 block w-full transition-all outline-none",
              "placeholder:text-neutral-600",
              "data-focus:border-neutral-600",
              "focus-visible:ring-2 focus-visible:ring-blue-600",
              "focus-visible:ring-offset-2",
              "data-disabled:cursor-not-allowed data-disabled:bg-gray-100 data-disabled:opacity-60",
              variants[variant],
              sizes[size],
              hasError
                ? "border-red-700 focus:border-red-700"
                : "focus:border-neutral-600",
              startIcon && "pl-10",
              endIcon && "pr-10",
              className,
            )}
          />

          {endIcon && (
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              {endIcon}
            </span>
          )}
        </div>

        {error ? (
          <Description
            role="alert"
            className="gap-075 text-preset-9 flex items-center text-red-700"
          >
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.8125 0.1875C9 0.1875 11.625 2.8125 11.625 6C11.625 9.21094 9 11.8125 5.8125 11.8125C2.60156 11.8125 0 9.21094 0 6C0 2.8125 2.60156 0.1875 5.8125 0.1875ZM5.8125 2.76562C5.25 2.76562 4.82812 3.21094 4.82812 3.75C4.82812 4.3125 5.25 4.73438 5.8125 4.73438C6.35156 4.73438 6.79688 4.3125 6.79688 3.75C6.79688 3.21094 6.35156 2.76562 5.8125 2.76562ZM7.125 8.71875V8.15625C7.125 8.01562 6.98438 7.875 6.84375 7.875H6.5625V5.53125C6.5625 5.39062 6.42188 5.25 6.28125 5.25H4.78125C4.61719 5.25 4.5 5.39062 4.5 5.53125V6.09375C4.5 6.25781 4.61719 6.375 4.78125 6.375H5.0625V7.875H4.78125C4.61719 7.875 4.5 8.01562 4.5 8.15625V8.71875C4.5 8.88281 4.61719 9 4.78125 9H6.84375C6.98438 9 7.125 8.88281 7.125 8.71875Z"
                fill="#E60013"
              />
            </svg>
            <span>{error}</span>
          </Description>
        ) : description ? (
          <Description className="text-xs text-gray-500">
            {description}
          </Description>
        ) : null}
      </Field>
    );
  },
);

Input.displayName = "Input";

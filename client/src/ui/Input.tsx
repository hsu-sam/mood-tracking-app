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
  default: "border border-neutral-300 bg-neutral-0",
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
            {required && <span className="ml-1 text-red-500">*</span>}
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
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
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
          <Description className="text-xs text-red-600">{error}</Description>
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

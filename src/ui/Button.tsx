import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import { forwardRef, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonSize = "sm" | "md";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary:
    "bg-neutral-0 text-gray-900  border border-neutral-300 hover:border-neutral-900",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-200 py-100 text-preset-6",
  md: "px-400 py-150 text-preset-5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      startIcon,
      endIcon,
      className,
      disabled = false,
      type = "button",
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <HeadlessButton
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={clsx(
          "inline-flex items-center justify-center gap-2",
          "rounded-lg font-medium transition-colors duration-200",
          "focus:outline-none focus-visible:ring-2",
          "focus-visible:ring-blue-600 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
      >
        {isLoading ? (
          <>
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            />
            <span>{children}</span>
          </>
        ) : (
          <>
            {startIcon}
            <span>{children}</span>
            {endIcon}
          </>
        )}
      </HeadlessButton>
    );
  },
);

Button.displayName = "Button";

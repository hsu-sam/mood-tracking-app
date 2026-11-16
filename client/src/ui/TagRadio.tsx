import { Radio, RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import type { ReactNode } from "react";

interface Option<T> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface TagRadioGroupProps<T extends string | number> {
  /** Accessible name for the group, usually the question text. */
  "aria-labelledby": string;
  value: T | null;
  onChange: (value: T) => void;
  options: Option<T>[];
  className?: string;
}

/**
 * Single-choice answers as a real radio group: arrow keys move between
 * options, and screen readers announce "1 of 5, selected".
 */
export function TagRadioGroup<T extends string | number>({
  value,
  onChange,
  options,
  className,
  ...aria
}: TagRadioGroupProps<T>) {
  return (
    <RadioGroup
      value={value ?? undefined}
      onChange={onChange}
      aria-labelledby={aria["aria-labelledby"]}
      className={clsx("flex w-full flex-col gap-150", className)}
    >
      {options.map((o) => (
        <Radio
          key={o.value}
          value={o.value}
          className={clsx(
            "group flex w-full cursor-pointer items-center gap-150",
            "rounded-10 bg-neutral-0 border-2 border-blue-200",
            "px-250 py-150 text-neutral-900 outline-none",
            "data-checked:border-blue-600 data-checked:bg-blue-100/50",
            "focus-visible:ring-2 focus-visible:ring-blue-600",
            "focus-visible:ring-offset-2",
          )}
        >
          <span
            aria-hidden="true"
            className={clsx(
              "flex size-5 shrink-0 items-center justify-center rounded-full",
              "border-2 border-neutral-400 bg-white",
              "group-data-checked:border-blue-600",
            )}
          >
            <span className="size-2.5 rounded-full bg-blue-600 opacity-0 group-data-checked:opacity-100" />
          </span>
          <span className="text-preset-6-regular leading-none">{o.label}</span>
          {o.icon}
        </Radio>
      ))}
    </RadioGroup>
  );
}

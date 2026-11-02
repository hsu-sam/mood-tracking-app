import clsx from "clsx";

interface StepperProps {
  steps: number;
  currentStep: number;
  className?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export function Stepper({
  steps,
  currentStep,
  className,
  activeColor = "bg-blue-600",
  inactiveColor = "bg-blue-200",
}: StepperProps) {
  return (
    <div
      className={clsx("grid gap-2", className)}
      style={{
        gridTemplateColumns: `repeat(${steps}, minmax(0, 1fr))`,
      }}
      role="group"
      aria-label={`Step ${currentStep} of ${steps}`}
    >
      {Array.from({ length: steps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;

        return (
          <div
            key={stepNumber}
            className={clsx(
              "h-075 rounded-full transition-colors duration-300",
              isActive ? activeColor : inactiveColor,
            )}
          />
        );
      })}
    </div>
  );
}

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import clsx from "clsx";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
  closeOnBackdropClick = true,
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={closeOnBackdropClick ? onClose : () => {}}
      className="relative z-50"
    >
      {/* Backdrop */}
      <DialogBackdrop
        transition
        className={clsx(
          "fixed inset-0 bg-[#22234F]/60 backdrop-blur-sm",
          "transition-opacity duration-300",
          "data-closed:opacity-0",
        )}
      />

      {/* Centered container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className={clsx(
              "relative w-full max-w-lg rounded-2xl bg-white",
              "p-6 shadow-xl sm:p-8",
              "transition duration-300 ease-out",
              "data-closed:scale-95 data-closed:opacity-0",
              className,
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="mb-6 flex items-center justify-between gap-4">
                {title ? (
                  <DialogTitle className="text-xl font-semibold text-[#22234F]">
                    {title}
                  </DialogTitle>
                ) : (
                  <div />
                )}

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    className={clsx(
                      "rounded-md p-1 text-[#9294BE]",
                      "transition-colors hover:text-[#22234F]",
                      "focus-visible:outline-none",
                      "focus-visible:ring-2 focus-visible:ring-[#4D65E8]",
                    )}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="size-5"
                      aria-hidden="true"
                    >
                      <path d="m6 6 12 12M18 6 6 18" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Custom content */}
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

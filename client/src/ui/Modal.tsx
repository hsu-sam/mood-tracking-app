import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import clsx from "clsx";
import type { ReactNode } from "react";

import Close from "../assets/icons/icon-close.svg";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  description,
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
          "backdrop-blur-100 fixed inset-0 bg-neutral-900/40",
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
              "flex flex-col gap-400 p-6 shadow-xl sm:p-8",
              "transition duration-300 ease-out",
              "data-closed:scale-95 data-closed:opacity-0",
              className,
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex flex-col items-center">
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    className={clsx(
                      "self-end text-neutral-300",
                      "transition-colors hover:text-neutral-900",
                      "focus-visible:outline-none",
                      "focus-visible:ring-2 focus-visible:ring-blue-600",
                    )}
                  >
                    <img src={Close} alt="" />
                  </button>
                )}

                {title ? (
                  <DialogTitle className="text-preset-2 self-start">
                    {title}
                  </DialogTitle>
                ) : (
                  <div />
                )}

                {description ? (
                  <Description className="text-preset-6-regular self-start text-neutral-600">
                    {description}
                  </Description>
                ) : (
                  <div />
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

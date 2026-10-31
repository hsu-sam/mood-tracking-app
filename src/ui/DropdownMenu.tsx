import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator,
} from "@headlessui/react";
import clsx from "clsx";

import ChevronDown from "../assets/icons/icon-dropdown-arrow.svg";
import SettingsIcon from "../assets/icons/icon-settings.svg";
import LogoutIcon from "../assets/icons/icon-logout.svg";

interface DropdownMenuProps {
  name: string;
  email: string;
  avatarSrc: string;
  onSettings?: () => void;
  onLogout?: () => void;
}

export function DropdownMenu({
  name,
  email,
  avatarSrc,
  onSettings,
  onLogout,
}: DropdownMenuProps) {
  return (
    <Menu as="div" className="relative inline-block">
      {/* Trigger */}
      <MenuButton
        aria-label="Open account menu"
        className={clsx(
          "group flex items-center gap-125",
          "outline-none focus-visible:ring-2",
          "focus-visible:ring-blue-600",
        )}
      >
        <img
          src={avatarSrc}
          alt=""
          className="size-10 rounded-full object-cover"
        />
        <img src={ChevronDown} alt="" className="group-data-open:rotate-180" />
      </MenuButton>

      {/* Dropdown panel */}
      <MenuItems
        anchor="bottom end"
        transition
        className={clsx(
          "z-50 flex min-w-50 flex-col items-start gap-150",
          "rounded-8 mt-150 origin-top-right bg-white px-200 py-150",
          "transition duration-200 ease-out outline-none",
          "data-closed:scale-95 data-closed:opacity-0",
        )}
      >
        {/* User information */}
        <div className="gap-025 flex flex-col items-start">
          <p className="text-preset-6">{name}</p>
          <p className="text-preset-7 text-neutral-300">{email}</p>
        </div>

        <MenuSeparator className="w-full border border-blue-100 bg-blue-100" />

        {/* Settings */}
        <MenuItem>
          <button
            type="button"
            onClick={onSettings}
            className={clsx(
              "flex w-full items-center gap-5",
              "text-preset-7 text-neutral-900",
              "transition-colors outline-none",
            )}
          >
            <img
              src={SettingsIcon}
              alt=""
              aria-hidden="true"
              className="size-5"
            />
            <span>Settings</span>
          </button>
        </MenuItem>

        {/* Logout */}
        <MenuItem>
          <button
            type="button"
            onClick={onLogout}
            className={clsx(
              "flex w-full items-center gap-5",
              "text-preset-7 text-neutral-900",
              "transition-colors outline-none",
            )}
          >
            <img
              src={LogoutIcon}
              alt=""
              aria-hidden="true"
              className="size-5"
            />
            <span>Logout</span>
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

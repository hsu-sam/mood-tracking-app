import { Outlet } from "react-router";
import { Button } from "../ui/Button";
import { Input } from "./Input";
import { TagCheckbox } from "./TagCheckbox";
import { DropdownMenu } from "./DropdownMenu";
import { Modal } from "./Modal";
import { useState } from "react";

export default function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-light-gradient min-h-screen">
      <header className="flex items-center justify-between p-300">
        <Input label="Full Name" placeholder="Enter your fullname" />
        <TagCheckbox label="Tag" />
        <Button variant="secondary" size="sm">
          Mood tracker
        </Button>
        <DropdownMenu
          name="Lisa Maria"
          email="lisa@mail.com"
          avatarSrc="/assets/images/avatar-lisa.jpg"
        />
      </header>

      <button onClick={() => setOpen(true)}>Open modal</button>

      <Modal open={open} onClose={() => setOpen(false)} title="Log your mood">
        <p className="text-sm text-gray-600">Put any content here.</p>

        <button
          onClick={() => setOpen(false)}
          className="mt-6 w-full rounded-lg bg-[#4D65E8] px-4 py-3 text-white"
        >
          Continue
        </button>
      </Modal>
      <main className="px-300">
        <Outlet />
      </main>
    </div>
  );
}

import { useState } from "react";
import { Button } from "./Button";
import AddMoodmodal from "../components/Modals/AddMoodModal";

function Main() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="flex flex-col gap-800">
      <div className="flex flex-col items-center gap-125">
        <p className="text-preset-3 text-blue-600">Hello, Lisa!</p>

        <h1 className="">How are you feeling today?</h1>

        <p className="text-preset-6 text-neutral-600">
          Wednesday, April 16th, 2025
        </p>
      </div>

      {/* <Button
        className="w-fit self-center"
        onClick={() => setIsModalOpen(true)}
      >
        Log today's mood
      </Button> */}

      <AddMoodmodal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

export default Main;

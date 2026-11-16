import { useState } from "react";
import AddMoodmodal from "../components/Modals/AddMoodModal";
import { Button } from "./Button";
import { useUser } from "../features/auth/useUser";
import { useHomeState } from "../hooks/useMood";

const ordinal = (n: number) => {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
};

// "Wednesday, April 16th, 2025"
const formatToday = (d = new Date()) => {
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const month = d.toLocaleDateString("en-US", { month: "long" });
  return `${weekday}, ${month} ${ordinal(d.getDate())}, ${d.getFullYear()}`;
};

function Main() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();
  const { state, isLoading } = useHomeState();
  const firstName = user?.fullName?.trim().split(/\s+/)[0];

  return (
    <main className="flex flex-col gap-800">
      <div className="flex flex-col items-center gap-125">
        <p className="md:text-preset-3 text-preset-3-mobile text-blue-600">
          Hello, {firstName}!
        </p>

        <h1 className="text-preset-1-mobile md:text-preset-1 text-center">
          How are you feeling today?
        </h1>

        <p className="text-preset-6 text-neutral-600">{formatToday()}</p>
      </div>

      {!isLoading && state !== "logged" && (
        <Button
          className="w-fit self-center"
          onClick={() => setIsModalOpen(true)}
        >
          Log today's mood
        </Button>
      )}

      <AddMoodmodal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

export default Main;

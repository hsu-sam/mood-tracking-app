import { useRecent } from "../hooks/useMood";
import type { MoodEntry } from "../types/mood";
import VeryHappy from "../assets/icons/icon-very-happy-color.svg";
import Happy from "../assets/icons/icon-happy-color.svg";
import Neutral from "../assets/icons/icon-neutral-color.svg";
import Sad from "../assets/icons/icon-sad-color.svg";
import VerySad from "../assets/icons/icon-very-sad-color.svg";

const SLEEP_AXIS = [
  "9+ hours",
  "7-8 hours",
  "5-6 hours",
  "3-4 hours",
  "0-2 hours",
];
const SLEEP_STEPS = [1, 3.5, 5.5, 7.5, 9];

const MOOD_UI: Record<string, { icon: string; bar: string }> = {
  "-2": { icon: VerySad, bar: "bg-red-300" },
  "-1": { icon: Sad, bar: "bg-indigo-200" },
  "0": { icon: Neutral, bar: "bg-blue-300" },
  "1": { icon: Happy, bar: "bg-green-300" },
  "2": { icon: VeryHappy, bar: "bg-amber-300" },
};

// Bar height: 1 of 5 steps for 0-2 hours up to 5 of 5 for 9+ hours
const barHeight = (sleep: number) =>
  `${((SLEEP_STEPS.indexOf(sleep) + 1) / SLEEP_STEPS.length) * 100}%`;

// entryDate is a plain YYYY-MM-DD string: parse by hand to avoid UTC shifts
const formatDay = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return {
    month: new Date(y, m - 1, d).toLocaleDateString("en-US", {
      month: "long",
    }),
    day: String(d).padStart(2, "0"),
  };
};

function Bar({ entry }: { entry: MoodEntry }) {
  const ui = MOOD_UI[String(entry.mood)];
  const { month, day } = formatDay(entry.entryDate);
  return (
    <li className="flex min-w-0 flex-1 flex-col items-center gap-100">
      <div className="flex h-60 w-full items-end justify-center">
        <div
          className={`${ui.bar} relative w-full max-w-10 rounded-full`}
          style={{ height: barHeight(entry.sleepHours) }}
          title={`${entry.moodLabel}, ${entry.sleepLabel}`}
        >
          <img
            src={ui.icon}
            alt={entry.moodLabel}
            className="absolute top-0 left-1/2 w-full -translate-x-1/2"
          />
        </div>
      </div>
      <p className="text-preset-9 text-neutral-600">{month}</p>
      <p className="text-preset-9 font-semibold">{day}</p>
    </li>
  );
}

export default function MoodChart() {
  const { data, isLoading } = useRecent();

  return (
    <div className="flex flex-col gap-300">
      <h2 className="text-preset-3">Mood and sleep trends</h2>
      <div className="flex gap-200">
        <ul className="text-preset-9 flex h-60 flex-col justify-between text-neutral-600">
          {SLEEP_AXIS.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        {!isLoading && (
          <ul className="flex min-w-0 flex-1 items-end gap-150">
            {data?.map((e) => (
              <Bar key={e._id} entry={e} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

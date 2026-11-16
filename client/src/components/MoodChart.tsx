import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRecent } from "../hooks/useMood";
import type { MoodEntry } from "../types/mood";
import VeryHappy from "../assets/icons/icon-very-happy-color.svg";
import VeryHappyWhite from "../assets/icons/icon-very-happy-white.svg";
import Happy from "../assets/icons/icon-happy-color.svg";
import HappyWhite from "../assets/icons/icon-happy-white.svg";
import Neutral from "../assets/icons/icon-neutral-color.svg";
import NeutralWhite from "../assets/icons/icon-neutral-white.svg";
import Sad from "../assets/icons/icon-sad-color.svg";
import SadWhite from "../assets/icons/icon-sad-white.svg";
import VerySad from "../assets/icons/icon-very-sad-color.svg";
import VerySadWhite from "../assets/icons/icon-very-sad-white.svg";

const SLEEP_AXIS = [
  "9+ hours",
  "7-8 hours",
  "5-6 hours",
  "3-4 hours",
  "0-2 hours",
];
const SLEEP_STEPS = [1, 3.5, 5.5, 7.5, 9];

const MOOD_UI: Record<string, { icon: string; white: string; bar: string }> = {
  "-2": { icon: VerySad, white: VerySadWhite, bar: "bg-red-300" },
  "-1": { icon: Sad, white: SadWhite, bar: "bg-indigo-200" },
  "0": { icon: Neutral, white: NeutralWhite, bar: "bg-blue-300" },
  "1": { icon: Happy, white: HappyWhite, bar: "bg-green-300" },
  "2": { icon: VeryHappy, white: VeryHappyWhite, bar: "bg-amber-300" },
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

interface BarProps {
  entry: MoodEntry;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

function Bar({ entry, isOpen, onOpen, onClose, onToggle }: BarProps) {
  const ui = MOOD_UI[String(entry.mood)];
  const { month, day } = formatDay(entry.entryDate);
  const rowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [tipLeft, setTipLeft] = useState<number | null>(null);

  // Place the tooltip beside the bar: right if it fits inside the chart,
  // else left, else clamped to the chart edges. Measured before paint.
  useLayoutEffect(() => {
    if (!isOpen) return setTipLeft(null);
    const row = rowRef.current;
    const bar = barRef.current;
    const tip = tipRef.current;
    const chart = row?.closest("[data-chart]");
    if (!row || !bar || !tip || !chart) return;

    const GAP = 8;
    const r = row.getBoundingClientRect();
    const b = bar.getBoundingClientRect();
    const c = chart.getBoundingClientRect();
    const w = tip.offsetWidth;

    let x = b.right + GAP; // viewport x of tooltip's left edge
    if (x + w > c.right) x = b.left - GAP - w;
    x = Math.min(Math.max(x, c.left), Math.max(c.right - w, c.left));
    setTipLeft(x - r.left);
  }, [isOpen]);

  return (
    <li
      data-bar
      className="relative flex min-w-0 flex-1 flex-col items-center gap-100"
      // Mouse only: on touch, hover events fire as a side effect of a tap
      // and would fight with the click toggle.
      onPointerEnter={(e) => e.pointerType === "mouse" && onOpen()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onClose()}
    >
      <div
        ref={rowRef}
        className="relative flex h-60 w-full items-end justify-center"
      >
        <button
          ref={barRef}
          type="button"
          onClick={onToggle}
          onFocus={onOpen}
          onBlur={onClose}
          aria-label={`${entry.moodLabel}, ${entry.sleepLabel}, ${month} ${day}`}
          aria-expanded={isOpen}
          className={`${ui.bar} relative w-full max-w-10 cursor-pointer rounded-full`}
          style={{ height: barHeight(entry.sleepHours) }}
        >
          <img
            src={ui.white}
            alt=""
            className="absolute top-1 left-1/2 w-[calc(100%-8px)] -translate-x-1/2"
          />
        </button>
        {isOpen && (
          <div
            ref={tipRef}
            role="tooltip"
            style={{
              left: tipLeft ?? 0,
              visibility: tipLeft === null ? "hidden" : "visible",
            }}
            className="bg-neutral-0 rounded-10 absolute top-0 z-20 w-52 border border-blue-100 p-150 text-left shadow-lg"
          >
            <p className="text-preset-7 text-neutral-600">Mood</p>
            <p className="text-preset-6 mb-100 flex items-center gap-100">
              <img src={ui.icon} alt="" className="w-4" />
              {entry.moodLabel}
            </p>
            <p className="text-preset-7 text-neutral-600">Sleep</p>
            <p className="text-preset-6 mb-100">{entry.sleepLabel}</p>
            {entry.journal && (
              <>
                <p className="text-preset-7 text-neutral-600">Reflection</p>
                <p className="text-preset-7 mb-100 wrap-break-word">
                  {entry.journal}
                </p>
              </>
            )}
            <p className="text-preset-7 text-neutral-600">Tags</p>
            <p className="text-preset-7">{entry.feelings.join(", ")}</p>
          </div>
        )}
      </div>
      <p className="text-preset-9 text-neutral-600">{month}</p>
      <p className="text-preset-9 font-semibold">{day}</p>
    </li>
  );
}

export default function MoodChart() {
  const { data, isLoading } = useRecent();
  const [openId, setOpenId] = useState<string | null>(null);

  // Tap anywhere outside the chart bars to dismiss on touch devices
  useEffect(() => {
    if (!openId) return;
    const close = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest("[data-bar]")) setOpenId(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [openId]);

  return (
    <div data-chart className="flex flex-col gap-300">
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
              <Bar
                key={e._id}
                entry={e}
                isOpen={openId === e._id}
                onOpen={() => setOpenId(e._id)}
                onClose={() => setOpenId(null)}
                onToggle={() =>
                  setOpenId((id) => (id === e._id ? null : e._id))
                }
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

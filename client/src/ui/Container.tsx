import qoute from "../assets/icons/icon-quote.svg";
import Sleep from "../assets/icons/icon-sleep.svg";
import Reflection from "../assets/icons/icon-reflection.svg";
import VeryHappyEmoji from "../assets/icons/icon-very-happy-color.svg";
import HappyEmoji from "../assets/icons/icon-happy-color.svg";
import NeutralEmoji from "../assets/icons/icon-neutral-color.svg";
import SadEmoji from "../assets/icons/icon-sad-color.svg";
import VerySadEmoji from "../assets/icons/icon-very-sad-color.svg";
import type { MoodEntry } from "../types/mood";

const EMOJI: Record<string, string> = {
  "-2": VerySadEmoji,
  "-1": SadEmoji,
  "0": NeutralEmoji,
  "1": HappyEmoji,
  "2": VeryHappyEmoji,
};

interface ContainerProps {
  entry: MoodEntry;
  quote: string | null;
}

function Container({ entry, quote }: ContainerProps) {
  return (
    <section className="grid gap-400 lg:grid-cols-5">
      <div className="bg-neutral-0 rounded-16 relative col-span-3 grid min-w-0 flex-1 grid-cols-1 gap-400 overflow-hidden border border-blue-100 p-400 text-center md:min-h-85 md:grid-cols-[1fr_1fr] md:text-left">
        {/* Heading */}
        <div className="relative z-10 md:col-start-1 md:row-start-1">
          <p className="text-preset-3 text-neutral-300">I’m feeling</p>
          <p className="text-preset-2">{entry.moodLabel}</p>
        </div>

        <div className="flex md:absolute md:top-3/5 md:right-0 md:w-1/2 md:-translate-y-1/2">
          <img
            src={EMOJI[String(entry.mood)]}
            alt=""
            className="pointer-events-none w-[319.99px] object-contain"
          />
        </div>

        {quote && (
          <div className="relative z-10 flex flex-col items-center gap-150 md:col-start-1 md:row-start-2 md:mt-auto md:items-start md:pb-2">
            <img src={qoute} alt="" className="w-fit" />
            <p className="text-preset-6 italic">“{quote}”</p>
          </div>
        )}
      </div>

      <div className="col-span-3 flex w-full flex-col gap-250 lg:col-span-2">
        <div className="bg-neutral-0 rounded-16 flex w-full flex-col gap-200 border border-blue-100 p-250">
          <div className="text-preset-6 flex items-center gap-150 text-neutral-600">
            <img src={Sleep} alt="" />
            <p className="">Sleep</p>
          </div>
          <p className="text-preset-3">{entry.sleepLabel}</p>
        </div>

        <div className="bg-neutral-0 rounded-16 flex w-full flex-col gap-200 border border-blue-100 p-250">
          <div className="text-preset-6 flex items-center gap-150 text-neutral-600">
            <img src={Reflection} alt="" />
            <p className="">Reflection of the day</p>
          </div>

          <div className="min-h-[80px] w-full">
            <p className="text-preset-6">{entry.journal}</p>
          </div>

          <div className="flex items-center gap-150">
            {entry.feelings.map((f) => (
              <p key={f} className="text-preset-6-italic">
                #{f}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Container;

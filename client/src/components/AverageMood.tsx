import BgPattern from "../assets/icons/bg-pattern-averages.svg";
import TrendIncrease from "../assets/icons/icon-trend-increase.svg";
import TrendDecrease from "../assets/icons/icon-trend-decrease.svg";
import TrendSame from "../assets/icons/icon-trend-same.svg";
import MoodChart from "./MoodChart";
import { useAverages } from "../hooks/useMood";
import {
  hasEnough,
  moodLabel,
  sleepLabel,
  trend,
  type Trend,
} from "../features/home/moodStats";

const TREND_UI: Record<Trend, { icon: string; text: string }> = {
  increase: {
    icon: TrendIncrease,
    text: "Increase from the previous 5 check-ins",
  },
  decrease: {
    icon: TrendDecrease,
    text: "Decrease from the previous 5 check-ins",
  },
  same: { icon: TrendSame, text: "Same as the previous 5 check-ins" },
};

function TrendLine({ value }: { value: Trend | null }) {
  if (!value) return null;
  const { icon, text } = TREND_UI[value];
  return (
    <p className="text-preset-7 flex items-center gap-100">
      <img src={icon} alt="" /> {text}
    </p>
  );
}

function AverageMood() {
  const { data } = useAverages();
  const enoughMood = hasEnough(data?.current) && data?.current.mood != null;
  // Trend only makes sense once the previous window is also full
  const canCompare = hasEnough(data?.previous);
  const moodTrend = canCompare
    ? trend(data?.current.mood ?? null, data?.previous.mood ?? null)
    : null;
  const sleepTrend = canCompare
    ? trend(data?.current.sleep ?? null, data?.previous.sleep ?? null)
    : null;

  return (
    <div className="grid gap-400 lg:grid-cols-3">
      <div className="bg-neutral-0 rounded-16 col-span-2 flex flex-col gap-300 border border-blue-100 p-250 lg:col-span-1">
        <div className="flex flex-col gap-200">
          <h2 className="text-preset-5">
            Average Mood{" "}
            <span className="text-preset-7 text-neutral-600">
              (Last 5 Check-ins)
            </span>
          </h2>
          <div className="rounded-16 relative flex flex-col gap-150 overflow-hidden bg-blue-100 px-200 py-250">
            <div className="relative z-10 flex flex-col gap-150">
              {enoughMood ? (
                <>
                  <p className="text-preset-4">
                    {moodLabel(data!.current.mood!)}
                  </p>
                  <TrendLine value={moodTrend} />
                </>
              ) : (
                <>
                  <p className="text-preset-4">Keep tracking!</p>
                  <p className="text-preset-7">
                    Log 5 check-ins to see your average mood.
                  </p>
                </>
              )}
            </div>
            <img
              src={BgPattern}
              alt=""
              className="pointer-events-none absolute top-1/2 -right-45 -translate-y-1/2"
            />
          </div>
        </div>

        <div className="flex flex-col gap-200">
          <h2 className="text-preset-5">
            Average Sleep{" "}
            <span className="text-preset-7 text-neutral-600">
              (Last 5 Check-ins)
            </span>
          </h2>
          <div className="rounded-16 relative flex flex-col gap-150 overflow-hidden bg-blue-100 px-200 py-250">
            <div className="relative z-10 flex flex-col gap-150">
              {enoughMood && data?.current.sleep != null ? (
                <>
                  <p className="text-preset-4">
                    {sleepLabel(data.current.sleep)}
                  </p>
                  <TrendLine value={sleepTrend} />
                </>
              ) : (
                <>
                  <p className="text-preset-4">Not enough data yet!</p>
                  <p className="text-preset-7">
                    Track 5 nights to view average sleep.
                  </p>
                </>
              )}
            </div>
            <img
              src={BgPattern}
              alt=""
              className="pointer-events-none absolute top-1/2 -right-45 -translate-y-1/2"
            />
          </div>
        </div>
      </div>

      <div className="bg-neutral-0 rounded-16 col-span-2 flex flex-col gap-300 border border-blue-100 p-250">
        <MoodChart />
      </div>
    </div>
  );
}

export default AverageMood;

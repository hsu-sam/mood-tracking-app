import BgPattern from "../assets/icons/bg-pattern-averages.svg";

function AverageMood() {
  return (
    <div className="grid grid-cols-3 gap-400">
      <div className="bg-neutral-0 rounded-16 flex flex-col gap-300 border border-blue-100 p-250">
        <div className="flex flex-col gap-200">
          <p className="text-preset-5">
            Average Mood{" "}
            <span className="text-preset-7 text-neutral-600">
              (Last 5 Check-ins)
            </span>
          </p>
          <div className="rounded-16 relative flex flex-col gap-150 overflow-hidden bg-blue-100 px-200 py-250">
            <div className="relative z-10 flex flex-col gap-150">
              <p className="text-preset-4">Keep tracking!</p>
              <p className="text-preset-7">
                Log 5 check-ins to see your average mood.
              </p>
            </div>
            <img
              src={BgPattern}
              alt=""
              className="pointer-events-none absolute top-1/2 -right-45 -translate-y-1/2"
            />
          </div>
        </div>

        <div className="flex flex-col gap-200">
          <p className="text-preset-5">
            Average Sleep{" "}
            <span className="text-preset-7 text-neutral-600">
              (Last 5 Check-ins)
            </span>
          </p>
          <div className="rounded-16 relative flex flex-col gap-150 overflow-hidden bg-blue-100 px-200 py-250">
            <div className="relative z-10 flex flex-col gap-150">
              <p className="text-preset-4">Not enough data yet!</p>
              <p className="text-preset-7">
                Track 5 nights to view average sleep.
              </p>
            </div>
            <img
              src={BgPattern}
              alt=""
              className="pointer-events-none absolute top-1/2 -right-45 -translate-y-1/2"
            />
          </div>
        </div>
      </div>

      <div className="bg-neutral-0 rounded-16 col-span-2 flex flex-col gap-300 border border-blue-100 p-250"></div>
    </div>
  );
}

export default AverageMood;

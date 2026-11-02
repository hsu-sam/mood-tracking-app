import qoute from "../assets/icons/icon-quote.svg";
import Sleep from "../assets/icons/icon-sleep.svg";
import Reflection from "../assets/icons/icon-reflection.svg";
import VeryHappyEmoji from "../assets/icons/icon-very-happy-color.svg";

function Container() {
  return (
    <section className="grid grid-cols-5 gap-400">
      <div className="bg-neutral-0 rounded-16 relative col-span-3 grid min-w-0 flex-1 grid-cols-1 overflow-hidden border border-blue-100 p-400 text-center md:min-h-85 md:grid-cols-[1fr_1fr] md:text-left">
        {/* Heading */}
        <div className="relative z-10 md:col-start-1 md:row-start-1">
          <p className="text-preset-3 text-neutral-300">I’m feeling</p>
          <p className="text-preset-2">Very Happy</p>
        </div>

        {/* Emoji top-1/2 -right-45 -translate-y-1/2 */}
        <div className="flex md:absolute md:top-3/5 md:right-0 md:w-1/2 md:-translate-y-1/2">
          <img
            src={VeryHappyEmoji}
            alt=""
            className="pointer-events-none w-[319.99px] object-contain"
          />
        </div>

        {/* Quote */}
        <div className="relative z-10 flex flex-col items-center gap-150 md:col-start-1 md:row-start-2 md:mt-auto md:items-start md:pb-2">
          <img src={qoute} alt="" className="w-fit" />
          <p className="text-preset-6 italic">
            “When your heart is full, share your light with the world.”
          </p>
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-250">
        <div className="bg-neutral-0 rounded-16 flex flex-col gap-200 border border-blue-100 p-250">
          <div className="text-preset-6 flex items-center gap-150 text-neutral-600">
            <img src={Sleep} alt="" />
            <p className="">Sleep</p>
          </div>
          <p className="text-preset-3">9+ hours</p>
        </div>

        <div className="bg-neutral-0 rounded-16 flex flex-col gap-200 border border-blue-100 p-250">
          <div className="text-preset-6 flex items-center gap-150 text-neutral-600">
            <img src={Reflection} alt="" />
            <p className="">Reflection of the day</p>
          </div>

          <div className="min-h-[80px] w-full">
            <p className="text-preset-6">
              Woke up early and finally tackled a big project!
            </p>
          </div>

          <div className="flex items-center gap-150">
            <p className="text-preset-6-italic">#Grateful</p>
            <p className="text-preset-6-italic">#Optimistic</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Container;

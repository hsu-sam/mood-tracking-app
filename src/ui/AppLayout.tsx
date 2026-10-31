import { Button } from "./Button";
import Header from "./Header";

export default function AppLayout() {
  return (
    <div className="m-auto max-w-292.5">
      <div className="flex flex-col gap-800 pt-500">
        <Header />

        <div className="flex flex-col items-center gap-125">
          <p className="text-preset-3 text-blue-600">Hello, Lisa!</p>

          <h1 className="">How are you feeling today?</h1>

          <p className="text-preset-6 text-neutral-600">
            Wednesday, April 16th, 2025
          </p>
        </div>

        <Button className="w-fit self-center">Log today's mood</Button>
      </div>

      <div></div>
    </div>
  );
}

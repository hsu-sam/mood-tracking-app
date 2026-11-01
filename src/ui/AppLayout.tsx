import AverageMood from "../components/AverageMood";
import Header from "./Header";
import Main from "./Main";

export default function AppLayout() {
  return (
    <div className="m-auto flex max-w-292.5 flex-col gap-1000">
      <div className="flex flex-col gap-800 pt-500">
        <Header />

        <Main />
      </div>

      <div>
        <AverageMood />
      </div>
    </div>
  );
}

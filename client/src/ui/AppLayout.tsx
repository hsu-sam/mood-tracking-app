import Dashboard from "../features/home/Dashboard";
import Header from "./Header";
import Main from "./Main";

export default function AppLayout() {
  return (
    <div className="m-auto flex max-w-292.5 flex-col gap-600 px-200 pb-800 md:gap-1000 md:px-400 md:pb-1000">
      <div className="flex flex-col gap-800 pt-500">
        <Header />

        <Main />
      </div>
      <Dashboard />
    </div>
  );
}

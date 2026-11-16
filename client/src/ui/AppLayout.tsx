import Dashboard from "../pages/Dashboard";
import Header from "./Header";
import Main from "./Main";

export default function AppLayout() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="m-auto flex max-w-292.5 flex-col gap-600 px-200 pb-800 md:gap-1000 md:px-400 md:pb-1000">
        <div className="pt-500">
          <Header />
        </div>

        {/* One <main> landmark wraps the greeting AND the dashboard */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex flex-col gap-800 outline-none md:gap-1000"
        >
          <Main />
          <Dashboard />
        </main>
      </div>
    </>
  );
}

import { Link } from "react-router";

function PageNotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen flex-col items-center justify-center gap-300 px-200 text-center outline-none"
    >
      <h1 className="text-preset-2">Page not found</h1>
      <p className="text-preset-6-regular text-neutral-600">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link
        to="/home"
        className="text-preset-6 text-blue-600 underline underline-offset-4"
      >
        Go to your dashboard
      </Link>
    </main>
  );
}

export default PageNotFound;

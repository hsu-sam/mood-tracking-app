export default function Spinner() {
  return (
    <div
      className="mx-auto my-[4.8rem] aspect-square w-[6.4rem] animate-spin rounded-full bg-[radial-gradient(farthest-side,var(--color-brand-600)_94%,transparent)] bg-size-[10px_10px] bg-top bg-no-repeat [-webkit-mask:radial-gradient(farthest-side,transparent_calc(100%-10px),black_0)] [animation-duration:1.5s] [mask:radial-gradient(farthest-side,transparent_calc(100%-10px),black_0)]"
      role="status"
      aria-label="Loading"
    />
  );
}

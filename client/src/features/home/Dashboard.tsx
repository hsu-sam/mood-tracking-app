import AverageMood from "../../components/AverageMood";
import { useHomeState } from "../../hooks/useMood";
import Container from "../../ui/Container";

export default function DashboardMain() {
  const { state, isLoading, today } = useHomeState();

  if (isLoading)
    return (
      <p role="status" className="text-preset-6 text-center text-neutral-600">
        Loading your dashboard…
      </p>
    );

  return (
    <div className="flex flex-col gap-400">
      {state === "logged" && today?.entry && (
        <Container entry={today.entry} quote={today.quote} />
      )}
      <AverageMood />
    </div>
  );
}

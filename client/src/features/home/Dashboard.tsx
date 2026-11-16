import AverageMood from "../../components/AverageMood";
import { useHomeState } from "../../hooks/useMood";
import Container from "../../ui/Container";

export default function Dashboard() {
  const { state, isLoading, today } = useHomeState();

  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-400">
      {state === "logged" && today?.entry && (
        <Container entry={today.entry} quote={today.quote} />
      )}
      <AverageMood />
    </div>
  );
}

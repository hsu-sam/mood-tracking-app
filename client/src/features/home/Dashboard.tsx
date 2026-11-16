import AverageMood from "../../components/AverageMood";
import Container from "../../ui/Container";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-400">
      <Container />
      <AverageMood />
    </div>
  );
}

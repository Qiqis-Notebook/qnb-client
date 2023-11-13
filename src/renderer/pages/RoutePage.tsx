import { useParams } from "react-router-dom";

export default function RoutePage() {
  let { rid } = useParams();

  return <div>Route: {rid}</div>;
}

import { Link } from "react-router-dom";

type DetailButtonSectionProps = {
  to: string;
  onClick: () => void;
};

export default function DetailButtonSection({
  to,
  onClick,
}: DetailButtonSectionProps) {
  return (
    <section className="detail-action-section">
      <Link className="detail-action detail-action-update" to={to}>
        Uppdatera
      </Link>
      <button className="detail-action detail-action-delete" onClick={onClick}>
        Ta bort
      </button>
    </section>
  );
}

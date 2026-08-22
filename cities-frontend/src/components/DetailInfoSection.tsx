import { Link } from "react-router-dom";
import type { Region } from "../../../shared/types";

type DetailInfoSectionProps = {
  title: "Stad" | "Kommun" | "Region";
  name?: string;
  population?: string | number;
  label: "Kommuner" | "Kommun" | "Städer";
  children: React.ReactNode;
  region?: Region;
};

export default function DetailInfoSection({
  title,
  name,
  children,
  population,
  label,
  region,
}: DetailInfoSectionProps) {
  const regionId = region?.regions_id;

  return (
    <section>
      <h2 className="detail-title">{title}</h2>
      <h3 className="detail-title">{name}</h3>
      <p className="detail-title">{`Invånare: ${population}`}</p>
      <h4 className="detail-title">{label}:</h4>
      <ul className="detail-ul">{children}</ul>
      {region && (
        <>
          <h4 className="detail-title">Region:</h4>
          <ul className="detail-ul">
            <Link to={`/detail/region/${regionId ?? ""}`}>
              <li>{region && region.regions_name}</li>
            </Link>
          </ul>
        </>
      )}
    </section>
  );
}

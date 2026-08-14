import { Link, useParams } from "react-router-dom";
import type { City, Region } from "../../../shared/types";

type ItemsListProps = {
  cities?: City[];
  regions?: Region[];
};

function ListComponent({ cities, regions }: ItemsListProps) {
  const { options } = useParams();

  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>{options === "cities" ? "Städer" : "Regioner"} lista</h2>
      {cities && (
        <ul>
          {cities.map((city) => (
            <li key={city.cities_id}>
              <Link to={`/city/${city.cities_id}`}>{city.cities_name}</Link>
            </li>
          ))}
        </ul>
      )}
      {regions && (
        <ul>
          {regions.map((region) => (
            <li key={region.regions_id}>
              <Link to={`/city/${region.regions_id}`}>
                {region.regions_name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default ListComponent;

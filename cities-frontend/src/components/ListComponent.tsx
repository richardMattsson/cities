import { Link, useParams } from "react-router-dom";
import type { City, Municipality, Region } from "../../../shared/types";

type ItemsListProps = {
  cities?: City[];
  municipalities?: Municipality[];
  regions?: Region[];
};

function ListComponent({ cities, municipalities, regions }: ItemsListProps) {
  const { options } = useParams();

  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {options === "cities" && <h2>Städer lista</h2>}
      {options === "municipalities" && <h2>Kommuner lista</h2>}
      {options === "regions" && <h2>Regioner lista</h2>}
      {options === "cities" && (
        <ul>
          {cities &&
            cities.map((city) => (
              <li key={city.cities_id}>
                <Link to={`/city/${city.cities_id}`}>{city.cities_name}</Link>
              </li>
            ))}
        </ul>
      )}
      {options === "municipalities" && (
        <ul>
          {municipalities &&
            municipalities.map((municipality) => (
              <li key={municipality.municipalities_id}>
                <Link to={`/municipality/${municipality.municipalities_id}`}>
                  {municipality.municipalities_name}
                </Link>
              </li>
            ))}
        </ul>
      )}
      {options === "regions" && (
        <ul>
          {regions &&
            regions.map((region) => (
              <li key={region.regions_id}>
                <Link to={`/region/${region.regions_id}`}>
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

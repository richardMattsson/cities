import { Link, useParams } from "react-router-dom";
import type { City, Municipality, Region } from "../../../shared/types";
import "../css/ListComponent.css";

type ItemsListProps = {
  cities?: City[];
  municipalities?: Municipality[];
  regions?: Region[];
};

function ListComponent({ cities, municipalities, regions }: ItemsListProps) {
  const { type } = useParams();

  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {type === "cities" && <h2>Städer</h2>}
      {type === "municipalities" && <h2>Kommuner</h2>}
      {type === "regions" && <h2>Regioner</h2>}
      {type === "cities" && (
        <ul className="list-ul">
          {cities &&
            cities.map((city) => (
              <Link key={city.cities_id} to={`/detail/city/${city.cities_id}`}>
                <li>{city.cities_name}</li>
              </Link>
            ))}
        </ul>
      )}
      {type === "municipalities" && (
        <ul className="list-ul">
          {municipalities &&
            municipalities.map((municipality) => (
              <Link
                key={municipality.municipalities_id}
                to={`/detail/municipality/${municipality.municipalities_id}`}
              >
                <li>{municipality.municipalities_name}</li>
              </Link>
            ))}
        </ul>
      )}
      {type === "regions" && (
        <ul className="list-ul">
          {regions &&
            regions.map((region) => (
              <Link
                key={region.regions_id}
                to={`/detail/region/${region.regions_id}`}
              >
                <li> {region.regions_name}</li>
              </Link>
            ))}
        </ul>
      )}
    </article>
  );
}

export default ListComponent;

import { Link, useParams } from "react-router-dom";
import type { City, Municipality, Region } from "../../../shared/types";
import "../css/ListComponent.css";

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
      {options === "cities" && <h2>Städer</h2>}
      {options === "municipalities" && <h2>Kommuner</h2>}
      {options === "regions" && <h2>Regioner</h2>}
      {options === "cities" && (
        <ul className="list-ul">
          {cities &&
            cities.map((city) => (
              <Link key={city.cities_id} to={`/city/${city.cities_id}`}>
                <li>{city.cities_name}</li>
              </Link>
            ))}
        </ul>
      )}
      {options === "municipalities" && (
        <ul className="list-ul">
          {municipalities &&
            municipalities.map((municipality) => (
              <Link
                key={municipality.municipalities_id}
                to={`/municipality/${municipality.municipalities_id}`}
              >
                <li>{municipality.municipalities_name}</li>
              </Link>
            ))}
        </ul>
      )}
      {options === "regions" && (
        <ul className="list-ul">
          {regions &&
            regions.map((region) => (
              <Link key={region.regions_id} to={`/region/${region.regions_id}`}>
                <li> {region.regions_name}</li>
              </Link>
            ))}
        </ul>
      )}
    </article>
  );
}

export default ListComponent;

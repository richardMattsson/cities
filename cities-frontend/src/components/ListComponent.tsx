import { Link } from "react-router-dom";
import type { City, Municipality, Region } from "../../../shared/types";
import "../css/ListView.css";
import { truncateText } from "../utils/helper";

type ItemsListProps = {
  cities?: City[];
  municipalities?: Municipality[];
  regions?: Region[];
};

function ListComponent({ cities, municipalities, regions }: ItemsListProps) {
  return (
    <>
      {cities && (
        <ul className="list-ul">
          {cities.map((city) => (
            <Link key={city.cities_id} to={`/detail/city/${city.cities_id}`}>
              <li data-cy="list-item">{truncateText(city.cities_name, 20)} </li>
            </Link>
          ))}
        </ul>
      )}
      {municipalities && (
        <ul className="list-ul">
          {municipalities.map((municipality) => (
            <Link
              key={municipality.municipalities_id}
              to={`/detail/municipality/${municipality.municipalities_id}`}
            >
              <li data-cy="list-item">
                {truncateText(municipality.municipalities_name, 20)}{" "}
              </li>
            </Link>
          ))}
        </ul>
      )}
      {regions && (
        <ul className="list-ul">
          {regions.map((region) => (
            <Link
              key={region.regions_id}
              to={`/detail/region/${region.regions_id}`}
            >
              <li data-cy="list-item">
                {truncateText(region.regions_name, 20)}{" "}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </>
  );
}

export default ListComponent;

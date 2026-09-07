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
    <ul className="list-ul">
      {cities &&
        cities.map((city) => (
          <CustomLink
            id={city.cities_id}
            to={`/detail/city/${city.cities_id}`}
            itemName={city.cities_name}
          />
        ))}

      {municipalities &&
        municipalities.map((municipality) => (
          <CustomLink
            id={municipality.municipalities_id}
            to={`/detail/municipality/${municipality.municipalities_id}`}
            itemName={municipality.municipalities_name}
          />
        ))}

      {regions &&
        regions.map((region) => (
          <CustomLink
            id={region.regions_id}
            to={`/detail/region/${region.regions_id}`}
            itemName={region.regions_name}
          />
        ))}
    </ul>
  );
}

type CustomLinkProps = {
  id: number;
  to: string;
  itemName: string;
};

function CustomLink({ id, to, itemName }: CustomLinkProps) {
  return (
    <Link key={id} to={to}>
      <li data-cy="list-item">{truncateText(itemName, 20)} </li>
    </Link>
  );
}

export default ListComponent;

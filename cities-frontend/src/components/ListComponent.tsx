import { Link, useParams } from "react-router-dom";
import type { City, Municipality, Region } from "../../../shared/types";
import "../css/ListComponent.css";
import { truncateText } from "../utils/helper";

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
              <CustomLinkComponent
                key={city.cities_id}
                to={`/detail/city/${city.cities_id}`}
              >
                {truncateText(city.cities_name, 20)}
              </CustomLinkComponent>
            ))}
        </ul>
      )}
      {type === "municipalities" && (
        <ul className="list-ul">
          {municipalities &&
            municipalities.map((municipality) => (
              <CustomLinkComponent
                key={municipality.municipalities_id}
                to={`/detail/municipality/${municipality.municipalities_id}`}
              >
                {truncateText(municipality.municipalities_name, 20)}
              </CustomLinkComponent>
            ))}
        </ul>
      )}
      {type === "regions" && (
        <ul className="list-ul">
          {regions &&
            regions.map((region) => (
              <CustomLinkComponent
                key={region.regions_id}
                to={`/detail/region/${region.regions_id}`}
              >
                {truncateText(region.regions_name, 20)}
              </CustomLinkComponent>
            ))}
        </ul>
      )}
    </article>
  );
}

type CustomLinkComponentProps = {
  key: number;
  to: string;
  children: React.ReactNode;
};

function CustomLinkComponent({ key, to, children }: CustomLinkComponentProps) {
  return (
    <Link key={key} to={to}>
      <li data-cy="list-item">{children} </li>
    </Link>
  );
}

export default ListComponent;

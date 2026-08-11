import { startTransition, useEffect, useState } from "react";
import { getCitiesAPI } from "../api/cities";
import type { City } from "../../../shared/types";
import { Link } from "react-router-dom";

function CitiesView() {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getCitiesAPI();
        if (!response.ok) {
          console.log("error fetching resources");
          return;
        }
        const result = await response.json();

        if (!mounted) return;
        startTransition(() => setCities(result));
      } catch {
        if (mounted) return;
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <>
      <ItemsList items={cities} />
    </>
  );
}

type ItemsListProps = {
  items: City[];
};
function ItemsList({ items }: ItemsListProps) {
  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>Städer lista</h2>
      <ul>
        {items.map((city) => (
          <li key={city.cities_id}>
            <Link to={`/city/${city.cities_id}`}>{city.cities_name}</Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default CitiesView;

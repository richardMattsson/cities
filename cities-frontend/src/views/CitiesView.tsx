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
        console.log(result);

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
      {" "}
      <ItemsList items={cities} />
    </>
  );
}

type ItemsListProps = {
  items: City[];
};
function ItemsList({ items }: ItemsListProps) {
  const sortedItems = [...items].toSorted((a, b) => {
    const nameA = a.cities_name.toUpperCase();
    const nameB = b.cities_name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  return (
    <article>
      <h2>Städer lista</h2>
      <ul>
        {sortedItems.map((city) => (
          <li key={city.cities_id}>
            <Link to={`/city/${city.cities_id}`}>{city.cities_name}</Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default CitiesView;

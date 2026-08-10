import { startTransition, useEffect, useState } from "react";
import type { Region } from "../../../shared/types";
import { Link } from "react-router-dom";
import { getRegionsAPI } from "../api/regions";

function RegionsView() {
  const [regions, setRegions] = useState<Region[]>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getRegionsAPI();
        if (!response.ok) {
          console.log("error fetching resources");
          return;
        }
        const result = await response.json();

        if (!mounted) return;
        startTransition(() => setRegions(result));
      } catch {
        if (mounted) return;
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return <ItemsList items={regions} />;
}

type ItemsListProps = {
  items: Region[];
};
function ItemsList({ items }: ItemsListProps) {
  const sortedItems = [...items].toSorted((a, b) => {
    const nameA = a.regions_name.toUpperCase();
    const nameB = b.regions_name.toUpperCase();
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
      <h2>Regioner lista</h2>
      <ul>
        {sortedItems.map((region) => (
          <li key={region.regions_id}>
            <Link to={`/region/${region.regions_id}`}>
              {region.regions_name}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default RegionsView;

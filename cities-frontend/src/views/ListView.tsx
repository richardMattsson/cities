import { useParams } from "react-router-dom";
import type { City, Region } from "../../../shared/types";
import ListComponent from "../components/ListComponent";
import { startTransition, useEffect, useState } from "react";
import { getCitiesAPI } from "../api/citiesAPI";
import { getRegionsAPI } from "../api/regionsAPI";

export default function ListView() {
  const { options } = useParams();

  return options === "cities" ? <CitiesView /> : <RegionsView />;
}

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
  return <ListComponent cities={cities} />;
}

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
  return <ListComponent regions={regions} />;
}

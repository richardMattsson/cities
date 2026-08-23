import { useParams } from "react-router-dom";
import type { City, Municipality, Region } from "../../../shared/types";
import ListComponent from "../components/ListComponent";
import { startTransition, useEffect, useState } from "react";
import { getCitiesAPI } from "../api/citiesAPI";
import { getRegionsAPI } from "../api/regionsAPI";
import { getMunicipalitiesAPI } from "../api/municipalitiesAPI";
import "../css/ListView.css";

export default function ListView() {
  const { type } = useParams();

  switch (type) {
    case "cities":
      return <CitiesView />;
    case "municipalities":
      return <MunicipalitiesView />;
    case "regions":
      return <RegionsView />;
    default:
  }
}

function CitiesView() {
  const [cities, setCities] = useState<City[]>([]);
  const [input, setInput] = useState("");

  const filteredCities = cities.filter((city) =>
    city.cities_name.toLowerCase().includes(input.toLowerCase()),
  );

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
    <article className="list-container">
      <h2>{`${cities.length} Städer`}</h2>
      <input
        autoFocus
        type="text"
        placeholder="Sök..."
        data-cy="list-search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <ListComponent cities={filteredCities ? filteredCities : cities} />
    </article>
  );
}

function MunicipalitiesView() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [input, setInput] = useState("");

  const filteredMunicipalities = municipalities.filter((municipality) =>
    municipality.municipalities_name
      .toLowerCase()
      .includes(input.toLowerCase()),
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getMunicipalitiesAPI();
        if (!response.ok) {
          console.log("error fetching resources");
          return;
        }
        const result = await response.json();

        if (!mounted) return;
        startTransition(() => setMunicipalities(result));
      } catch {
        if (mounted) return;
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <article className="list-container">
      <h2>{`${municipalities.length} Kommuner`}</h2>
      <input
        autoFocus
        type="text"
        placeholder="Sök..."
        data-cy="list-search"
        onChange={(e) => setInput(e.target.value)}
      />
      <ListComponent
        municipalities={
          filteredMunicipalities ? filteredMunicipalities : municipalities
        }
      />
    </article>
  );
}

function RegionsView() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [input, setInput] = useState("");

  const filteredRegions = regions.filter((region) =>
    region.regions_name.toLowerCase().includes(input.toLowerCase()),
  );

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

  return (
    <article className="list-container">
      <h2>{`${regions.length} Regioner`}</h2>
      <input
        autoFocus
        type="text"
        placeholder="Sök..."
        data-cy="list-search"
        onChange={(e) => setInput(e.target.value)}
      />
      <ListComponent regions={filteredRegions ? filteredRegions : regions} />
    </article>
  );
}

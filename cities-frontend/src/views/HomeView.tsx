import { startTransition, useEffect, useState } from "react";
import { sumOfCities } from "../api/citiesAPI";
import { sumOfRegions } from "../api/regionsAPI";
import { Link } from "react-router-dom";
import { sumOfMunicipalities } from "../api/municipalitiesAPI";
import "../css/HomeView.css";

function HomeView() {
  const [sumCities, setSumCities] = useState();
  const [sumMunicipalities, setSumMunicipalities] = useState();
  const [sumRegions, setSumRegions] = useState();
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await sumOfCities();

        if (!response.ok) {
          console.log("error fetching resources");
          return;
        }

        const result = await response.json();
        if (!mounted) return;
        startTransition(() => setSumCities(result));
      } catch {
        if (mounted) return;
      }
    })();
    (async () => {
      try {
        const response = await sumOfMunicipalities();

        if (!response.ok) {
          console.log("error fetching resources");
          return;
        }

        const result = await response.json();
        if (!mounted) return;
        startTransition(() => setSumMunicipalities(result));
      } catch {
        if (mounted) return;
      }
    })();
    (async () => {
      try {
        const response = await sumOfRegions();

        if (!response.ok) {
          console.log("error fetching resources");
          return;
        }

        const result = await response.json();

        if (!mounted) return;
        startTransition(() => setSumRegions(result));
      } catch {
        if (mounted) return;
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <article className="home-container">
      <h2 className="home-title">Home</h2>
      <ul className="home-ul">
        <Link to={"/cities"}>
          <li>Antal Städer: {sumCities}</li>
        </Link>
        <Link to={"/municipalities"}>
          <li>Antal Kommuner: {sumMunicipalities}</li>
        </Link>
        <Link to={"/regions"}>
          <li>Antal Regioner: {sumRegions}</li>
        </Link>
      </ul>
    </article>
  );
}
export default HomeView;

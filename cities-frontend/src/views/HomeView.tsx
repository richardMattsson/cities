import { startTransition, useEffect, useState } from "react";
import { sumOfCities } from "../api/cities";
import { sumOfRegions } from "../api/regions";
import { Link } from "react-router-dom";

function HomeView() {
  const [sumCities, setSumCities] = useState();
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
    <>
      <h1>Home</h1>
      <p>
        Antal <Link to={"/cities"}>Städer:</Link> {sumCities}
      </p>
      <p>
        Antal <Link to={"/regions"}>Regioner:</Link> {sumRegions}
      </p>
    </>
  );
}
export default HomeView;

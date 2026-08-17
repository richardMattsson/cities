import { startTransition, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { City, Region } from "../../../shared/types";
import {
  deleteRegionAPI,
  getCitiesFromRegion,
  getOneRegionAPI,
} from "../api/regionsAPI";
import { getAuth } from "firebase/auth";

function RegionDetailView() {
  const { id } = useParams();
  const [region, setRegion] = useState<Region>();
  const [cities, setCities] = useState<City[]>();
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getOneRegionAPI(Number(id));
        if (!response.ok) {
          console.log("error fetching resource");
          return;
        }
        const result = await response.json();

        if (!mounted) return;

        startTransition(() => setRegion(result[0]));
      } catch {
        if (mounted) return;
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getCitiesFromRegion(Number(id));
        if (!response.ok) {
          console.log("error fetching resource");
          return;
        }
        const result = await response.json();

        if (!mounted) return;
        console.log(result);

        startTransition(() => setCities(result));
      } catch {
        if (mounted) return;
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function deleteRegion() {
    const proceed = confirm("Vill du verkligen ta bort regionen?");

    if (!proceed) {
      return;
    }
    try {
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att ta bort en stad.");
        return;
      }
      const response = await deleteRegionAPI(Number(id), token);
      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result?.error || "Något gick fel.");
        return;
      }

      setSuccesMsg("Du har tagit bort en region.");
    } catch (error) {
      setErrorMsg("Något gick fel.");
      console.error(error);
    }
  }

  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>{region && "Namn: " + region.regions_name}</h1>
      <p>{region && "Befolkning antal: " + region.regions_population}</p>
      <ul>
        {cities &&
          cities.map((city) => (
            <li key={city.cities_id}>
              <Link to={`/city/${city.cities_id}`}>{city.cities_name}</Link>
            </li>
          ))}
      </ul>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "fit-content",
        }}
      >
        <button>
          <Link to={`/region-form/update/${id}`}>Uppdatera region</Link>
        </button>
        <button onClick={deleteRegion}>Ta bort region</button>
      </section>
      {errorMsg && <p>{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
    </article>
  );
}
export default RegionDetailView;

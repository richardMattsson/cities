import { startTransition, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Municipality, Region } from "../../../shared/types";
import {
  deleteRegionAPI,
  getMunicipalitiesFromRegion,
  getOneRegionAPI,
} from "../api/regionsAPI";
import { getAuth } from "firebase/auth";

function RegionDetailView() {
  const { id } = useParams();
  const [region, setRegion] = useState<Region>();
  const [municipalities, setMunicipalities] = useState<Municipality[]>();
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
        const response = await getMunicipalitiesFromRegion(Number(id));
        if (!response.ok) {
          console.log("error fetching resource");
          return;
        }
        const result = await response.json();

        if (!mounted) return;
        console.log(result);

        startTransition(() => setMunicipalities(result));
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
        setErrorMsg("Du måste vara inloggad för att ta bort en region.");
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
      <section>
        <h1>{region && "Region: " + region.regions_name}</h1>
        <h2>Kommuner:</h2>
        <ul>
          {municipalities &&
            municipalities.map((municipality) => (
              <li key={municipality.municipalities_id}>
                <Link to={`/municipality/${municipality.municipalities_id}`}>
                  {municipality.municipalities_name}
                </Link>
              </li>
            ))}
        </ul>
        <p>{region && "Befolkning antal: " + region.regions_population}</p>
      </section>
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

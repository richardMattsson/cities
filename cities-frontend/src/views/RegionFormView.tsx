import { startTransition, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Region } from "../../../shared/types";
import {
  getOneRegionAPI,
  postRegionAPI,
  updateRegionAPI,
} from "../api/regions";

function RegionFormView() {
  const { option, id } = useParams();
  const add = option === "add";
  const [region, setRegion] = useState<Region>({
    regions_id: 0,
    regions_name: "",
    regions_population: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");

  useEffect(() => {
    if (add) {
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const response = await getOneRegionAPI(Number(id));
        if (!response.ok) {
          console.log("error fetching resources");
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
  }, [id, add]);

  async function postRegion(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = {
      regions_name: region.regions_name,
      regions_population: region.regions_population,
    };

    try {
      const response = await postRegionAPI(body);
      if (!response.ok) {
        console.log("error fetching resource");
      }
      setSuccesMsg("Du har skapat en ny region!");
    } catch {
      setErrorMsg("Något gick fel.");
      return;
    }
  }

  async function updateRegion(
    e: React.SubmitEvent<HTMLFormElement>,
    id: number,
  ) {
    e.preventDefault();

    const body = {
      regions_name: region.regions_name,
      regions_population: region.regions_population,
    };

    try {
      const response = await updateRegionAPI(body, id);

      if (!response.ok) {
        console.log("error fetching resource");
      }

      setSuccesMsg("Du har uppdaterat en region");
    } catch (error) {
      setErrorMsg("Något gick fel.");
      console.log(error);
    }
  }
  return (
    <article>
      <h2>{add ? "Skapa ny region" : "Uppdatera region"}</h2>
      <form
        onSubmit={
          add ? (e) => postRegion(e) : (e) => updateRegion(e, Number(id))
        }
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <section className="inputSection">
          <label htmlFor="regionInput">Region: </label>
          <input
            id="regionInput"
            type="text"
            placeholder="Region"
            value={region.regions_name}
            required
            onChange={(e) =>
              setRegion({
                regions_id: region.regions_id,
                regions_name: e.target.value,
                regions_population: region.regions_population,
              })
            }
          />
        </section>
        <section className="inputSection">
          <label htmlFor="populationInput">Antal invånare: </label>
          <input
            id="populationInput"
            type="number"
            value={region.regions_population}
            required
            onChange={(e) =>
              setRegion({
                regions_id: region.regions_id,
                regions_name: region.regions_name,
                regions_population: e.target.value,
              })
            }
          />
        </section>
        <input type="submit" value={"Skicka"} />
      </form>
      {errorMsg && <p>{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
    </article>
  );
}
export default RegionFormView;

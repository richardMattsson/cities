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
    id: 0,
    name: "",
    population: "",
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
      name: region.name,
      population: region.population,
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
      name: region.name,
      population: region.population,
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
          <label htmlFor="cityInput">Stad: </label>
          <input
            id="cityInput"
            type="text"
            placeholder="Region"
            value={region.name}
            required
            onChange={(e) =>
              setRegion({
                id: region.id,
                name: e.target.value,
                population: region.population,
              })
            }
          />
        </section>
        <section className="inputSection">
          <label htmlFor="populationInput">Antal invånare: </label>
          <input
            id="populationInput"
            type="number"
            value={region.population}
            required
            onChange={(e) =>
              setRegion({
                id: region.id,
                name: region.name,
                population: e.target.value,
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

import { startTransition, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Region } from "../../../shared/types";
import {
  getOneRegionAPI,
  postRegionAPI,
  updateRegionAPI,
} from "../api/regionsAPI";
import { getAuth } from "firebase/auth";
import FormInput from "../components/FormInput";
import "../css/FormView.css";

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
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att skapa en region.");
        return;
      }
      const response = await postRegionAPI(body, token);
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
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att skapa en region.");
        return;
      }
      const response = await updateRegionAPI(body, id, token);

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
    <article className="form-container">
      <h2>{add ? "Skapa ny region" : "Uppdatera region"}</h2>
      <form
        onSubmit={
          add ? (e) => postRegion(e) : (e) => updateRegion(e, Number(id))
        }
        className="form-style"
      >
        <FormInput
          id={String(region.regions_id)}
          label="Region"
          value={region.regions_name}
          setValue={(e) => setRegion({ ...region, regions_name: e })}
        />
        <FormInput
          id={String(region.regions_id)}
          label="Befolkning"
          value={region.regions_population}
          setValue={(e) => setRegion({ ...region, regions_population: e })}
        />
        <input type="submit" value="Skicka" className="form-submit" />
      </form>
      {errorMsg && <p>{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
    </article>
  );
}

export default RegionFormView;

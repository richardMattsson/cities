import { startTransition, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Municipality, Region } from "../../../shared/types";

import { getAuth } from "firebase/auth";
import {
  getOneMunicipalityAPI,
  postMunicipalityAPI,
  updateMunicipalityAPI,
} from "../api/municipalitiesAPI";
import { getRegionsAPI } from "../api/regionsAPI";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import "../css/FormView.css";

function MunicipalityFormView() {
  const { option, id } = useParams();
  const add = option === "add";
  const [municipality, setMunicipality] = useState<Municipality>({
    municipalities_id: 0,
    municipalities_name: "",
    municipalities_population: "",
    region_id: 0,
  });
  const [regions, setRegions] = useState<Region[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");

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

  useEffect(() => {
    if (add) {
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const response = await getOneMunicipalityAPI(Number(id));
        if (!response.ok) {
          console.log("error fetching resources");
          return;
        }
        const result = await response.json();

        if (!mounted) return;
        startTransition(() => setMunicipality(result[0]));
      } catch {
        if (mounted) return;
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, add]);

  async function postMunicipality(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setSuccesMsg("");
    const body: Omit<Municipality, "municipalities_id"> = {
      municipalities_name: municipality.municipalities_name,
      municipalities_population: municipality.municipalities_population,
      region_id: municipality.region_id,
    };

    try {
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att skapa en kommun.");
        return;
      }
      const response = await postMunicipalityAPI(body, token);
      const result = await response.json();
      if (!response.ok) {
        setErrorMsg(result.error);
        return;
      }

      setSuccesMsg("Du har skapat en ny kommun!");
    } catch {
      setErrorMsg("Något gick fel.");
      return;
    }
  }

  async function updateMunicipality(
    e: React.SubmitEvent<HTMLFormElement>,
    id: number,
  ) {
    e.preventDefault();

    const body: Omit<Municipality, "municipalities_id"> = {
      municipalities_name: municipality.municipalities_name,
      municipalities_population: municipality.municipalities_population,
      region_id: municipality.region_id,
    };

    try {
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att uppdatera en kommun.");
        return;
      }

      const response = await updateMunicipalityAPI(body, id, token);
      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result.error);
        return;
      }

      setSuccesMsg("Du har uppdaterat en kommun");
    } catch (error) {
      setErrorMsg("Något gick fel.");
      console.log(error);
    }
  }
  return (
    <article className="form-container">
      <h2>{add ? "Skapa ny kommun" : "Uppdatera kommun"}</h2>
      <form
        onSubmit={
          add
            ? (e) => postMunicipality(e)
            : (e) => updateMunicipality(e, Number(id))
        }
        className="form-style"
      >
        <FormInput
          id={String(municipality.municipalities_id)}
          label="Kommun"
          value={municipality.municipalities_name}
          setValue={(e) =>
            setMunicipality({ ...municipality, municipalities_name: e })
          }
        />
        <FormInput
          id={String(municipality.municipalities_id)}
          label="Befolkning"
          value={municipality.municipalities_population}
          setValue={(e) =>
            setMunicipality({ ...municipality, municipalities_population: e })
          }
        />
        <FormSelect
          id={String(municipality.municipalities_id)}
          label="Region"
          value={municipality.region_id}
          setValue={(e) => setMunicipality({ ...municipality, region_id: e })}
          children={
            regions &&
            regions.map((region) => (
              <option key={region.regions_id} value={region.regions_id}>
                {region.regions_name}
              </option>
            ))
          }
        />
        <input type="submit" value="Skicka" className="form-submit" />
      </form>
      {errorMsg && <p>{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
    </article>
  );
}
export default MunicipalityFormView;

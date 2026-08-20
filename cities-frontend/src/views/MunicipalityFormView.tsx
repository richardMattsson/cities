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
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <h2>{add ? "Skapa ny kommun" : "Uppdatera kommun"}</h2>
      <form
        onSubmit={
          add
            ? (e) => postMunicipality(e)
            : (e) => updateMunicipality(e, Number(id))
        }
        style={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          gap: "5px",
        }}
      >
        <section className="inputSection">
          <label htmlFor="municipalityInput" className="labelForm">
            Stad:
          </label>
          <input
            id="municipalityInput"
            type="text"
            placeholder="Kommun"
            value={municipality.municipalities_name}
            required
            onChange={(e) =>
              setMunicipality({
                municipalities_id: municipality.municipalities_id,
                municipalities_name: e.target.value,
                municipalities_population:
                  municipality.municipalities_population,
                region_id: municipality.region_id,
              })
            }
            className="inputField"
          />
        </section>
        <section className="inputSection">
          <label htmlFor="populationInput" className="labelForm">
            Antal invånare:{" "}
          </label>
          <input
            id="populationInput"
            type="number"
            placeholder="0"
            value={municipality.municipalities_population}
            required
            onChange={(e) =>
              setMunicipality({
                municipalities_id: municipality.municipalities_id,
                municipalities_name: municipality.municipalities_name,
                municipalities_population: e.target.value,
                region_id: municipality.region_id,
              })
            }
            className="inputField"
          />
        </section>
        <section className="inputSection">
          <label htmlFor="populationInput" className="labelForm">
            Region:
          </label>
          <select
            name=""
            id=""
            required
            onChange={(e) =>
              setMunicipality({
                municipalities_id: municipality.municipalities_id,
                municipalities_name: municipality.municipalities_name,
                municipalities_population:
                  municipality.municipalities_population,
                region_id: Number(e.target.value),
              })
            }
            className="inputField"
            value={municipality.region_id || ""}
          >
            <option value="" disabled>
              Välj
            </option>
            {regions &&
              regions.map((region) => (
                <option key={region.regions_id} value={region.regions_id}>
                  {region.regions_name}
                </option>
              ))}
          </select>
        </section>
        <input
          type="submit"
          value="Skicka"
          style={{
            width: "fit-content",
            alignSelf: "end",
            margin: "10px",
            padding: "5px",
          }}
        />
      </form>
      {errorMsg && <p>{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
    </article>
  );
}
export default MunicipalityFormView;

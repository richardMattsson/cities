import { startTransition, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { City, Region } from "../../../shared/types";
import { getOneCityAPI, postCityAPI, updateCityAPI } from "../api/citiesAPI";
import { getRegionsAPI } from "../api/regionsAPI";
import { getAuth } from "firebase/auth";

function CityFormView() {
  const { option, id } = useParams();
  const add = option === "add";
  const [city, setCity] = useState<City>({
    cities_id: 0,
    cities_name: "",
    cities_population: "",
    region: "",
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
        const response = await getOneCityAPI(Number(id));
        if (!response.ok) {
          console.log("error fetching resources");
          return;
        }
        const result = await response.json();

        if (!mounted) return;
        startTransition(() => setCity(result[0]));
      } catch {
        if (mounted) return;
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, add]);

  async function postCity(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setSuccesMsg("");
    const body = {
      cities_name: city.cities_name,
      cities_population: city.cities_population,
      region: city.region,
    };

    try {
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att skapa en stad.");
        return;
      }
      const response = await postCityAPI(body, token);
      const result = await response.json();
      if (!response.ok) {
        setErrorMsg(result.error);
        return;
      }

      setSuccesMsg("Du har skapat en ny stad!");
    } catch {
      setErrorMsg("Något gick fel.");
      return;
    }
  }

  async function updateCity(e: React.SubmitEvent<HTMLFormElement>, id: number) {
    e.preventDefault();

    const body = {
      cities_name: city.cities_name,
      cities_population: city.cities_population,
      region: city.region,
    };

    try {
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att uppdatera en stad.");
        return;
      }

      const response = await updateCityAPI(body, id, token);

      if (!response.ok) {
        console.log("error fetching resource");
      }

      setSuccesMsg("Du har uppdaterat en stad");
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
      <h2>{add ? "Skapa ny stad" : "Uppdatera stad"}</h2>
      <form
        onSubmit={add ? (e) => postCity(e) : (e) => updateCity(e, Number(id))}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          gap: "5px",
        }}
      >
        <section className="inputSection">
          <label htmlFor="cityInput" className="labelForm">
            Stad:
          </label>
          <input
            id="cityInput"
            type="text"
            placeholder="Stad"
            value={city.cities_name}
            required
            onChange={(e) =>
              setCity({
                cities_id: city.cities_id,
                cities_name: e.target.value,
                cities_population: city.cities_population,
                region: city.region,
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
            value={city.cities_population}
            required
            onChange={(e) =>
              setCity({
                cities_id: city.cities_id,
                cities_name: city.cities_name,
                cities_population: e.target.value,
                region: city.region,
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
              setCity({
                cities_id: city.cities_id,
                cities_name: city.cities_name,
                cities_population: city.cities_population,
                region: e.target.value,
              })
            }
            className="inputField"
          >
            <option value="" disabled>
              Välj
            </option>
            {regions &&
              regions.map((region) => (
                <option key={region.regions_id} value={region.regions_name}>
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
export default CityFormView;

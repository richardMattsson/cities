import { startTransition, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { City } from "../../../shared/types";
import { getOneCityAPI, postCityAPI, updateCityAPI } from "../api/cities";

function FormView() {
  const { option, id } = useParams();
  const add = option === "add";
  const [city, setCity] = useState<City>({ id: 0, name: "", population: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");

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
  }, [id]);

  async function postCity(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = { name: city.name, population: city.population };

    try {
      const response = await postCityAPI(body);
      if (!response.ok) {
        console.log("error fetching resource");
      }
      setSuccesMsg("Du har skapat en ny stad!");
    } catch {
      setErrorMsg("Något gick fel.");
      return;
    }
  }

  async function updateCity(e: React.SubmitEvent<HTMLFormElement>, id: number) {
    e.preventDefault();

    const body = { name: city.name, population: city.population };

    try {
      const response = await updateCityAPI(body, id);

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
    <article>
      <h2>{add ? "Skapa ny stad" : "Uppdatera" + id}</h2>
      <form
        onSubmit={add ? (e) => postCity(e) : (e) => updateCity(e, Number(id))}
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
            placeholder="Stad"
            value={city.name}
            required
            onChange={(e) =>
              setCity({
                id: city.id,
                name: e.target.value,
                population: city.population,
              })
            }
          />
        </section>
        <section className="inputSection">
          <label htmlFor="populationInput">Antal invånare: </label>
          <input
            id="populationInput"
            type="number"
            value={city.population}
            required
            onChange={(e) =>
              setCity({
                id: city.id,
                name: city.name,
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
export default FormView;

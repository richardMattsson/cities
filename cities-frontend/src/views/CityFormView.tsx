import { startTransition, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { City, Municipality } from "../../../shared/types";
import { getOneCityAPI, postCityAPI, updateCityAPI } from "../api/citiesAPI";
import { getAuth } from "firebase/auth";
import { getMunicipalitiesAPI } from "../api/municipalitiesAPI";
import "../css/FormView.css";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";

function CityFormView() {
  const { option, id } = useParams();
  const add = option === "add";
  const [city, setCity] = useState<City>({
    cities_id: 0,
    cities_name: "",
    cities_population: "",
    municipality_id: 0,
  });
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getMunicipalitiesAPI();
        if (!response.ok) {
          console.log("error fetching resources");
          return;
        }
        const result = await response.json();

        if (!mounted) return;
        startTransition(() => setMunicipalities(result));
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
    const body: Omit<City, "cities_id"> = {
      cities_name: city.cities_name,
      cities_population: city.cities_population,
      municipality_id: city.municipality_id,
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
    setErrorMsg("");
    setSuccesMsg("");

    const body: Omit<City, "cities_id"> = {
      cities_name: city.cities_name,
      cities_population: city.cities_population,
      municipality_id: city.municipality_id,
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
        return;
      }

      setSuccesMsg("Du har uppdaterat en stad");
    } catch (error) {
      setErrorMsg("Något gick fel.");
      console.log(error);
    }
  }

  return (
    <article className="form-container">
      <h2>{add ? "Skapa ny stad" : "Uppdatera stad"}</h2>
      <form
        onSubmit={add ? (e) => postCity(e) : (e) => updateCity(e, Number(id))}
        className="form-style"
      >
        <FormInput
          id={String(city.cities_id)}
          label="Stad"
          value={city.cities_name}
          setValue={(e) => setCity({ ...city, cities_name: e })}
        />
        <FormInput
          id={String(city.cities_id)}
          label="Befolkning"
          value={city.cities_population}
          setValue={(e: string | number) =>
            setCity({ ...city, cities_population: e })
          }
        />
        <FormSelect
          id={String(city.cities_id)}
          label="Kommun"
          setValue={(e) => setCity({ ...city, municipality_id: e })}
          value={city.municipality_id}
          children={
            municipalities &&
            municipalities.map((municipality) => (
              <option
                key={municipality.municipalities_id}
                value={municipality.municipalities_id}
              >
                {municipality.municipalities_name}
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

export default CityFormView;

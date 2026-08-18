import { startTransition, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteCityAPI, getOneCityAPI } from "../api/citiesAPI";
import type { City, Municipality } from "../../../shared/types";
import { getAuth } from "firebase/auth";
import { getMunicipalitiesAPI } from "../api/municipalitiesAPI";

function CityDetailView() {
  const { id } = useParams();
  const [city, setCity] = useState<City>({
    cities_id: 0,
    cities_name: "",
    cities_population: "",
    municipality: "",
  });
  const [municipalities, setMunicipalities] = useState<Municipality[]>();
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");
  const municipality = municipalities?.find(
    (municipality) => municipality.municipalities_name === city.municipality,
  );
  const municipalityId = municipality?.municipalities_id;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getOneCityAPI(Number(id));
        if (!response.ok) {
          console.log("error fetching resource");
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getMunicipalitiesAPI();
        if (!response.ok) {
          console.log("error fetching resource");
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

  async function deleteCity() {
    const proceed = confirm("Vill du verkligen ta bort staden?");

    if (!proceed) {
      return;
    }

    try {
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att ta bort en stad.");
        return;
      }

      const response = await deleteCityAPI(Number(id), token);
      if (!response.ok) {
        console.log("error fetching resource");
        return;
      }
      setSuccesMsg("Du har tagit bort en stad");
    } catch {
      setErrorMsg("Något gick fel.");
      return;
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
      <h1>{city && "Namn: " + city.cities_name}</h1>
      <p>{city && "Befolkning antal: " + city.cities_population}</p>
      <p>
        <Link to={`/municipality/${municipalityId ?? ""}`}>
          {city && "Municipality: " + city.municipality}
        </Link>
      </p>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "fit-content",
          marginTop: "30px",
        }}
      >
        <button>
          <Link to={`/city-form/update/${id}`}>Uppdatera stad</Link>
        </button>
        <button onClick={deleteCity}>Ta bort stad</button>
      </section>
      {errorMsg && <p>{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
    </article>
  );
}
export default CityDetailView;

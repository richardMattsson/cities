import { startTransition, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteCityAPI, getOneCityAPI } from "../api/citiesAPI";
import type { City, Municipality } from "../../../shared/types";
import { getAuth } from "firebase/auth";
import { getMunicipalitiesAPI } from "../api/municipalitiesAPI";
import "../css/DetailView.css";
import DetailButtonSection from "../components/DetailButtonSection";
import DetailInfoSection from "../components/DetailInfoSection";

function CityDetailView() {
  const { id } = useParams();
  const [city, setCity] = useState<City>({
    cities_id: 0,
    cities_name: "",
    cities_population: "",
    municipality_id: 0,
  });
  const [municipalities, setMunicipalities] = useState<Municipality[]>();
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");
  const municipality = municipalities?.find(
    (municipality) => municipality.municipalities_id === city.municipality_id,
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
    <article className="detail-article">
      <DetailInfoSection
        title="Stad"
        name={city && city.cities_name}
        population={city && city.cities_population}
        label="Kommun"
        children={
          <Link to={`/municipality/${municipalityId ?? ""}`}>
            <li>{municipality && municipality.municipalities_name}</li>
          </Link>
        }
      />

      <DetailButtonSection
        to={`/city-form/update/${id}`}
        onClick={deleteCity}
      />
      {errorMsg && <p>{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
    </article>
  );
}

export default CityDetailView;

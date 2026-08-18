import { startTransition, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { City, Municipality, Region } from "../../../shared/types";
import { getAuth } from "firebase/auth";
import {
  deleteMunicipalityAPI,
  getCitiesFromMunicipalityAPI,
  getOneMunicipalityAPI,
} from "../api/municipalitiesAPI";
import { getRegionsAPI } from "../api/regionsAPI";

function MunicipalityDetailView() {
  const { id } = useParams();
  const [municipality, setMunicipality] = useState<Municipality>({
    municipalities_id: 0,
    municipalities_name: "",
    municipalities_population: "",
    region_id: 0,
  });
  const [cities, setCities] = useState<City[]>();
  const [regions, setRegions] = useState<Region[]>();
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");
  const region = regions?.find(
    (region) => region.regions_id === municipality.region_id,
  );
  const regionId = region?.regions_id;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getOneMunicipalityAPI(Number(id));
        if (!response.ok) {
          console.log("error fetching resource");
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
  }, [id]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getRegionsAPI();
        if (!response.ok) {
          console.log("error fetching resource");
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
    let mounted = true;
    (async () => {
      try {
        const response = await getCitiesFromMunicipalityAPI(Number(id));
        if (!response.ok) {
          console.log("error fetching resource");
          return;
        }
        const result = await response.json();

        if (!mounted) return;

        startTransition(() => setCities(result));
      } catch {
        if (mounted) return;
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function deleteMunicipality() {
    const proceed = confirm("Vill du verkligen ta bort staden?");

    if (!proceed) {
      return;
    }

    try {
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att ta bort en kommun.");
        return;
      }

      const response = await deleteMunicipalityAPI(Number(id), token);
      if (!response.ok) {
        console.log("error fetching resource");
        return;
      }
      setSuccesMsg("Du har tagit bort en kommun");
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
      <section>
        <h1>{municipality && "Kommun: " + municipality.municipalities_name}</h1>

        <h2>Städer:</h2>
        <ul>
          {cities &&
            cities.map((city) => (
              <li key={city.cities_id}>
                <Link to={`/city/${city.cities_id}`}>{city.cities_name}</Link>
              </li>
            ))}
        </ul>
        <p>
          {municipality &&
            "Befolkning antal: " + municipality.municipalities_population}
        </p>
        <p>
          <Link to={`/region/${regionId ?? ""}`}>
            {region && "Region: " + region.regions_name}
          </Link>
        </p>
      </section>
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
          <Link to={`/municipality-form/update/${id}`}>Uppdatera kommmun</Link>
        </button>
        <button onClick={deleteMunicipality}>Ta bort kommun</button>
      </section>
      {errorMsg && <p>{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
    </article>
  );
}
export default MunicipalityDetailView;

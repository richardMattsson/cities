import { startTransition, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteCityAPI, getOneCityAPI } from "../api/cities";
import type { City, Region } from "../../../shared/types";
import { getRegionsAPI } from "../api/regions";

function CityDetailView() {
  const { id } = useParams();
  const [city, setCity] = useState<City>({
    cities_id: 0,
    cities_name: "",
    cities_population: "",
    region: "",
  });
  const [regions, setRegions] = useState<Region[]>();
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");
  const region = regions?.find((region) => region.regions_name === city.region);
  const regionId = region?.regions_id;

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
        console.log(result);

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

  async function deleteCity() {
    const proceed = confirm("Vill du verkligen ta bort staden?");

    if (!proceed) {
      return;
    }
    try {
      const response = await deleteCityAPI(Number(id));
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
        <Link to={`/region/${regionId ?? ""}`}>
          {city && "Region: " + city.region}
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

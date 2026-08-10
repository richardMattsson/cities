import { startTransition, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteCityAPI, getOneCityAPI } from "../api/cities";
import type { City } from "../../../shared/types";

function CityDetailView() {
  const { id } = useParams();
  const [city, setCity] = useState<City>();
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");

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
    <article>
      <h1>{city && "Namn: " + city.name}</h1>
      <p>{city && "Befolkning antal: " + city.population}</p>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "fit-content",
        }}
      >
        <button>
          <Link to={`/form/update/${id}`}>Uppdatera stad</Link>
        </button>
        <button onClick={deleteCity}>Ta bort stad</button>
      </section>
      {errorMsg && <p>{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
    </article>
  );
}
export default CityDetailView;

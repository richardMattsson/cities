import { startTransition, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Region } from "../../../shared/types";
import { deleteRegionAPI, getOneRegionAPI } from "../api/regions";

function RegionDetailView() {
  const { id } = useParams();
  const [region, setRegion] = useState<Region>();
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getOneRegionAPI(Number(id));
        if (!response.ok) {
          console.log("error fetching resource");
          return;
        }
        const result = await response.json();

        if (!mounted) return;

        startTransition(() => setRegion(result[0]));
      } catch {
        if (mounted) return;
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function deleteRegion() {
    const proceed = confirm("Vill du verkligen ta bort regionen?");

    if (!proceed) {
      return;
    }
    try {
      const response = await deleteRegionAPI(Number(id));
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
      <h1>{region && "Namn: " + region.name}</h1>
      <p>{region && "Befolkning antal: " + region.population}</p>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "fit-content",
        }}
      >
        <button>
          <Link to={`/region-form/update/${id}`}>Uppdatera region</Link>
        </button>
        <button onClick={deleteRegion}>Ta bort region</button>
      </section>
      {errorMsg && <p>{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
    </article>
  );
}
export default RegionDetailView;

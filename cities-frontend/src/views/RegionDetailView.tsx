import { startTransition, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Municipality, Region } from "../../../shared/types";
import {
  deleteRegionAPI,
  getMunicipalitiesFromRegion,
  getOneRegionAPI,
} from "../api/regionsAPI";
import { getAuth } from "firebase/auth";
import "../css/DetailView.css";
import DetailButtonSection from "../components/DetailButtonSection";
import DetailInfoSection from "../components/DetailInfoSection";

function RegionDetailView() {
  const { id } = useParams();
  const [region, setRegion] = useState<Region>();
  const [municipalities, setMunicipalities] = useState<Municipality[]>();
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getMunicipalitiesFromRegion(Number(id));
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
  }, [id]);

  async function deleteRegion() {
    const proceed = confirm("Vill du verkligen ta bort regionen?");

    if (!proceed) {
      return;
    }
    try {
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att ta bort en region.");
        return;
      }
      const response = await deleteRegionAPI(Number(id), token);
      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result?.error || "Något gick fel.");
        return;
      }

      setSuccesMsg("Du har tagit bort en region.");
    } catch (error) {
      setErrorMsg("Något gick fel.");
      console.error(error);
    }
  }

  return (
    <article className="detail-article">
      <DetailInfoSection
        title="Region"
        name={region && region.regions_name}
        population={region && String(region.regions_population)}
        label="Kommuner"
        children={
          municipalities &&
          municipalities.map((municipality) => (
            <Link
              key={municipality.municipalities_id}
              to={`/municipality/${municipality.municipalities_id}`}
            >
              <li>{municipality.municipalities_name}</li>
            </Link>
          ))
        }
      />

      <DetailButtonSection
        to={`/region-form/update/${id}`}
        onClick={deleteRegion}
      />

      {errorMsg && <p>{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
    </article>
  );
}

export default RegionDetailView;

import { startTransition, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { City, Municipality, Region } from "../../../shared/types";
import { deleteCityAPI, getOneCityAPI } from "../api/citiesAPI";
import {
  deleteMunicipalityAPI,
  getCitiesFromMunicipalityAPI,
  getMunicipalitiesAPI,
  getOneMunicipalityAPI,
} from "../api/municipalitiesAPI";
import { getAuth } from "firebase/auth";
import DetailInfoSection from "../components/DetailInfoSection";
import DetailButtonSection from "../components/DetailButtonSection";
import {
  deleteRegionAPI,
  getMunicipalitiesFromRegion,
  getOneRegionAPI,
  getRegionsAPI,
} from "../api/regionsAPI";
import "../css/DetailView.css";

export default function DetailView() {
  const { type, id } = useParams();

  switch (type) {
    case "city":
      return <CityDetailView id={Number(id)} />;
    case "municipality":
      return <MunicipalityDetailView id={Number(id)} />;
    case "region":
      return <RegionDetailView id={Number(id)} />;
    default:
  }
}

function CityDetailView({ id }: { id: number }) {
  const [city, setCity] = useState<City>();
  const [municipalities, setMunicipalities] = useState<Municipality[]>();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");
  const municipality = municipalities?.find(
    (municipality) => municipality.municipalities_id === city?.municipality_id,
  );
  const municipalityId = municipality?.municipalities_id;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setErrorMsg("");
      setLoading(true);
      setCity(undefined);

      try {
        const response = await getOneCityAPI(Number(id));

        if (!response.ok) {
          const result = await response.json();

          if (!mounted) return;

          setErrorMsg(result.error);
          setLoading(false);
          return;
        }

        const result = await response.json();

        if (!mounted) return;

        setLoading(false);
        startTransition(() => setCity(result[0]));
      } catch {
        if (!mounted) return;

        setErrorMsg("Något gick fel med att hämta staden");
        setLoading(false);
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
    try {
      const deleted = await deleteItem(Number(id), deleteCityAPI);

      if (deleted) {
        setSuccesMsg("Du har tagit bort en stad");
      }
    } catch (error) {
      if (error instanceof Error && error.message === "NOT_AUTHENTICATED") {
        setErrorMsg("Du måste vara inloggad för att ta bort en stad.");
      } else {
        setErrorMsg("Något gick fel.");
      }
    }
  }

  return (
    <article className="detail-article">
      {loading && <p data-cy="city-detail-loading">Laddar...</p>}
      {errorMsg && <p data-cy="city-detail-error">{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
      {city && (
        <>
          <DetailInfoSection
            title="Stad"
            name={city && city.cities_name}
            population={city && city.cities_population}
            label="Kommun"
            children={
              <Link
                key={city?.cities_id}
                to={`/detail/municipality/${municipalityId ?? ""}`}
              >
                <li>{municipality && municipality.municipalities_name}</li>
              </Link>
            }
          />
          <DetailButtonSection
            to={`/form/city/update/${id}`}
            onClick={deleteCity}
          />
        </>
      )}
    </article>
  );
}

function MunicipalityDetailView({ id }: { id: number }) {
  const [municipality, setMunicipality] = useState<Municipality>();
  const [cities, setCities] = useState<City[]>();
  const [regions, setRegions] = useState<Region[]>();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");
  const region = regions?.find(
    (region) => region.regions_id === municipality?.region_id,
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setErrorMsg("");
      setMunicipality(undefined);
      try {
        const response = await getOneMunicipalityAPI(Number(id));
        const result = await response.json();

        if (!response.ok) {
          if (!mounted) return;

          setErrorMsg(result.error);
          setLoading(false);
          return;
        }

        if (!mounted) return;

        startTransition(() => setMunicipality(result[0]));
        setLoading(false);
      } catch {
        if (!mounted) return;
        setErrorMsg("Något gick fel med att hämta kommunen");
        setLoading(false);
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
    const token = await getAuth().currentUser?.getIdToken();

    if (!token) {
      return setErrorMsg("Du måste vara inloggad för att ta bort en kommun.");
    }

    const proceed = confirm("Vill du verkligen ta bort?");

    if (!proceed) {
      return;
    }

    setErrorMsg("");
    setSuccesMsg("");

    try {
      const response = await deleteMunicipalityAPI(id, token);

      const result = await response.json();

      if (!response.ok) {
        return setErrorMsg(result.error);
      }

      setSuccesMsg("Du har tagit bort en kommun");
    } catch {
      setErrorMsg("Något gick fel.");
    }
  }

  return (
    <article className="detail-article">
      {loading && <p data-cy="municipality-detail-loading">Laddar...</p>}
      {errorMsg && <p data-cy="municipality-detail-error">{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
      {municipality && (
        <>
          <DetailInfoSection
            title="Kommun"
            name={municipality && municipality.municipalities_name}
            population={municipality && municipality.municipalities_population}
            label="Städer"
            children={
              cities &&
              cities.map((city) => (
                <Link
                  key={city.cities_id}
                  to={`/detail/city/${city.cities_id}`}
                >
                  <li>{city.cities_name}</li>
                </Link>
              ))
            }
            region={region}
          />
          <DetailButtonSection
            to={`/form/municipality/update/${id}`}
            onClick={deleteMunicipality}
          />
        </>
      )}
    </article>
  );
}

function RegionDetailView({ id }: { id: number }) {
  const [region, setRegion] = useState<Region>();
  const [municipalities, setMunicipalities] = useState<Municipality[]>();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setErrorMsg("");
      setLoading(true);
      setRegion(undefined);
      try {
        const response = await getOneRegionAPI(Number(id));

        if (!response.ok) {
          if (!mounted) return;
          const result = await response.json();
          setErrorMsg(result.error);
          setLoading(false);
          return;
        }
        const result = await response.json();
        if (!mounted) return;

        startTransition(() => setRegion(result[0]));
        setLoading(false);
      } catch {
        if (!mounted) return;
        setRegion(undefined);
        setErrorMsg("Något gick fel med att hämta regionen");
        setLoading(false);
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
    const token = await getAuth().currentUser?.getIdToken();

    if (!token) {
      return setErrorMsg("Du måste vara inloggad för att ta bort en region.");
    }

    const proceed = confirm("Vill du verkligen ta bort?");

    if (!proceed) {
      return;
    }

    setErrorMsg("");
    setSuccesMsg("");
    try {
      const response = await deleteRegionAPI(id, token);
      const result = await response.json();

      if (!response.ok) {
        return setErrorMsg(result.error);
      }

      setSuccesMsg("Du har tagit bort en region");
      setRegion(undefined);
    } catch {
      setErrorMsg("Något gick fel.");
    }
  }

  return (
    <article className="detail-article">
      {loading && <p data-cy="region-detail-loading">Laddar...</p>}
      {errorMsg && <p data-cy="region-detail-error">{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
      {region && (
        <>
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
                  to={`/detail/municipality/${municipality.municipalities_id}`}
                >
                  <li>{municipality.municipalities_name}</li>
                </Link>
              ))
            }
          />

          <DetailButtonSection
            to={`/form/region/update/${id}`}
            onClick={deleteRegion}
          />
        </>
      )}
    </article>
  );
}

async function deleteItem(
  id: number,
  deleteAPI: (id: number, token: string) => Promise<Response>,
) {
  const proceed = confirm("Vill du verkligen ta bort?");

  if (!proceed) {
    return false;
  }

  const token = await getAuth().currentUser?.getIdToken();

  if (!token) {
    throw new Error("NOT_AUTHENTICATED");
  }

  const response = await deleteAPI(id, token);

  if (!response.ok) {
    throw new Error("DELETE_FAILED");
  }

  return true;
}

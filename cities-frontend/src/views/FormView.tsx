import { startTransition, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { City, Municipality, Region } from "../../../shared/types";
import * as citiyApi from "../api/citiesAPI";
import * as municipalityApi from "../api/municipalitiesAPI";
import * as regionApi from "../api/regionsAPI";
import { getAuth } from "firebase/auth";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";

export default function FormView() {
  const { type } = useParams();

  switch (type) {
    case "city":
      return <CityFormView />;
    case "municipality":
      return <MunicipalityFormView />;
    case "region":
      return <RegionFormView />;
    default:
  }
}

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
        const response = await municipalityApi.getMunicipalitiesAPI();
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
        const response = await citiyApi.getOneCityAPI(Number(id));
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
      const response = await citiyApi.postCityAPI(body, token);
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

      const response = await citiyApi.updateCityAPI(body, id, token);

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

function MunicipalityFormView() {
  const { option, id } = useParams();
  const add = option === "add";
  const [municipality, setMunicipality] = useState<Municipality>({
    municipalities_id: 0,
    municipalities_name: "",
    municipalities_population: "",
    region_id: 0,
  });
  const [regions, setRegions] = useState<Region[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await regionApi.getRegionsAPI();
        if (!response.ok) {
          console.log("error fetching resources");
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
    if (add) {
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const response = await municipalityApi.getOneMunicipalityAPI(
          Number(id),
        );
        if (!response.ok) {
          console.log("error fetching resources");
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
  }, [id, add]);

  async function postMunicipality(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setSuccesMsg("");
    const body: Omit<Municipality, "municipalities_id"> = {
      municipalities_name: municipality.municipalities_name,
      municipalities_population: municipality.municipalities_population,
      region_id: municipality.region_id,
    };

    try {
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att skapa en kommun.");
        return;
      }
      const response = await municipalityApi.postMunicipalityAPI(body, token);
      const result = await response.json();
      if (!response.ok) {
        setErrorMsg(result.error);
        return;
      }

      setSuccesMsg("Du har skapat en ny kommun!");
    } catch {
      setErrorMsg("Något gick fel.");
      return;
    }
  }

  async function updateMunicipality(
    e: React.SubmitEvent<HTMLFormElement>,
    id: number,
  ) {
    e.preventDefault();

    const body: Omit<Municipality, "municipalities_id"> = {
      municipalities_name: municipality.municipalities_name,
      municipalities_population: municipality.municipalities_population,
      region_id: municipality.region_id,
    };

    try {
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att uppdatera en kommun.");
        return;
      }

      const response = await municipalityApi.updateMunicipalityAPI(
        body,
        id,
        token,
      );
      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result.error);
        return;
      }

      setSuccesMsg("Du har uppdaterat en kommun");
    } catch (error) {
      setErrorMsg("Något gick fel.");
      console.log(error);
    }
  }
  return (
    <article className="form-container">
      <h2>{add ? "Skapa ny kommun" : "Uppdatera kommun"}</h2>
      <form
        onSubmit={
          add
            ? (e) => postMunicipality(e)
            : (e) => updateMunicipality(e, Number(id))
        }
        className="form-style"
      >
        <FormInput
          id={String(municipality.municipalities_id)}
          label="Kommun"
          value={municipality.municipalities_name}
          setValue={(e) =>
            setMunicipality({ ...municipality, municipalities_name: e })
          }
        />
        <FormInput
          id={String(municipality.municipalities_id)}
          label="Befolkning"
          value={municipality.municipalities_population}
          setValue={(e) =>
            setMunicipality({ ...municipality, municipalities_population: e })
          }
        />
        <FormSelect
          id={String(municipality.municipalities_id)}
          label="Region"
          value={municipality.region_id}
          setValue={(e) => setMunicipality({ ...municipality, region_id: e })}
          children={
            regions &&
            regions.map((region) => (
              <option key={region.regions_id} value={region.regions_id}>
                {region.regions_name}
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

function RegionFormView() {
  const { option, id } = useParams();
  const add = option === "add";
  const [region, setRegion] = useState<Region>({
    regions_id: 0,
    regions_name: "",
    regions_population: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [succesMsg, setSuccesMsg] = useState("");

  useEffect(() => {
    if (add) {
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const response = await regionApi.getOneRegionAPI(Number(id));
        if (!response.ok) {
          console.log("error fetching resources");
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
  }, [id, add]);

  async function postRegion(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = {
      regions_name: region.regions_name,
      regions_population: region.regions_population,
    };

    try {
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att skapa en region.");
        return;
      }
      const response = await regionApi.postRegionAPI(body, token);
      if (!response.ok) {
        console.log("error fetching resource");
      }
      setSuccesMsg("Du har skapat en ny region!");
    } catch {
      setErrorMsg("Något gick fel.");
      return;
    }
  }

  async function updateRegion(
    e: React.SubmitEvent<HTMLFormElement>,
    id: number,
  ) {
    e.preventDefault();

    const body = {
      regions_name: region.regions_name,
      regions_population: region.regions_population,
    };

    try {
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        setErrorMsg("Du måste vara inloggad för att skapa en region.");
        return;
      }
      const response = await regionApi.updateRegionAPI(body, id, token);

      if (!response.ok) {
        console.log("error fetching resource");
      }

      setSuccesMsg("Du har uppdaterat en region");
    } catch (error) {
      setErrorMsg("Något gick fel.");
      console.log(error);
    }
  }
  return (
    <article className="form-container">
      <h2>{add ? "Skapa ny region" : "Uppdatera region"}</h2>
      <form
        onSubmit={
          add ? (e) => postRegion(e) : (e) => updateRegion(e, Number(id))
        }
        className="form-style"
      >
        <FormInput
          id={String(region.regions_id)}
          label="Region"
          value={region.regions_name}
          setValue={(e) => setRegion({ ...region, regions_name: e })}
        />
        <FormInput
          id={String(region.regions_id)}
          label="Befolkning"
          value={region.regions_population}
          setValue={(e) => setRegion({ ...region, regions_population: e })}
        />
        <input type="submit" value="Skicka" className="form-submit" />
      </form>
      {errorMsg && <p>{errorMsg}</p>}
      {succesMsg && <p>{succesMsg}</p>}
    </article>
  );
}

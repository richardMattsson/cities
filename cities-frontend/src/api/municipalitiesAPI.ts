import type { City, Municipality } from "../../../shared/types";

const URL = "http://localhost:3001/municipalities";

export async function getMunicipalitiesAPI() {
  const response = await fetch(URL);
  return response;
}

export async function getOneMunicipalityAPI(id: number) {
  const response = await fetch(`${URL}/${id}`);
  return response;
}

export async function sumOfMunicipalities() {
  const response = await fetch(`${URL}/sum`);
  return response;
}

export async function postMunicipalityAPI(
  body: Omit<Municipality, "municipalities_id">,
  token: string,
) {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return response;
}

export async function updateCityAPI(
  body: Omit<City, "municipalities_id">,
  id: number,
  token: string,
) {
  const response = await fetch(`${URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return response;
}

export async function deleteCityAPI(id: number, token: string) {
  const response = await fetch(`${URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

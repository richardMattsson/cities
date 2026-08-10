import type { City } from "../../../shared/types";

const URL = "http://localhost:3001/cities";

export async function getCitiesAPI() {
  const response = await fetch(URL);
  return response;
}

export async function getOneCityAPI(id: number) {
  const response = await fetch(`${URL}/${id}`);
  return response;
}

export async function postCityAPI(body: Omit<City, "cities_id">) {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response;
}

export async function updateCityAPI(body: Omit<City, "cities_id">, id: number) {
  const response = await fetch(`${URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response;
}

export async function deleteCityAPI(id: number) {
  const response = await fetch(`${URL}/${id}`, {
    method: "DELETE",
  });
  return response;
}

import type { Region } from "../../../shared/types";

const URL = "http://localhost:3001/regions";

export async function getRegionsAPI() {
  const response = await fetch(URL);
  return response;
}

export async function getOneRegionAPI(id: number) {
  const response = await fetch(`${URL}/${id}`);
  return response;
}

export async function sumOfRegions() {
  const response = await fetch(`${URL}/sum`);
  return response;
}

export async function getCitiesFromRegion(id: number) {
  const response = await fetch(`${URL}/cities/${id}`);
  return response;
}

export async function postRegionAPI(body: Omit<Region, "regions_id">) {
  const response = await fetch(URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response;
}

export async function updateRegionAPI(
  body: Omit<Region, "regions_id">,
  id: number,
) {
  const response = await fetch(`${URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response;
}

export async function deleteRegionAPI(id: number) {
  const response = await fetch(`${URL}/${id}`, {
    method: "DELETE",
  });
  return response;
}

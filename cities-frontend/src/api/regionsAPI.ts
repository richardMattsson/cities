import type { Region } from "../../../shared/types";

const URL = "/api/regions";

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

export async function getMunicipalitiesFromRegion(id: number) {
  const response = await fetch(`${URL}/municipalities/${id}`);
  return response;
}

export async function postRegionAPI(
  body: Omit<Region, "regions_id">,
  token: string,
) {
  const response = await fetch(URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return response;
}

export async function updateRegionAPI(
  body: Omit<Region, "regions_id">,
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

export async function deleteRegionAPI(id: number, token: string) {
  const response = await fetch(`${URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

import type { NextFunction, Request, Response } from "express";
import {
  deleteCity_service,
  insertCity,
  selectAll,
  selectOne,
  updateCity_service,
} from "../services/cityService.ts";
import { HttpError } from "../errors/HttpError.ts";

async function getCities(_req: Request, res: Response, next: NextFunction) {
  try {
    const cities = await selectAll();
    res.json(cities.rows);
  } catch (error) {
    next(error);
  }
}
async function getOneCity(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    const cities = await selectOne(Number(id));
    res.json(cities.rows);
  } catch (error) {
    next(error);
  }
}

async function postCity(req: Request, res: Response, next: NextFunction) {
  const { cities_name, cities_population, region } = req.body;
  if (typeof cities_name !== "string") {
    res.status(400).json({ error: "Invalid name" });
  }
  try {
    const city = await insertCity(
      cities_name,
      Number(cities_population),
      region,
    );
    res.status(201).json(city.rows[0]);
  } catch (error) {
    next(error);
  }
}

async function updateCity(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const { cities_name, cities_population, region } = req.body;

  try {
    const response = await updateCity_service(
      cities_name,
      Number(cities_population),
      region,
      Number(id),
    );
    if (!response) {
      return next(new HttpError(404, "City not found"));
    }
    res.status(200).json(response.rows[0]);
  } catch (error) {
    next(error);
  }
}

async function deleteCity(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    const result = await deleteCity_service(Number(id));
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export { getCities, getOneCity, postCity, updateCity, deleteCity };

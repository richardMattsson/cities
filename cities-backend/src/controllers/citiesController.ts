import type { NextFunction, Request, Response } from "express";
import * as service from "../services/cityService.ts";
import { HttpError } from "../errors/HttpError.ts";
import { validationResult } from "express-validator";

async function getCities(_req: Request, res: Response, next: NextFunction) {
  try {
    const cities = await service.getCities();
    res.json(cities);
  } catch (error) {
    next(error);
  }
}

function createGetOneCityHandler(getOneCity: typeof service.getOneCity) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const cities = await getOneCity(Number(id));
      if (cities.length < 1) {
        return next(new HttpError(404, "Kunde inte hitta staden"));
      }

      res.json(cities);
    } catch (error) {
      next(error);
    }
  };
}

const getOneCity = createGetOneCityHandler(service.getOneCity);

async function sumOfCities(_req: Request, res: Response, next: NextFunction) {
  try {
    const response = await service.sumOfCities();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

function createPostCityHandler(postCity: typeof service.postCity) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        error: "Ogiltig input",
      });
    }

    const { cities_name, cities_population, municipality_id } = req.body;

    try {
      const city = await postCity(
        cities_name,
        Number(cities_population),
        Number(municipality_id),
      );
      res.status(201).json(city);
    } catch (error) {
      next(error);
    }
  };
}

const postCity = createPostCityHandler(service.postCity);

function createUpdateCityHandler(updateCity: typeof service.updateCity) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        error: "Ogiltig input",
      });
    }

    const { id } = req.params;
    const { cities_name, cities_population, municipality_id } = req.body;

    try {
      const response = await updateCity(
        cities_name,
        Number(cities_population),
        Number(municipality_id),
        Number(id),
      );
      if (!response) {
        return next(new HttpError(404, "City not found"));
      }
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}

const updateCity = createUpdateCityHandler(service.updateCity);

async function deleteCity(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    const result = await service.deleteCity(Number(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export {
  getCities,
  getOneCity,
  sumOfCities,
  postCity,
  updateCity,
  deleteCity,
  createGetOneCityHandler,
  createPostCityHandler,
  createUpdateCityHandler,
};

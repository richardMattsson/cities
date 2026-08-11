import type { NextFunction, Request, Response } from "express";
import {
  deleteRegion_service,
  innerJoinCities,
  insertRegion,
  selectAll,
  selectOne,
  updateRegion_service,
} from "../services/regionService.ts";
import { HttpError } from "../errors/HttpError.ts";

async function getRegions(_req: Request, res: Response, next: NextFunction) {
  try {
    const regions = await selectAll();
    res.json(regions);
  } catch (error) {
    next(error);
  }
}
async function getOneRegionAPI(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  try {
    const region = await selectOne(Number(id));
    res.json(region);
  } catch (error) {
    next(error);
  }
}

async function getCitiesFromRegion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  try {
    const cities = await innerJoinCities(Number(id));
    res.json(cities);
  } catch (error) {
    next(error);
  }
}

async function postRegion(req: Request, res: Response, next: NextFunction) {
  const { regions_name, regions_population } = req.body;
  if (typeof regions_name !== "string" || regions_name.trim() === "") {
    return res.status(400).json({ error: "Invalid name" });
  }
  if (
    regions_population !== undefined &&
    Number.isNaN(Number(regions_population))
  ) {
    return res.status(400).json({ error: "Invalid population" });
  }
  try {
    const region = await insertRegion(
      regions_name.trim(),
      Number(regions_population),
    );
    res.status(201).json(region);
  } catch (error) {
    next(error);
  }
}

async function updateRegion(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const { regions_name, regions_population } = req.body;

  try {
    const response = await updateRegion_service(
      regions_name,
      Number(regions_population),
      Number(id),
    );
    if (!response) {
      return next(new HttpError(404, "Region not found"));
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function deleteRegion(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    const result = await deleteRegion_service(Number(id));
    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      (error.name === "DrizzleQueryError" ||
        (error as any).code === "23503" ||
        /foreign key/i.test(error.message))
    ) {
      return next(
        new HttpError(
          409,
          "Kan inte ta bort regionen: det finns en eller flera städer som refererar till den.",
        ),
      );
    }
    next(error);
  }
}

export {
  getRegions,
  getOneRegionAPI,
  getCitiesFromRegion,
  postRegion,
  updateRegion,
  deleteRegion,
};

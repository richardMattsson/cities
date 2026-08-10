import type { NextFunction, Request, Response } from "express";
import {
  deleteRegion_service,
  insertRegion,
  selectAll,
  selectOne,
  updateRegion_service,
} from "../services/regionService.ts";
import { HttpError } from "../errors/HttpError.ts";

async function getRegions(_req: Request, res: Response, next: NextFunction) {
  try {
    const regions = await selectAll();
    res.json(regions.rows);
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
    res.json(region.rows);
  } catch (error) {
    next(error);
  }
}

async function postRegion(req: Request, res: Response, next: NextFunction) {
  const { name, population } = req.body;
  if (typeof name !== "string") {
    res.status(400).json({ error: "Invalid name" });
  }
  try {
    const region = await insertRegion(name, Number(population));
    res.status(201).json(region.rows[0]);
  } catch (error) {
    next(error);
  }
}

async function updateRegion(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const { name, population } = req.body;

  try {
    const response = await updateRegion_service(
      name,
      Number(population),
      Number(id),
    );
    if (!response) {
      return next(new HttpError(404, "Region not found"));
    }
    res.status(200).json(response.rows[0]);
  } catch (error) {
    next(error);
  }
}

async function deleteRegion(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    const result = await deleteRegion_service(Number(id));
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export { getRegions, getOneRegionAPI, postRegion, updateRegion, deleteRegion };

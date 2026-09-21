import type { NextFunction, Request, Response } from "express";
import * as service from "../services/regionService.ts";
import { HttpError } from "../errors/HttpError.ts";
import { isForeignKeyConstraintError } from "../errors/isForeignKeyConstraintError.ts";

async function getRegions(_req: Request, res: Response, next: NextFunction) {
  try {
    const regions = await service.getRegions();
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
    const region = await service.getOneRegionAPI(Number(id));
    res.json(region);
  } catch (error) {
    next(error);
  }
}

async function sumOfRegions(_req: Request, res: Response, next: NextFunction) {
  try {
    const response = await service.sumOfRegions();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function getMunicipalitiesFromRegion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  try {
    const response = await service.getMunicipalitiesFromRegion(Number(id));
    res.json(response);
  } catch (error) {
    next(error);
  }
}

const createPostRegionHandler = (postRegion: typeof service.postRegion) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { regions_name, regions_population } = req.body;
    try {
      const region = await postRegion(
        regions_name.trim(),
        Number(regions_population),
      );
      res.status(201).json(region);
    } catch (error) {
      next(error);
    }
  };
};

const postRegion = createPostRegionHandler(service.postRegion);

function createUpdateRegionHandler(updateRegion: typeof service.updateRegion) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { regions_name, regions_population } = req.body;

    try {
      const response = await updateRegion(
        regions_name,
        Number(regions_population),
        Number(id),
      );
      if (!response || response.length < 1) {
        return next(new HttpError(404, "Kunde inte hitta regionen"));
      }
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}

const updateRegion = createUpdateRegionHandler(service.updateRegion);

function createDeleteRegionHandler(deleteRegion: typeof service.deleteRegion) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const result = await deleteRegion(Number(id));
      res.status(200).json(result);
    } catch (error) {
      if (isForeignKeyConstraintError(error)) {
        return next(
          new HttpError(
            409,
            "Du kan inte ta bort regionen eftersom den har kommuner.",
          ),
        );
      }
      next(error);
    }
  };
}

const deleteRegion = createDeleteRegionHandler(service.deleteRegion);

export {
  getRegions,
  getOneRegionAPI,
  sumOfRegions,
  getMunicipalitiesFromRegion,
  createPostRegionHandler,
  postRegion,
  createUpdateRegionHandler,
  updateRegion,
  createDeleteRegionHandler,
  deleteRegion,
};

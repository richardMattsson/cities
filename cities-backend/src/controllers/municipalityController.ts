import type { NextFunction, Request, Response } from "express";
import * as service from "../services/municipalityService.ts";
import { HttpError } from "../errors/HttpError.ts";
import { isForeignKeyConstraintError } from "../errors/isForeignKeyConstraintError.ts";

async function getMunicipalities(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response = await service.getMunicipalities();
    res.json(response);
  } catch (error) {
    next(error);
  }
}

async function getOneMunicipality(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  try {
    const response = await service.getOneMunicipality(Number(id));
    res.json(response);
  } catch (error) {
    next(error);
  }
}

async function sumOfMunicipalities(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response = await service.sumOfMunicipalities();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function getCitiesFromMunicipality(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  try {
    const response = await service.getCitiesFromMunicipality(Number(id));
    res.json(response);
  } catch (error) {
    next(error);
  }
}

function createPostMunicipalityHandler(
  postMunicipality: typeof service.postMunicipality,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { municipalities_name, municipalities_population, region_id } =
      req.body;

    try {
      const response = await postMunicipality(
        municipalities_name,
        Number(municipalities_population),
        Number(region_id),
      );
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };
}

const postMunicipality = createPostMunicipalityHandler(
  service.postMunicipality,
);

function createUpdateMunicipalityHandler(
  updateMunicipality: typeof service.updateMunicipality,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { municipalities_name, municipalities_population, region_id } =
      req.body;

    try {
      const response = await updateMunicipality(
        municipalities_name,
        Number(municipalities_population),
        Number(region_id),
        Number(id),
      );
      if (!response || response.length < 1) {
        return next(new HttpError(404, "Kunde inte hitta kommunen"));
      }

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}

const updateMunicipality = createUpdateMunicipalityHandler(
  service.updateMunicipality,
);

function createDeleteMunicipalityHandler(
  deleteMunicipality: typeof service.deleteMunicipality,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const result = await deleteMunicipality(Number(id));

      res.status(200).json(result);
    } catch (error) {
      if (isForeignKeyConstraintError(error)) {
        return next(
          new HttpError(
            409,
            "Du kan inte ta bort kommunen eftersom den har städer.",
          ),
        );
      }

      next(error);
    }
  };
}

const deleteMunicipality = createDeleteMunicipalityHandler(
  service.deleteMunicipality,
);

export {
  getMunicipalities,
  getOneMunicipality,
  sumOfMunicipalities,
  getCitiesFromMunicipality,
  createPostMunicipalityHandler,
  postMunicipality,
  createUpdateMunicipalityHandler,
  updateMunicipality,
  createDeleteMunicipalityHandler,
  deleteMunicipality,
};

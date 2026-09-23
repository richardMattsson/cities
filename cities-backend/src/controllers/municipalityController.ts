import type { NextFunction, Request, Response } from "express";
import * as service from "../services/municipalityService.ts";
import { HttpError } from "../errors/HttpError.ts";
import { isForeignKeyConstraintError } from "../errors/isForeignKeyConstraintError.ts";
import { isUniqueConstraintError } from "../errors/isUniqueConstraintError.ts";

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

function createGetOneMunicipalityHandler(
  getOneMunicipality: typeof service.getOneMunicipality,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const response = await getOneMunicipality(Number(id));

      if (!response || response.length < 1) {
        return next(new HttpError(404, "Kunde inte hitta kommunen"));
      }
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}

const getOneMunicipality = createGetOneMunicipalityHandler(
  service.getOneMunicipality,
);

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

function createGetCitiesFromMunicipalityHandler(
  getCitiesFromMunicipality: typeof service.getCitiesFromMunicipality,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const response = await getCitiesFromMunicipality(Number(id));
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}

const getCitiesFromMunicipality = createGetCitiesFromMunicipalityHandler(
  service.getCitiesFromMunicipality,
);

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
      if (isUniqueConstraintError(error)) {
        return next(
          new HttpError(409, "Det finns redan en kommun med det namnet."),
        );
      }
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
      if (isUniqueConstraintError(error)) {
        return next(
          new HttpError(409, "Det finns redan en kommun med det namnet."),
        );
      }
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

      if (!result || result.length < 1) {
        return next(new HttpError(404, "Kunde inte hitta kommunen"));
      }

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
  createGetOneMunicipalityHandler,
  getOneMunicipality,
  sumOfMunicipalities,
  createGetCitiesFromMunicipalityHandler,
  getCitiesFromMunicipality,
  createPostMunicipalityHandler,
  postMunicipality,
  createUpdateMunicipalityHandler,
  updateMunicipality,
  createDeleteMunicipalityHandler,
  deleteMunicipality,
};

import type { NextFunction, Request, Response } from "express";
import * as service from "../services/municipalityService.ts";
import { HttpError } from "../errors/HttpError.ts";

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

async function postMunicipality(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { municipalities_name, municipalities_population, region_id } =
    req.body;
  if (typeof municipalities_name !== "string") {
    res.status(400).json({ error: "Invalid name" });
  }
  if (!region_id) {
    res
      .status(400)
      .json({ error: "Du behöver ange vilken region kommunen tillhör." });
  }
  try {
    const response = await service.postMunicipality(
      municipalities_name,
      Number(municipalities_population),
      Number(region_id),
    );
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

async function updateMunicipality(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  const { municipalities_name, municipalities_population, region_id } =
    req.body;

  if (typeof municipalities_name !== "string") {
    res.status(400).json({ error: "Invalid name" });
  }
  if (!region_id) {
    res
      .status(400)
      .json({ error: "Du behöver ange vilken region kommunen tillhör." });
  }

  try {
    const response = await service.updateMunicipality(
      municipalities_name,
      Number(municipalities_population),
      Number(region_id),
      Number(id),
    );
    if (!response) {
      return next(new HttpError(404, "Kommun not found"));
    }

    res.status(200).json(response);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "DrizzleQueryError" ||
        (error as any).code === "23503" ||
        /foreign key/i.test(error.message))
    ) {
      return next(
        new HttpError(
          409,
          "Kan inte uppdatera kommunen: det finns ett problem med den angivna regionen.",
        ),
      );
    }
    next(error);
  }
}

async function deleteMunicipality(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  try {
    const result = await service.deleteMunicipality(Number(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export {
  getMunicipalities,
  getOneMunicipality,
  sumOfMunicipalities,
  getCitiesFromMunicipality,
  postMunicipality,
  updateMunicipality,
  deleteMunicipality,
};

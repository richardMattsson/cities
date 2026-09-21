import { body, param } from "express-validator";

const regionBodyValidation = [
  body("regions_name").isString().trim().notEmpty(),
  body("regions_population").isInt({ min: 0 }),
];

const regionParamValidation = [
  param("id").isInt({ min: 1 }).toInt().notEmpty(),
];

export const postRegionValidation = [...regionBodyValidation];

export const updateRegionValidation = [
  ...regionParamValidation,
  ...regionBodyValidation,
];

export const deleteRegionValidation = [...regionParamValidation];
export const getOneRegionValidation = [...regionParamValidation];
export const getMunicipalitiesFromRegionValidation = [...regionParamValidation];

import { body, param } from "express-validator";

const municipalityBodyValidation = [
  body("municipalities_name").isString().trim().notEmpty(),
  body("municipalities_population").isInt({ min: 0 }),
  body("region_id").isInt({ min: 1 }).notEmpty(),
];

const municipalityParamValidation = [
  param("id").isInt({ min: 1 }).toInt().notEmpty(),
];

export const postMunicipalityValidation = [...municipalityBodyValidation];

export const updateMunicipalityValidation = [
  ...municipalityParamValidation,
  ...municipalityBodyValidation,
];

export const deleteMunicipalityValidation = [...municipalityParamValidation];
export const getOneMunicipalityValidation = [...municipalityParamValidation];
export const getCitiesFromMunicipalityValidation = [
  ...municipalityParamValidation,
];

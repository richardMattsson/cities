import { body, param } from "express-validator";

export const cityBodyValidation = [
  body("cities_name").isString().trim().notEmpty(),
  body("cities_population").trim().isInt({ min: 0 }),
  body("municipality_id").trim().isInt({ min: 1 }),
];

export const cityParamValidation = [param("id").isInt({ min: 1 })];

export const updateCityValidation = [
  ...cityParamValidation,
  ...cityBodyValidation,
];
export const getOneCityValidation = [...cityParamValidation];
export const addCityValidation = [...cityBodyValidation];
export const deleteCityValidation = [...cityParamValidation];

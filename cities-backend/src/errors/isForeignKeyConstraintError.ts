export const isForeignKeyConstraintError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  if (
    "code" in error &&
    ["23503", "23001"].includes(String((error as { code?: unknown }).code))
  ) {
    return true;
  }

  if ("cause" in error) {
    return isForeignKeyConstraintError((error as { cause?: unknown }).cause);
  }

  return false;
};

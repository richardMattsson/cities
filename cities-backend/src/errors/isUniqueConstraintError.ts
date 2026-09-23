export const isUniqueConstraintError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  if (
    "code" in error &&
    ["23505"].includes(String((error as { code?: unknown }).code))
  ) {
    return true;
  }

  if ("cause" in error) {
    return isUniqueConstraintError((error as { cause?: unknown }).cause);
  }

  return false;
};

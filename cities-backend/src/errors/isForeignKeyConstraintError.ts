import { DrizzleQueryError } from "drizzle-orm";
import type { DatabaseError } from "pg";

export const isForeignKeyConstraintError = (error: unknown): boolean => {
  if (!(error instanceof DrizzleQueryError)) {
    return false;
  }

  const cause = error.cause;
  if (!cause || typeof cause !== "object") {
    return false;
  }

  return "code" in cause && (cause as DatabaseError).code === "23503";
};

import { getValidRhfFieldName } from "@/packages/lib/getValidRhfFieldName";

export const getFieldIdentifier = (name: string) => {
  return getValidRhfFieldName(name);
};

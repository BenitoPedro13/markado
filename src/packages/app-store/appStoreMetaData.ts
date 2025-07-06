import type { AppMeta } from "@/packages/types/App";



import { appStoreMetadata as rawAppStoreMetadata } from "./apps.metadata.generated";
import { getNormalizedAppMetadata } from "./getNormalizedAppMetadata";


type RawAppStoreMetaData = typeof rawAppStoreMetadata;
type AppStoreMetaData = {
  [key in keyof RawAppStoreMetaData]: Omit<AppMeta, "dirName"> & { dirName: string };
};

export const appStoreMetadata = {} as AppStoreMetaData;
for (const [key, value] of Object.entries(rawAppStoreMetadata)) {
  const res = getNormalizedAppMetadata(value);

  if (res === undefined) {
    console.log("value undefined", key, value);
  } else {
    appStoreMetadata[key as keyof typeof appStoreMetadata] =res;
  }
}

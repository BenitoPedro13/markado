import { defaultHandler } from "@/packages/lib/server";

export default defaultHandler({
  GET: import("./_getAdd"),
});

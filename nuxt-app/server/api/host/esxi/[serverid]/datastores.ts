import get_datastore_info from "~~/server/util/esxi/get_datastore_info";

export default defineEventHandler(async (event): Promise<string> => {
  return get_datastore_info(event.context.params.serverid);
});

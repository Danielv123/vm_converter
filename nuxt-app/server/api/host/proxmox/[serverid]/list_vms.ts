import datastore from "~~/server/services/datastore";
import get_pve_session from "~~/server/services/get_proxmox_session";

export default defineEventHandler(async (event): Promise<string> => {
  let server = datastore.servers.find(
    (server) => server.id === event.context.params.serverid,
  );
  if (!server) {
    throw new Error("Server not found");
  }

  const shell = await get_pve_session(server);

  let output = (await shell.get("/nodes/pve/qemu")).response;

  return output.data;
});

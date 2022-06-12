import datastore from "~~/server/services/datastore";
import get_pve_session from "~~/server/services/get_proxmox_session";
import ProxmoxVmStatus from "../types/ProxmoxVmStatus";

export default async function get_vm_info(
  serverid,
  vmid,
): Promise<ProxmoxVmStatus> {
  let server = datastore.servers.find((server) => server.id === serverid);
  if (!server) {
    throw new Error("Server not found");
  }

  const shell = await get_pve_session(server);
  let output = (await shell.get(`/nodes/pve/qemu/${vmid}/status/current`)).response;

  return output.data;
}

import datastore from "~~/server/services/datastore";
import get_proxmox_session from "~~/server/services/get_proxmox_session";
import ProxmoxVmOptions from "../types/ProxmoxVmOptions";

export default async function create_vm(serverid, vmoptions?: ProxmoxVmOptions) {
  let server = datastore.servers.find((server) => server.id === serverid);
  if (!server) {
    throw new Error("Server not found");
  }

  const shell = await get_proxmox_session(server);

  // Docs:
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/qemu
  let output = (
    await shell.create(`/nodes/pve/qemu`, {
      node: "pve",
      vmid: Math.floor(Math.random() * 1000),
    })
  ).response;

  return output;
}

export { ProxmoxVmOptions };

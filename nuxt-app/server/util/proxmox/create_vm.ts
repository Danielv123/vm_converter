import datastore from "~~/server/services/datastore";
import get_proxmox_session from "~~/server/services/get_proxmox_session";
import ProxmoxVmOptions from "../types/ProxmoxVmOptions";

export default async function create_vm(
  serverid,
  vmoptions?: ProxmoxVmOptions,
) {
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
      vmid: vmoptions.vmid || Math.floor(Math.random() * 1000),
      ...vmoptions,
      name: vmoptions.name.replaceAll(/[^.a-zA-Z\d]/, "-"), // only DNS-safe characters
    })
  ).response;

  if (!output.data) {
    console.log(output);
    throw new Error("Failed to create VM");
  }

  return output;
}

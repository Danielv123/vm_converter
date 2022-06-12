import child_process from "node:child_process";
import datastore from "~~/server/services/datastore";
import get_proxmox_vm_info from "~~/server/util/proxmox/get_vm_info";

export default async function convert_disk(
  serverid: string,
  vmid: number,
  vmdkpath = "windows_xp_64/windows_xp_64.vmdk",
) {
  let server = datastore.servers.find((server) => server.id === serverid);
  if (!server) {
    throw new Error("Server not found");
  }

  const proxmoxvminfo = await get_proxmox_vm_info(serverid, vmid);
  console.log(proxmoxvminfo);

  return new Promise((resolve, reject) => {
    const process = child_process.spawn("ssh", [
      `${server.username}@${server.ip}`,
      `qemu-img convert -f vmdk ${vmdkpath} -O qcow2 /var/lib/vz/images/${vmid}/windows_xp_64.qcow2`,
    ]);

    process.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    process.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    process.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(true);
    });
  });
}

import child_process from "node:child_process";
import datastore from "~~/server/services/datastore";
import get_proxmox_vm_info from "~~/server/util/proxmox/get_vm_info";

export default async function convert_disk(
  serverid: string,
  path = "windows_xp_64",
) {
  let server = datastore.servers.find((server) => server.id === serverid);
  if (!server) {
    throw new Error("Server not found");
  }

  return new Promise((resolve, reject) => {
    const process = child_process.spawn("ssh", [
      `${server.username}@${server.ip}`,
      `ls ${path} -1`,
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

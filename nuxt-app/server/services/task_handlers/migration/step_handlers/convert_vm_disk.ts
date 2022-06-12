import child_process from "node:child_process";
import datastore from "~~/server/services/datastore";
import MigrationStep from "~~/server/util/types/MigrationStep";
import Migration from "~~/server/util/types/Migration";
import get_vm_info from "~~/server/util/esxi/get_vm_info";
import get_datastore_info from "~~/server/util/esxi/get_datastore_info";
import convert_disk from "~~/server/util/proxmox/convert_disk";

export default async function move_esxi_vm(
  step: MigrationStep,
  task: Migration,
) {
  let destinationserver = datastore.servers.find(
    (server) => server.id === step.serverid,
  );
  if (!destinationserver) {
    throw new Error("Server not found");
  }

  const vminfo = await get_vm_info(task.serverid, task.originvmid);

  const origindatastoreinfo = await get_datastore_info(
    task.serverid,
    vminfo.DatastoreIdList[0],
  );

  await convert_disk(task.serverid, step.vmid, `${vminfo.Name}/${vminfo.Name}.vmdk`);
}

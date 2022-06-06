import child_process from "node:child_process";
import datastore from "~~/server/services/datastore";
import MigrationStep from "~~/server/util/types/MigrationStep";
import Migration from "~~/server/util/types/Migration";
import get_vm_info from "~~/server/util/esxi/get_vm_info";
import get_datastore_info from "~~/server/util/esxi/get_datastore_info";
import create_vm from "~~/server/util/proxmox/create_vm";

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

  return create_vm(step.serverid, {
    vmid: Number(step.vmid),
    name: "conv_" + vminfo.Name,
    description: "VM created by https://github.com/Danielv123/vm_converter",
    cores: 4,
    memory: 2048,
    net0: "model=e1000,bridge=vmbr0,firewall=0",
    onboot: false,
    scsi0: "local:1,format=qcow2",
  });
}

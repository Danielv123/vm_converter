import get_vm_info from "~~/server/util/esxi/get_vm_info";
import stop_vm from "~~/server/util/esxi/stop_vm";
import Migration from "~~/server/util/types/Migration";
import MigrationStep from "~~/server/util/types/MigrationStep";

export default async function stop_esxi_vm(
  step: MigrationStep,
  task: Migration,
) {
  const vminfo = await get_vm_info(step.serverid, step.vmid);

  // Check if VM is not stopped
  if (vminfo.PowerState !== 0) {
    console.log("Stopping ", step.vmid, vminfo.Name);
    return stop_vm(step.serverid, vminfo.Name);
  } else {
    console.log("VM is already stopped", step.vmid, vminfo.Name);
  }
  return false;
}

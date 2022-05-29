import child_process from "node:child_process";
import datastore from "~~/server/services/datastore";
import MigrationStep from "~~/server/util/types/MigrationStep";
import Migration from "~~/server/util/types/Migration";
import get_vm_info from "~~/server/util/esxi/get_vm_info";
import get_datastore_info from "~~/server/util/esxi/get_datastore_info";

export default async function move_esxi_vm(
  step: MigrationStep,
  task: Migration,
) {
  let originserver = datastore.servers.find(
    (server) => server.id === step.originid,
  );
  let destinationserver = datastore.servers.find(
    (server) => server.id === step.targetid,
  );
  if (!originserver || !destinationserver) {
    throw new Error("Server not found");
  }

  const vminfo = await get_vm_info(step.originid, step.vmid);
  const datastoreinfo = await get_datastore_info(
    step.originid,
    vminfo.DatastoreIdList[0],
  );

  await new Promise((resolve) => {
    const origin = `root@${originserver.ip}:/vmfs/volumes/${datastoreinfo.Name}/${vminfo.Name}`;
    const destination = `root@${destinationserver.ip}:/root/${vminfo.Name}`;
    console.log(
      "Moving disks for VM",
      vminfo.Name,
      "from",
      origin,
      "to",
      destination,
    );
    const scp = child_process.spawn("scp", ["-rB3", origin, destination]);

    scp.stdout.on("data", (msg) => {
      console.log("scp: ", msg);
    });
    scp.on("error", (err) => {
      console.error(err);
    });
    scp.on("exit", (code) => {
      console.log("SCP exited with code", code);
      resolve(true);
    });
  });
}

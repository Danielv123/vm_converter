import datastore, { saveDatastore } from "~~/server/services/datastore";
import { v4 as uuidv4 } from "uuid";
import migrate from "~~/server/services/task_handlers/migration/migration";
import Migration from "~~/server/util/types/Migration";
import MigrationStatus from "~~/server/util/types/MigrationStatus";

// tslint:disable-next-line
export default defineEventHandler(async (event): Promise<Migration> => {
  let server = datastore.servers.find(
    (server) => server.id === event.context.params.serverid,
  );
  if (!server) {
    throw new Error("Server not found");
  }

  const formstate = await useBody(event);

  // Create a new migration task
  const vmid = Math.floor(Math.random() * 10000);
  let migration: Migration = {
    id: uuidv4(),
    type: "migration",
    serverid: server.id,
    originvmid: event.context.params.vmid,
    targetid: event.context.params.targetid,
    formstate: formstate,
    started: Date.now(),
    completed: null,
    steps: [
      {
        type: "stop_esxi_vm",
        description: "Stop VM",
        status: MigrationStatus.Pending,
        serverid: event.context.params.serverid,
        vmid: event.context.params.vmid,
      },
      {
        type: "create_proxmox_vm",
        description: "Create target VM",
        status: MigrationStatus.Pending,
        serverid: "2",
        vmid,
      },
      {
        type: "move_esxi_vm",
        description: "Move VM to proxmox server",
        status: MigrationStatus.Pending,
        originid: event.context.params.serverid,
        vmid: event.context.params.vmid,
        targetid: event.context.params.targetid,
      },
      {
        type: "convert_vm_disk",
        description: "Convert VM disk",
        status: MigrationStatus.Pending,
        vmid,
      },
      {
        type: "convert_vm_config",
        description: "Convert VM config",
        status: MigrationStatus.Pending,
        vmid,
      },
      {
        type: "register_pve_vm",
        description: "Register VM",
        status: MigrationStatus.Pending,
        vmid,
      },
      {
        type: "start_pve_vm",
        description: "Start VM",
        status: MigrationStatus.Pending,
        vmid,
      },
    ],
  };
  datastore.tasks.push(migration);
  await saveDatastore();

  // Start migration job
  let promise = migrate(migration);

  return migration;
});

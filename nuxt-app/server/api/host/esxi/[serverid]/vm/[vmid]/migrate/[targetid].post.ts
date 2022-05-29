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

  // Create a new migration task
  let migration: Migration = {
    id: uuidv4(),
    type: "migration",
    serverid: server.id,
    targetid: event.context.params.targetid,
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
      },
      {
        type: "convert_vm_config",
        description: "Convert VM config",
        status: MigrationStatus.Pending,
      },
      {
        type: "register_pve_vm",
        description: "Register VM",
        status: MigrationStatus.Pending,
      },
      {
        type: "start_pve_vm",
        description: "Start VM",
        status: MigrationStatus.Pending,
      },
    ],
  };
  datastore.tasks.push(migration);
  await saveDatastore();

  // Start migration job
  let promise = migrate(migration);

  return migration;
});
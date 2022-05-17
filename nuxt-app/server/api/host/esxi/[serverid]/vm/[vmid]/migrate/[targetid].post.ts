import datastore, { saveDatastore } from "~~/server/services/datastore";
import { v4 as uuidv4 } from "uuid";

interface Migration {
  id: string;
  type: string;
  serverid: number;
  targetid: number;
  started: number;
  completed: boolean;
  steps: MigrationStep[];
}

interface MigrationStep {
  description: string;
  status: MigrationStatus;
  originid?: number;
  targetid?: number;
  vmid?: string;
}

enum MigrationStatus {
  Pending = "pending",
  Running = "running",
  Completed = "completed",
  Failed = "failed",
}

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
        description: "Stop VM",
        status: MigrationStatus.Pending,
      },
      {
        description: "Move VM to proxmox server",
        status: MigrationStatus.Pending,
        originid: event.context.params.serverid,
        vmid: event.context.params.vmid,
        targetid: event.context.params.targetid,
      },
      {
        description: "Convert VM disk",
        status: MigrationStatus.Pending,
      },
      {
        description: "Convert VM config",
        status: MigrationStatus.Pending,
      },
      {
        description: "Register VM",
        status: MigrationStatus.Pending,
      },
      {
        description: "Start VM",
        status: MigrationStatus.Pending,
      },
    ],
  };
  datastore.tasks.push(migration);
  await saveDatastore();

  return migration;
});

import datastore from "~~/server/services/datastore";
import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event): Promise<string> => {
  let server = datastore.servers.find(
    (server) => server.id === event.context.params.serverid,
  );
  if (!server) {
    throw new Error("Server not found");
  }

  // Create a new migration task
  let migration = {
    id: uuidv4(),
    serverid: server.id,
    targetid: event.context.params.targetid,
    started: Date.now(),
    completed: null,
    steps: [
      {
        description: "Stop VM",
      },
      {
        description: "Move VM to proxmox server",
        originid: event.context.params.serverid,
        vmid: event.context.params.vmid,
        targetid: event.context.params.targetid,
      },
      {
        description: "Convert VM disk",
      },
      {
        description: "Convert VM config",
      },
      {
        description: "Register VM",
      },
      {
        description: "Start VM",
      },
    ],
  };
  datastore.tasks.push(migration);

  return migration.id;
});

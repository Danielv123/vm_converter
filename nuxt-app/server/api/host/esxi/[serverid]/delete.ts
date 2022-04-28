import datastore from "~~/server/services/datastore";

export default defineEventHandler((event) => {
  return datastore.servers = datastore.servers.filter((server) => server.id !== event.context.params.serverid)
});

import datastore from "~~/server/services/datastore";

export default defineEventHandler((event) => {
  return datastore.servers.find((server) => server.id === event.context.params.serverid)
});

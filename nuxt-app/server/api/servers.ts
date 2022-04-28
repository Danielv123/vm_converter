import datastore from "../services/datastore";

export default defineEventHandler((event) => {
  return datastore.servers;
});

import datastore from "~~/server/services/datastore";

export default defineEventHandler((event) => {
  return datastore.tasks;
});

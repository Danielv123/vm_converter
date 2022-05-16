import datastore from "~~/server/services/datastore";

export default defineEventHandler((event) => {
  return datastore.tasks.find(
    (task) => task.id === event.context.params.taskid,
  );
});

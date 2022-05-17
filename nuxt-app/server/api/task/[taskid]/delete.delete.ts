import datastore, { saveDatastore } from "~~/server/services/datastore";

export default defineEventHandler(async (event) => {
  let task = datastore.tasks.find(task => task.id === event.context.params.taskid);
  if (task) {
    // Run cleanup
    console.log("Deleting task", task.id);
  }
  let oldLength = datastore.tasks.length;
  datastore.tasks = datastore.tasks.filter(
    (task) => {
      if (task.id === event.context.params.taskid) console.log("Removed task", task.id, event.context.params);
      return task.id !== event.context.params.taskid
    },
  )
  await saveDatastore();
  return oldLength > datastore.tasks.length;
});

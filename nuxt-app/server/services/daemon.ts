import datastore from "~~/server/services/datastore";

enum MigrationStatus {
  Pending = "pending",
  Running = "running",
  Completed = "completed",
  Failed = "failed",
}

// Look for tasks, start execution and watch for completion
async function check_for_tasks() {
  console.log("Checking for tasks");
  for (let task of datastore.tasks) {
    for (let step of task.steps) {
      if (step.status === MigrationStatus.Pending) {
        // Process
        step.status = MigrationStatus.Running;

        break;
      }
    }
  }
}

const interval = setInterval(check_for_tasks, 10000);
export { interval, check_for_tasks };

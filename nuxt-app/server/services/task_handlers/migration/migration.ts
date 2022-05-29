import Migration from "~~/server/util/types/Migration";
import * as handlers from "./step_handlers/handlers";

enum MigrationStatus {
  Pending = "pending",
  Running = "running",
  Completed = "completed",
  Failed = "failed",
}

// Look for tasks, start execution and watch for completion
export default async function migrate(task: Migration) {
  console.log("Checking for tasks");
  for (let step of task.steps) {
    if (step.status === MigrationStatus.Pending) {
      // Mark as running
      step.status = MigrationStatus.Running;

      // Call the correct handler
      console.log("Running step", step.type);
      await handlers[step.type](step, task);
    }
  }
}

import Migration from "~~/server/util/types/Migration";
import MigrationStep from "~~/server/util/types/MigrationStep";

export default async function stop_esxi_vm(
  step: MigrationStep,
  task: Migration,
) {
  throw new Error("Not implemented");
}

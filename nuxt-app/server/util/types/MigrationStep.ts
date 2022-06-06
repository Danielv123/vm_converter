import MigrationStatus from "./MigrationStatus";

export default interface MigrationStep {
  type: string;
  description: string;
  status: MigrationStatus;
  serverid?: string;
  originid?: string;
  targetid?: string;
  vmid?: number;
}

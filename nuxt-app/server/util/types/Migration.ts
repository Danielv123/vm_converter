import MigrationStep from "./MigrationStep";

export default interface Migration {
  id: string;
  type: string;
  serverid: string;
  targetid: string;
  started: number;
  completed: boolean;
  steps: MigrationStep[];
}

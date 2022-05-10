import datastore from "~~/server/services/datastore";
import get_pwsh_session from "~~/server/services/get_pwsh_session";

export default defineEventHandler(async (event): Promise<string> => {
  let server = datastore.servers.find(
    (server) => server.id === event.context.params.serverid,
  );
  if (!server) {
    throw new Error("Server not found");
  }

  let shell = await get_pwsh_session(server);

  let output = await shell.invoke(
    `$WarningPreference = 'SilentlyContinue'; Get-VMHostService -Server ${server.ip} | Where-Object {$_.Key -eq "${event.context.params.serviceid}" } | Start-VMHostService -Confirm:$False | Select-Object -Property Key, Label, Policy, Required, Ruleset, Running, Uninstallable, VMHostId, VMHostUid, Uid, ExtensionData | ConvertTo-Json -Compress -Depth 99`,
  );

  return output.raw.replace("\u001b[?1h\u001b[?1l", "").replace("[?1h[?1l[?1h[?1l", "");
});

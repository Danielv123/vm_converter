import datastore from "~~/server/services/datastore";
import get_pwsh_session from "~~/server/services/get_pwsh_session";

export default defineEventHandler(async (event): Promise<string> => {
  let server = datastore.servers.find(
    (server) => server.id === event.context.params.serverid,
  );
  if (!server) {
    throw new Error("Server not found");
  }

  const shell = await get_pwsh_session(server);

  // let output = await runShellCommand(`pwsh -c "Connect-VIServer -Server 192.168.10.52 -User root -Password 'Monster123!'; Get-VM"`);
  let output = await shell.invoke(
    `Get-VM -Server ${server.ip} | Select-Object -Property Name,Uid,PowerState,NumCpu,CoresPerSocket,MemoryMB,HardwareVersion,PersistendId,GuestId,UsedSpaceGB,ProvisionedSpaceGB,DatastoreIdList,CreateDate,Id | ConvertTo-Json -Compress -Depth 99`,
  );
  // await runShellCommand("pwsh -c Get-VM");

  return output.raw.replace("\u001b[?1h\u001b[?1l", "").replace("[?1h[?1l[?1h[?1l", "");
});

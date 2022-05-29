import datastore from "~~/server/services/datastore";
import get_pwsh_session from "~~/server/services/get_pwsh_session";

export default async function stop_vm(serverid: string, vmname: string) {
  let server = datastore.servers.find((server) => server.id === serverid);
  if (!server) {
    throw new Error("Server not found");
  }

  let shell = await get_pwsh_session(server);
  let output = await shell.invoke(
    `Stop-VM -Server ${server.ip} -VM '${vmname
      .split("%20")
      .join(
        " ",
      )}' -Confirm:$False | Select-Object -Property Name,Uid,PowerState,NumCpu,CoresPerSocket,MemoryMB,HardwareVersion,PersistendId,GuestId,UsedSpaceGB,ProvisionedSpaceGB,DatastoreIdList,CreateDate,Id | ConvertTo-Json -Compress -Depth 99`,
  );

  return JSON.parse(output.raw.replace("\u001b[?1h\u001b[?1l", "").replace("[?1h[?1l[?1h[?1l", ""));
}

import datastore from "~~/server/services/datastore";
import get_pwsh_session from "~~/server/services/get_pwsh_session";

export default async function get_datastore_info(
  serverid: string,
  datastoreid: string = "",
) {
  let server = datastore.servers.find((server) => server.id === serverid);
  if (!server) {
    throw new Error("Server not found");
  }

  let shell = await get_pwsh_session(server);

  let datastoreSpecifier = "";
  if (datastoreid) {
    datastoreSpecifier = "-Id " + datastoreid;
  }
  let output = await shell.invoke(
    `$WarningPreference = 'SilentlyContinue'; Get-Datastore -Server ${server.ip} ${datastoreSpecifier} | Select-Object -Property FileSystemVersion, DatacenterId, ParentFolderId, DatastoreBrowserPath, FreeSpaceMB, CapacityMB, Type, StorageIOControlEnabled, CongestionThresholdMillisecond, State, CapacityGB, FreeSpaceGB, Name, Id, Uid, RemoteHost, RemotePath, UserName, AuthenticationMethod | ConvertTo-Json -Compress -Depth 99`,
  );

  return JSON.parse(
    output.raw.replace("\u001b[?1h\u001b[?1l", "").replace("[?1h[?1l[?1h[?1l", ""),
  );
}

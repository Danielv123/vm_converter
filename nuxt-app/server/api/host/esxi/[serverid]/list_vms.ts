import datastore from "~~/server/services/datastore";
import { exec } from "child_process";
import { PowerShell } from "node-powershell";

let hasDisabledCertificate = false;
let hasDisabledCeip = false;

export default defineEventHandler(async (event): Promise<string> => {
  let server = datastore.servers.find(
    (server) => server.id === event.context.params.serverid,
  );
  if (!server) {
    throw new Error("Server not found");
  }
  const shell = new PowerShell({
    debug: false,
    executableOptions: {
      "-ExecutionPolicy": "Bypass",
      "-NoProfile": true,
    },
  });
  // Run ls shell command
  if (!hasDisabledCertificate) {
    await runShellCommand(
      `pwsh -c "Set-PowerCLIConfiguration -InvalidCertificateAction:Ignore -Confirm:\\\$false"`,
    );
    hasDisabledCertificate = true;
  }
  if (!hasDisabledCeip) {
    await runShellCommand(
      `pwsh -c "Set-PowerCLIConfiguration -Scope:User -Confirm:\\\$false -ParticipateInCEIP:\\\$false"`,
    );
    hasDisabledCeip = true;
  }
  // let output = await runShellCommand(`pwsh -c "Connect-VIServer -Server 192.168.10.52 -User root -Password 'Monster123!'; Get-VM"`);
  await shell.invoke(
    `Connect-VIServer -Server ${server.ip} -User ${server.username} -Password '${server.password}'`,
  );
  let output = await shell.invoke(
    `Get-VM -Server ${server.ip} | Select-Object -Property Name,Uid,PowerState,NumCpu,CoresPerSocket,MemoryMB,HardwareVersion,PersistendId,GuestId,UsedSpaceGB,ProvisionedSpaceGB,DatastoreIdList,CreateDate,Id | ConvertTo-Json -Compress -Depth 99`,
  );
  // await runShellCommand("pwsh -c Get-VM");

  return output.raw.replace("\u001b[?1h\u001b[?1l", "").replace("[?1h[?1l[?1h[?1l", "");
});

async function runShellCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        reject(err);
      }
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      if (stderr) console.log(`stderr: ${stderr}`);
      resolve(stdout);
    });
  });
}

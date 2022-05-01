import { exec } from "child_process";
import { PowerShell } from "node-powershell";

let has_ran_shell_commands = false;

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

async function sleep(s) {
  return new Promise((r) => setTimeout(r, s * 1000));
}
async function waitForReady(session) {
  await sleep(1);
  if (!session.ready) return await waitForReady(session);
  return session;
}

// Store sessions for reuse
const pwsh_sessions = [];

async function get_pwsh_session({ id, ip, username, password }) {
  if (!pwsh_sessions[id]) {
    let session = {
      ready: false,
      shell: new PowerShell({
        debug: false,
        executableOptions: {
          "-ExecutionPolicy": "Bypass",
          "-NoProfile": true,
        },
      }),
    };
    pwsh_sessions[id] = session;
    if (!has_ran_shell_commands) {
      await runShellCommand(
        `pwsh -c "Set-PowerCLIConfiguration -InvalidCertificateAction:Ignore -Confirm:\\\$false"`,
      );
      await runShellCommand(
        `pwsh -c "Set-PowerCLIConfiguration -Scope:User -Confirm:\\\$false -ParticipateInCEIP:\\\$false"`,
      );
      has_ran_shell_commands = true;
    }
    await session.shell.invoke(
      `Connect-VIServer -Server ${ip} -User ${username} -Password '${password}'`,
    );
    session.ready = true;
    return session.shell;
  } else {
    if (!pwsh_sessions[id].ready) await waitForReady(pwsh_sessions[id]);
    return pwsh_sessions[id].shell;
  }
}

export default get_pwsh_session;

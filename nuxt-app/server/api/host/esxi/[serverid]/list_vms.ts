import datastore from "~~/server/services/datastore";
import { exec } from "child_process";

export default defineEventHandler(async (event) => {
  let server = datastore.servers.find(
    (server) => server.id === event.context.params.serverid,
  );
  if (!server) {
    throw new Error("Server not found");
  }
  // Run ls shell command
  let ls = await runShellCommand("ls");
  return ls;
});

async function runShellCommand(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        reject(err);
      }
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
    //   console.log(`stderr: ${stderr}`);
      resolve(stdout);
    });
  });
}

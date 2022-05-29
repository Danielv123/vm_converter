import stop_vm from "~~/server/util/esxi/stop_vm";

export default defineEventHandler(async (event): Promise<string> => {
  console.log("Stopping ", event.context.params.vmid);
  return stop_vm(
    event.context.params.serverid,
    event.context.params.vmid.split("%20").join(" "),
  );
});

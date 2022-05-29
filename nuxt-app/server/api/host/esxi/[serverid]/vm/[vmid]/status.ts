import get_vm_info from "~~/server/util/esxi/get_vm_info";

export default defineEventHandler(async (event): Promise<string> => {
  return get_vm_info(
    event.context.params.serverid,
    event.context.params.vmid.split("%20").join(" "),
  );
});

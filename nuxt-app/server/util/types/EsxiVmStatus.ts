export default interface EsxiVmStatus {
  Name: string | "UbuntuWeb";
  Uid:
    | string
    | "/VIServer=root@192.168.10.52:443/VirtualMachine=VirtualMachine-17/";
  PowerState: number | 1;
  NumCpu: number | 16;
  CoresPerSocket: number | 8;
  MemoryMB: number | 10240;
  HardwareVersion: string | "vmx-15";
  PersistendId: null;
  GuestId: string | "ubuntu64Guest";
  UsedSpaceGB: number | 118.10808423161507;
  ProvisionedSpaceGB: number | 303.61980479955673;
  DatastoreIdList: string[] | ["Datastore-61e490b8-58dac0d8-f426-90b11c5a54ae"];
  CreateDate: string | "2015-08-27T00:12:38.180113Z";
  Id: string | "VirtualMachine-17";
}

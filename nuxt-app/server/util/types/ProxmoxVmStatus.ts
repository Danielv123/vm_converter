export default interface ProxmoxVmStatus {
    name: string;
    vmid: number;
    status: string;
    cpu: number; // CPU usage in percent
    cpus: number; // Number of cores
    disk: number; // Disk activity
    diskread: number; // Disk read activity
    diskwrite: number; // Disk write activity
    maxdisk: number; // Disk size in bytes
    maxmem: number; // Memory size in bytes
    mem: number;
    netin: number;
    netout: number;
    uptime: number;
}

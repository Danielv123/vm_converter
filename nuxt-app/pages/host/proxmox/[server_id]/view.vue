<template>
  <div>
    <!-- {{ server }} -->
    <a-typography-title :level="2">Server overview</a-typography-title>
    <a-skeleton :loading="pending">
      <a-descriptions bordered title="Server settings" size="small">
        <template #extra>
          <a-button type="primary" v-on:click="toggleEdit">Edit</a-button>
        </template>
        <a-descriptions-item label="Server ID"
          ><editable-text :value="server.id" :editing="editing_server"
        /></a-descriptions-item>
        <a-descriptions-item label="Name">{{
          server.name
        }}</a-descriptions-item>
        <a-descriptions-item label="IP address">{{
          server.ip
        }}</a-descriptions-item>
        <a-descriptions-item label="Type">{{
          server.type
        }}</a-descriptions-item>
        <a-descriptions-item label="Username">{{
          server.username
        }}</a-descriptions-item>
        <a-descriptions-item label="Password">{{
          server.password
        }}</a-descriptions-item>
      </a-descriptions>
    </a-skeleton>
    <a-typography-title :level="4">Virtual machines</a-typography-title>
    <div>
      <div>
        <a-table
          :dataSource="virtual_machines"
          :loading="vms_pending && !hideLoading"
          size="small"
          :rowKey="(record) => record.vmid"
        >
          <a-table-column title="Name" dataIndex="name" key="Name" />
          <a-table-column title="State" dataIndex="status" key="State">
            <template #default="{ value: PowerState, record }">
              <a-tag
                :color="
                  powerStates[
                    PowerState == undefined
                      ? 'unknown'
                      : record.lock || PowerState
                  ]?.color
                "
                >{{
                  powerStates[
                    PowerState == undefined
                      ? "unknown"
                      : record.lock || PowerState
                  ]?.text
                }}</a-tag
              >
            </template>
          </a-table-column>
          <a-table-column title="Memory" dataIndex="maxmem" key="Memory">
            <template #default="{ value: memory, record }">
              <span>
                {{ Math.floor((record.mem / 2 ** 30) * 10) / 10 }}/{{
                  memory / 2 ** 30
                }}
                GiB</span
              >
            </template>
          </a-table-column>
          <a-table-column title="Disk" dataIndex="maxdisk" key="Disk">
            <template #default="{ value: disk, record }">
              <span>{{ disk / 2 ** 30 }} GiB</span>
            </template>
          </a-table-column>
          <a-table-column title="Cores" dataIndex="cpus" key="NumCpu" />
          <a-table-column title="CPU" dataIndex="cpu" key="CPU">
            <template #default="{ value: cpu }">
              <span> {{ Math.floor(cpu * 100) }} %</span>
            </template>
          </a-table-column>
          <a-table-column title="Actions" dataIndex="vmid" key="Id">
            <template #default="{ record, value: vmid }">
              <span>{{ vmid }}</span>
              <start-stop-vm-button
                :type="server.type"
                :server_id="route.params.server_id"
                :name="record.vmid.toString()"
                :update_vm="refreshVms"
                :vm="record"
              />
            </template>
          </a-table-column>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $store } = useNuxtApp();
const route = useRoute();

const resp = await useFetch(`/api/host/proxmox/${route.params.server_id}/view`);
const server = resp.data;
const { pending, error, refresh } = resp;

const {
  pending: vms_pending,
  data: virtual_machines,
  refresh: refreshVms,
} = useFetch(`/api/host/proxmox/${route.params.server_id}/list_vms`, {
  lazy: true,
});

const hideLoading = ref(false);
setInterval(async () => {
  hideLoading.value = true;
  await refreshVms();
  hideLoading.value = false;
}, 10000);

const powerStates = {
  running: { text: "Running", color: "green" },
  stopped: { text: "Stopped", color: "red" },
  suspended: { text: "Suspended", color: "yellow" },
  unknown: { text: "Unknown", color: "gray" },
};

let editing_server = ref(false);
function toggleEdit() {
  editing_server.value = !editing_server.value;
  console.log("Editing: ", editing_server.value);
}
</script>

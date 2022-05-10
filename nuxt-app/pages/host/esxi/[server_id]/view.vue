<script setup>
const { $store } = useNuxtApp();
const route = useRoute();

const resp = await useFetch(`/api/host/esxi/${route.params.server_id}/view`);
const server = resp.data;
const { pending, error, refresh } = resp;

const { pending: vms_pending, data: vms, refresh: refreshVms } = useFetch(
  `/api/host/esxi/${route.params.server_id}/list_vms`,
  {
    lazy: true,
    transform: (data) => {
      let vms = JSON.parse(data);
      return vms.map((vm) => {
        return {
          ...vm,
          key: vm.Uid,
        };
      });
    },
  },
);

const hideLoading = ref(false);
setInterval(async () => {
  hideLoading.value = true;
  await refreshVms();
  hideLoading.value = false;
}, 10000);

const powerStates = {
  1: { text: "Running", color: "green" },
  0: { text: "Stopped", color: "red" },
  2: { text: "Suspended", color: "yellow" },
  unknown: { text: "Unknown", color: "gray" },
};

let editing_server = ref(false);
function toggleEdit() {
  editing_server.value = !editing_server.value;
  console.log("Editing: ", editing_server.value);
}
</script>
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
    <h2>vms</h2>
    <div>
      <div>
        <a-table :dataSource="vms" :loading="vms_pending && !hideLoading" size="small">
          <a-table-column title="Name" dataIndex="Name" key="Name" />
          <a-table-column title="State" dataIndex="PowerState" key="State">
            <template #default="{ value: PowerState }">
              <a-tag :color="powerStates[PowerState == undefined? 'unknown' : PowerState]?.color">{{
                powerStates[PowerState == undefined? 'unknown' : PowerState]?.text
              }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="Memory" dataIndex="MemoryMB" key="Memory">
            <template #default="{ value: memory }">
              <span> {{ memory / 1024 }} GiB</span>
            </template>
          </a-table-column>
          <a-table-column title="Cores" dataIndex="NumCpu" key="NumCpu" />
          <a-table-column title="Id" dataIndex="Id" key="Id">
            <template #default="{ record, value: vmId }">
              <span>{{ vmId }}</span>
              <start-stop-vm-button
                :type="server.type"
                :server_id="route.params.server_id"
                :name="record.Name"
                :update_vm="refreshVms"
                :vm="record"
              />
            </template>
          </a-table-column>
        </a-table>
      </div>
    </div>
    <h2>Datastores</h2>
    <esxi-datastores-table />
    <h2>Services</h2>
    <esxi-services-table />
  </div>
</template>

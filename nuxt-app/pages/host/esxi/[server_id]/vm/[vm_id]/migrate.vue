<template>
  <div>
    <a-typography-title :level="2">Migrate virtual machine</a-typography-title>
    <a-skeleton :loading="pending || vm_pending">
      <a-descriptions bordered title="Origin server settings" size="small">
        <a-descriptions-item label="Server ID">
          <editable-text :value="server.id" />
        </a-descriptions-item>
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
    <a-form
      :model="formState"
      name="migrate"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      autocomplete="on"
      @finish="onFinish"
    >
      <a-form-item label="Target server">
        <a-select
          :loading="target_servers_pending"
          @change="target_datastores_refresh($event)"
        >
          <a-select-option
            v-for="server in target_servers"
            :key="server.id"
            :value="server.id"
          >
            {{ server.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Target datastore">
        <a-select
          :loading="target_datastores_pending"
          @change="formState.target_datastore = $event"
        >
          <a-select-option
            v-for="datastore in target_datastores"
            :key="datastore.storage"
            :value="datastore.storage"
          >
            {{ datastore.storage }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit"> Start migration </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
const { $store } = useNuxtApp();
const route = useRoute();

const formState = {
  target_server_id: null,
  target_datastore: null,
};

const resp = await useFetch(`/api/host/esxi/${route.params.server_id}/view`);
const server = resp.data;
const { pending, error, refresh } = resp;

const {
  pending: vm_pending,
  data: vm_data,
  refresh: vm_refresh,
} = useFetch(`/api/host/esxi/${route.params.server_id}/list_vms`, {
  lazy: true,
  transform: (data) => {
    let vms = JSON.parse(data);
    return vms.find((vm) => vm.Uid === route.params.vm_id);
  },
});

const target_server_id = ref("");
const {
  pending: target_servers_pending,
  data: target_servers,
  refresh: target_servers_refresh,
} = useFetch(`/api/servers`, {
  lazy: true,
  transform: (servers) => {
    return servers.filter((server) => server.type !== "esxi");
  },
});

const target_datastores = ref([]);
const target_datastores_pending = ref(false);
async function target_datastores_refresh(id) {
  formState.target_server_id = id;
  target_datastores_pending.value = true;
  const resp = await $fetch(`/api/host/proxmox/${id}/datastores`);
  target_datastores.value = resp;
  target_datastores_pending.value = false;
}

async function onFinish() {
  console.log("Finish", formState);

  const resp = await $fetch(
    `/api/host/esxi/${route.params.server_id}/vm/${route.params.vm_id}/migrate/${formState.target_server_id}`,
    {
      method: "POST",
      body: formState,
    },
  );
  console.log(resp);

  // Navigate to tasks page
  navigateTo(`/task/${resp.id}/view`);
}
</script>

<template>
  <div class="test2">
    <a-button
      v-if="[-1].includes(vm?.PowerState)"
      type="primary"
      :disabled="true"
      :loading="vm_pending || loading"
      size="small"
      >Start</a-button
    >
    <a-button
      v-if="[0].includes(vm?.PowerState)"
      size="small"
      :loading="vm_pending || loading"
      v-on:click="start_vm(vm)"
      >Start</a-button
    >
    <a-button
      v-if="[1].includes(vm?.PowerState)"
      size="small"
      :loading="vm_pending || loading"
      v-on:click="stop_vm(vm)"
      danger
      >Stop</a-button
    >
    <a-button
      v-if="[2].includes(vm?.PowerState)"
      size="small"
      :loading="vm_pending || loading"
      v-on:click="start_vm(vm)"
      >Resume</a-button
    >
  </div>
</template>

<script setup>
const route = useRoute();
const props = defineProps({
  type: String,
  server_id: String,
  name: String,
  update_vm: Function,
});

const loading = ref(true);

// Get VM status
const {
  pending: vm_pending,
  data: vm,
  refresh,
} = useFetch(
  `/api/host/esxi/${route.params.server_id}/vm/${props.name}/status`,
  {
    lazy: true,
    transform: (data) => {
      console.log("Got VM:", JSON.parse(data));
      loading.value = false;
      return JSON.parse(data);
    },
  },
);

async function start_vm(vm) {
  console.log(`Starting`, vm.Name);
  loading.value = true;
  const { data: result } = await $fetch(
    `/api/host/esxi/${route.params.server_id}/vm/${props.name}/start`,
  );
  loading.value = false;
  // vm.PowerState = 1;
  refresh();
  props.update_vm?.(vm);
}

async function stop_vm(vm) {
  console.log(`Stopping`, vm.Name);
  loading.value = true;
  const { data: result } = await $fetch(
    `/api/host/esxi/${route.params.server_id}/vm/${props.name}/stop`,
  );
  loading.value = false;
  // vm.PowerState = 0;
  refresh();
  props.update_vm?.(vm);
}
</script>

<style>
.test2 {
  float: right;
}
</style>

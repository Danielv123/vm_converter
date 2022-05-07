<template>
  <div class="test2">
    <a-button
      v-if="[-1].includes(props.vm?.PowerState)"
      type="primary"
      :disabled="true"
      :loading="loading"
      size="small"
      >Start</a-button
    >
    <a-button
      v-if="[0].includes(props.vm?.PowerState)"
      size="small"
      :loading="loading"
      v-on:click="start_vm(props.vm)"
      >Start</a-button
    >
    <a-button
      v-if="[1].includes(props.vm?.PowerState)"
      size="small"
      :loading="loading"
      v-on:click="suspend_vm(props.vm)"
      danger
      >Suspend</a-button
    >
    <a-button
      v-if="[1].includes(props.vm?.PowerState)"
      size="small"
      :loading="loading"
      v-on:click="stop_vm(props.vm)"
      danger
      >Stop</a-button
    >
    <a-button
      v-if="[2].includes(props.vm?.PowerState)"
      size="small"
      :loading="loading"
      v-on:click="start_vm(props.vm)"
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
  vm: Object,
});

// Loading indicator for actions
const loading = ref(false);

async function start_vm(vm) {
  console.log(`Starting`, vm.Name);
  loading.value = true;
  const { data: result } = await $fetch(
    `/api/host/esxi/${route.params.server_id}/vm/${props.name}/start`,
  );
  loading.value = false;
  props.update_vm?.(vm);
}

async function stop_vm(vm) {
  console.log(`Stopping`, vm.Name);
  loading.value = true;
  const { data: result } = await $fetch(
    `/api/host/esxi/${route.params.server_id}/vm/${props.name}/stop`,
  );
  loading.value = false;
  props.update_vm?.(vm);
}

async function suspend_vm(vm) {
  console.log(`Suspend`, vm.Name);
  loading.value = true;
  const { data: result } = await $fetch(
    `/api/host/esxi/${route.params.server_id}/vm/${props.name}/suspend`,
  );
  loading.value = false;
  props.update_vm?.(vm);
}
</script>

<style>
.test2 {
  float: right;
}
</style>

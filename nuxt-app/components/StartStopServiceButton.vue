<template>
  <div class="startstopservicebuttoncontainer">
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
      class="warning"
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
  server_id: String,
  service_id: String,
  update_services: Function,
  service: Object,
});

// Loading indicator for actions
const loading = ref(false);

async function start_service(vm) {
  console.log(`Starting`, props.service_id);
  loading.value = true;
  const { data: result } = await $fetch(
    `/api/host/esxi/${route.params.server_id}/service/${props.service_id}/start`,
  );
  loading.value = false;
  props.update_vm?.(vm);
}

async function stop_service(vm) {
  console.log(`Stopping`, props.service_id);
  loading.value = true;
  const { data: result } = await $fetch(
    `/api/host/esxi/${route.params.server_id}/service/${props.service_id}/stop`,
  );
  loading.value = false;
  props.update_vm?.(vm);
}
</script>

<style>
.startstopservicebuttoncontainer {
  float: right;
}
.warning {
  background: transparent;
  border-color: #a79a2d;
  color: #a79a2d;
}
</style>

<template>
  <div class="test2">
    <a-button
      v-if="[-1].includes(vm.PowerState)"
      type="primary"
      :disabled="true"
      :loading="vm_pending"
      size="small"
      >Start</a-button
    >
    <a-button v-if="[0].includes(vm.PowerState)" size="small">Start</a-button>
    <a-button v-if="[1].includes(vm.PowerState)" size="small" danger
      >Stop</a-button
    >
    <a-button v-if="[2].includes(vm.PowerState)" size="small">Resume</a-button>
  </div>
</template>

<script setup>
const route = useRoute();
const props = defineProps({
  type: String,
  server_id: String,
  name: String,
});

// Get VM status
const { pending: vm_pending, data: vm } = useFetch(
  `/api/host/esxi/${route.params.server_id}/vm/${props.name}/status`,
  {
    lazy: true,
    transform: (data) => {
      console.log("Got VM:", JSON.parse(data));
      return JSON.parse(data);
    },
  },
);
</script>

<style>
.test2 {
  float: right;
}
</style>

<template>
  <a-typography-title :level="2">Service overview</a-typography-title>
  <a-skeleton :loading="pending">
    <a-descriptions bordered title="Service settings" size="small">
      <a-descriptions-item label="Name">{{data.Label}}</a-descriptions-item>
    </a-descriptions>
  </a-skeleton>
</template>

<script setup>
const route = useRoute();

const { data, pending, error, refresh } = useFetch(
  `/api/host/esxi/${route.params.server_id}/services/${route.params.serviceid}`,
  {
    lazy: true,
    transform: (data) => {
      let service = JSON.parse(data);
      console.log("Service: ", service);
      return service;
    },
  },
);
</script>

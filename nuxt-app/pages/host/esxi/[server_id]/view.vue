<script setup>
const route = useRoute()

const resp = await useFetch(`/api/host/esxi/${route.params.server_id}/view`);
const server = resp.data;
const { pending, error, refresh } = resp;

const resp_vms = await useFetch(`/api/host/esxi/${route.params.server_id}/list_vms`);
const vms = resp_vms.data;
</script>

<template>
  <div>
    <!-- {{ server }} -->
    <h2>esxi server overview</h2>
    {{$route.params.server_id}}
    {{server}}
    <h2>vms</h2>
    {{vms}}
  </div>
</template>

<script setup>
const route = useRoute()

const resp = await useFetch(`/api/host/proxmox/${route.params.server_id}/view`);
const server = resp.data;
const { pending, error, refresh } = resp;
</script>

<template>
  <div>
    <!-- {{ server }} -->
    <h2>proxmox server overview</h2>
    {{$route.params.server_id}}
    {{server}}
  </div>
</template>

<script setup>
const route = useRoute()

const resp = await useFetch(`/api/host/esxi/${route.params.server_id}`);
const server = resp.data;
const { pending, error, refresh } = resp;
</script>

<template>
  <div>
    <!-- {{ server }} -->
    <h2>Delete esxi server configuration?</h2>
    {{$route.params.server_id}}
    {{server}}
  </div>
</template>

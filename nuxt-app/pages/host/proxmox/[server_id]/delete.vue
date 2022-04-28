<script setup>
const route = useRoute();
const resp = await useFetch(`/api/host/proxmox/${route.params.server_id}/view`);
const server = resp.data;
const { pending, error, refresh } = resp;
</script>

<script>
const deleteServer = async (cb) => {
  const route = useRoute();
  await useFetch(`/api/host/proxmox/${route.params.server_id}/delete`);
  cb();
};
</script>

<template>
  <div>
    <!-- {{ server }} -->
    <h2>Delete proxmox server configuration?</h2>
    {{ $route.params.server_id }}
    {{ server }}
    <button
      @click="deleteServer(() => this.$router.back())"
    >
      Delete
    </button>
  </div>
</template>

<template>
  <div>
    {{ task }}
    <a-typography-title :level="2">Task overview</a-typography-title>
    <a-skeleton :loading="pending">
      <a-descriptions bordered title="Task properties" size="small">
        <a-descriptions-item label="Task ID">
          <editable-text :value="task.id" :editing="editing_task" />
        </a-descriptions-item>
        <a-descriptions-item label="Name">{{
          task.name
        }}</a-descriptions-item>
        <a-descriptions-item label="IP address">{{
          task.ip
        }}</a-descriptions-item>
        <a-descriptions-item label="Type">{{
          task.type
        }}</a-descriptions-item>
        <a-descriptions-item label="Username">{{
          task.username
        }}</a-descriptions-item>
        <a-descriptions-item label="Password">{{
          task.password
        }}</a-descriptions-item>
      </a-descriptions>
    </a-skeleton>
  </div>
</template>

<script setup>
const { $store } = useNuxtApp();
const route = useRoute();

const resp = await useFetch(`/api/task/${route.params.task_id}/view`);
const task = resp.data;
const { pending, error, refresh } = resp;

const hideLoading = ref(false);
setInterval(async () => {
  hideLoading.value = true;
  await refreshVms();
  hideLoading.value = false;
}, 10000);

const powerStates = {
  running: { text: "Running", color: "green" },
  stopped: { text: "Stopped", color: "red" },
  suspended: { text: "Suspended", color: "yellow" },
  unknown: { text: "Unknown", color: "gray" },
};
</script>

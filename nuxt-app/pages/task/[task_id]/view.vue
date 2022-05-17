<template>
  <div>
    {{ task }}
    <a-typography-title :level="2">Task overview</a-typography-title>
    <a-skeleton :loading="pending && !hideLoading">
      <a-descriptions bordered title="Task properties" size="small">
        <template #extra>
          <a-button type="primary" danger v-on:click="deleteTask"
            >Delete</a-button
          >
        </template>
        <a-descriptions-item label="Task ID">
          <editable-text :value="task.id" />
        </a-descriptions-item>
        <a-descriptions-item label="Origin ID">{{
          task.serverid
        }}</a-descriptions-item>
        <a-descriptions-item label="Target ID">{{
          task.targetid
        }}</a-descriptions-item>
        <a-descriptions-item label="Type">{{ task.type }}</a-descriptions-item>
        <a-descriptions-item label="Started">{{
          task.started
        }}</a-descriptions-item>
        <a-descriptions-item label="Completed">{{
          task.completed
        }}</a-descriptions-item>
      </a-descriptions>
    </a-skeleton>
    <div>
      <a-timeline>
        <a-timeline-item v-if="task" v-for="step in task.steps" :key="step.id">
          <step-visualizer :step="step" />
        </a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>

<script setup>
const { $store } = useNuxtApp();
const route = useRoute();

const resp = useFetch(`/api/task/${route.params.task_id}/view`);
const task = resp.data;
const { pending, error, refresh } = resp;

const hideLoading = ref(false);
const interval = setInterval(async () => {
  hideLoading.value = true;
  await refresh();
  hideLoading.value = false;
}, 10000);
onUnmounted(() => {
  clearInterval(interval);
});

const powerStates = {
  running: { text: "Running", color: "green" },
  stopped: { text: "Stopped", color: "red" },
  suspended: { text: "Suspended", color: "yellow" },
  unknown: { text: "Unknown", color: "gray" },
};

async function deleteTask() {
  // Send delete request
  let status = await $fetch(`/api/task/${task.value.id}/delete`, {
    method: "DELETE",
  });
  if (status == true || status == "true") {
    // Go back to task list
    navigateTo(`/task/list`);
  } else {
    // Show error
    console.log("Error deleting task", task.value, status);
  }
}
</script>

<template>
  <div>
    <h1>Task list</h1>
    <div id="task_list">
      <a-table
        :dataSource="tasks"
        :loading="pending && !hideLoading"
        :customRow="customRow"
        size="small"
      >
        <a-table-column title="ID" dataIndex="id" key="Name" />
        <a-table-column title="Type" dataIndex="type" key="Type">
          <template #default="{ value: type }">
            <a-tag :color="types[type]?.color">
              {{ types[type]?.text || type }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column title="Timestamp" dataIndex="started" key="Started">
          <template #default="{ value: started }">
            {{ started }}
          </template>
        </a-table-column>
        <a-table-column title="Progress" dataIndex="steps" key="Steps">
          <template #default="{ value: steps }">
            0/{{ steps.length }}
          </template>
        </a-table-column>
      </a-table>
    </div>
  </div>
</template>

<script setup>
const resp = useFetch("/api/task/list");
const tasks = resp.data;
const { pending, error, refresh } = resp;

const types = {
  migration: {
    color: "green",
    text: "Migration",
  },
};

const customRow = (record) => {
  return {
    onClick: () => {
      console.log("Clicked", record);
      navigateTo(`/task/${record.id}/view`);
    },
  };
};

const hideLoading = ref(false);
const interval = setInterval(async () => {
  hideLoading.value = true;
  await refresh();
  hideLoading.value = false;
}, 1000);
onUnmounted(() => {
  clearInterval(interval);
});
refresh();
</script>

<template>
  <a-table :dataSource="data" :loading="pending" size="small">
    <a-table-column title="Name" dataIndex="storage" key="Name" />
    <a-table-column title="Type" dataIndex="type" key="Type">
      <template #default="{ value: type }">
        <a-tag :color="states[type]?.color || 'red'">{{
          states[type]?.text || type
        }}</a-tag>
      </template>
    </a-table-column>
    <a-table-column title="Content" dataIndex="content" key="content">
      <template #default="{ value: content }">
        <a-tag
          v-for="(item, index) in content.split(',')"
          :color="states[item]?.color || 'red'"
          >{{ states[item]?.text || item }}</a-tag>
      </template>
    </a-table-column>
  </a-table>
</template>

<script setup>
const route = useRoute();

const states = {
  dir: {
    color: "green",
    text: "dir",
  },
  lvmthin: {
    color: "gray",
    text: "lvmthin",
  },
};
// Fetch datastores
const { data, pending, error, refresh } = useFetch(
  `/api/host/proxmox/${route.params.server_id}/datastores`,
  {
    lazy: true,
  },
);
</script>

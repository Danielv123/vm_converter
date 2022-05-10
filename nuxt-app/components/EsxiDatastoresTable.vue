<template>
  <a-table :dataSource="data" :loading="pending" size="small">
    <a-table-column title="Name" dataIndex="Name" key="Name" />
    <a-table-column title="State" dataIndex="State" key="State">
        <template #default="{ value: state }">
            <a-tag :color="states[state]?.color || 'red'">{{ states[state]?.text || "unknown" }}</a-tag>
        </template>
    </a-table-column>
    <a-table-column title="Capacity" dataIndex="CapacityGB" key="Capacity">
      <template #default="{ value: capacity, record }">
        <span>
          {{ Math.floor(record.FreeSpaceGB) }} / {{ Math.floor(capacity) }} GiB
        </span>
      </template>
    </a-table-column>
  </a-table>
</template>

<script setup>
const route = useRoute();

const states = {
    0: {
        color: 'green',
        text: 'Available',
    },
};
// Fetch datastores
const { data, pending, error, refresh } = useFetch(
  `/api/host/esxi/${route.params.server_id}/datastores`,
  {
    lazy: true,
    transform: (data) => {
      let datastores = JSON.parse(data);
      console.log("Datastores: ", datastores);
      return datastores;
    },
  },
);
</script>

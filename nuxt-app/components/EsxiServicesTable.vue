<template>
  <a-table :dataSource="data" :loading="pending" size="small">
    <a-table-column title="Name" dataIndex="Label" key="Label" />
    <a-table-column title="Restart policy" dataIndex="Policy" key="Policy" />
    <a-table-column title="Status" dataIndex="Running" key="Status">
      <template #default="{ value: state }">
        <a-tag :color="states[state]?.color || 'gray'">{{
          states[state]?.text || "unknown"
        }}</a-tag>
      </template>
    </a-table-column>
    <a-table-column title="Actions" dataIndex="undefined" key="buttons">
      <template #default="{ record }">
        <a-dropdown-button>
          <start-stop-service-button
            :server_id="route.params.server_id"
            :service_id="record.Key"
            :service="record"
          />
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item>
                <form-outlined />
                Expand
              </a-menu-item>
              <a-menu-item>
                <reload-outlined />
                Restart
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown-button>
      </template>
    </a-table-column>
  </a-table>
</template>

<script setup>
import { FormOutlined, ReloadOutlined } from "@ant-design/icons-vue";
const route = useRoute();

const states = {
  [true]: {
    color: "green",
    text: "Running",
  },
  [false]: {
    color: "red",
    text: "Stopped",
  },
};

// Fetch datastores
const { data, pending, error, refresh } = useFetch(
  `/api/host/esxi/${route.params.server_id}/services`,
  {
    lazy: true,
    transform: (data) => {
      let datastores = JSON.parse(data);
      console.log("Services: ", datastores);
      return datastores;
    },
  },
);

function handleMenuClick(event) {
  console.log("Menu click: ", event);
}
</script>

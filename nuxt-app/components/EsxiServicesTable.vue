<template>
  <a-table :dataSource="data" :loading="pending || loading" size="small">
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
          <template #overlay>
            <a-menu @click="(e) => handleMenuClick(e, record)">
              <a-menu-item key="start">
                <caret-right-outlined />
                Start
              </a-menu-item>
              <a-menu-item key="stop">
                <stop-outlined />
                Stop
              </a-menu-item>
              <a-menu-item key="restart">
                <reload-outlined />
                Restart
              </a-menu-item>
              <a-menu-item key="expand">
                <form-outlined />
                Expand
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown-button>
      </template>
    </a-table-column>
  </a-table>
</template>

<script setup>
import {
  FormOutlined,
  ReloadOutlined,
  StopOutlined,
  CaretRightOutlined,
} from "@ant-design/icons-vue";
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

const loading = ref(false);

// Fetch datastores
const { data, pending, error, refresh } = useFetch(
  `/api/host/esxi/${route.params.server_id}/service`,
  {
    lazy: true,
    transform: (data) => {
      let datastores = JSON.parse(data);
      console.log("Services: ", datastores);
      return datastores;
    },
  },
);

function handleMenuClick(event, record) {
  // console.log("Menu click: ", event, record);
  switch (event.key) {
    case "start":
      console.log("Start: ", record);
      start_service(record);
      break;
    case "stop":
      console.log("Stop: ", record);
      stop_service(record);
      break;
    case "expand":
      console.log("Expand: ", record);
      expand_service(record);
      break;
    case "restart":
      console.log("Restart: ", record);
      restart_service(record);
      break;
  }
}

async function start_service(service) {
  console.log(`Starting`, service.Key);
  loading.value = true;
  const { data: result } = await $fetch(
    `/api/host/esxi/${route.params.server_id}/service/${service.Key}/start`,
  );
  loading.value = false;
  refresh();
}

async function stop_service(service) {
  console.log(`Stopping`, service.Key);
  loading.value = true;
  const { data: result } = await $fetch(
    `/api/host/esxi/${route.params.server_id}/service/${service.Key}/stop`,
  );
  loading.value = false;
  refresh();
}
</script>

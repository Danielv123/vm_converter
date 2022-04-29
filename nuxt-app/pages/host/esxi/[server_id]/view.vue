<script setup>
const route = useRoute();

const resp = await useFetch(`/api/host/esxi/${route.params.server_id}/view`);
const server = resp.data;
const { pending, error, refresh } = resp;

const resp_vms = await useFetch(
  `/api/host/esxi/${route.params.server_id}/list_vms`,
);
const vms = resp_vms.data;
const powerStates = {
  1: "Running",
  0: "Stopped",
  2: "Suspended",
  unknown: "Unknown",
};
</script>

<template>
  <div>
    <!-- {{ server }} -->
    <h2>esxi server overview</h2>
    {{ $route.params.server_id }}
    {{ server }}
    <h2>vms</h2>
    <div>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>state</th>
            <th>memory</th>
            <th>cores</th>
            <th>id</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vm in JSON.parse(vms)">
            <td>{{ vm.Name }}</td>
            <td>{{ powerStates[vm.PowerState] }}</td>
            <td>{{ vm.MemoryMB }}</td>
            <td>{{ vm.NumCpu }}</td>
            <td>{{ vm.Id }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

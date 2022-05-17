<script setup>
const resp = useFetch("/api/servers");
const servers = resp.data;
const { pending, error, refresh } = resp;
refresh();
</script>

<template>
  <div>
    <div id="buttons">
      <NuxtLink to="/host/add_server">
        <button class="btn btn-primary">Add server</button>
      </NuxtLink>
    </div>
    <div id="servers_list">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Server name</th>
            <th scope="col">Server ip</th>
            <th scope="col">Server type</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody id="servers_list_body">
          <tr v-for="(server, index) in servers">
            <td>{{ server.name }}</td>
            <td>{{ server.ip }}</td>
            <td>{{ server.type }}</td>
            <td>
              <NuxtLink v-bind:to="`/host/${server.type}/${server.id}/view`">
                <button class="btn btn-primary">View</button></NuxtLink
              >
              <NuxtLink v-bind:to="`/host/${server.type}/${server.id}/delete`">
                <button type="button" class="btn btn-danger">Delete</button>
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

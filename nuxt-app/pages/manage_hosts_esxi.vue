<script setup>
const resp = await useFetch("/api/servers");
const servers = resp.data;
const { pending, error, refresh } = resp;
refresh();
</script>

<template>
  <div>
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
              <NuxtLink v-bind:to="`/host/esxi/${server.id}/view`">
                <button class="btn btn-primary">View</button></NuxtLink
              >
              <NuxtLink v-bind:to="`/host/esxi/${server.id}/delete`">
                <button type="button" class="btn btn-danger">Delete</button>
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="add_server_form">
      <div class="form-group">
        <label for="server_name">Server name</label>
        <input
          type="text"
          class="form-control"
          id="server_name"
          placeholder="Server name"
        />
      </div>
      <div class="form-group">
        <label for="server_ip">Server ip</label>
        <input
          type="text"
          class="form-control"
          id="server_ip"
          placeholder="Server ip"
        />
      </div>
      <div class="form-group">
        <label for="server_user">Server user</label>
        <input
          type="text"
          class="form-control"
          id="server_user"
          placeholder="Server user"
        />
      </div>
      <div class="form-group">
        <label for="server_password">Server password</label>
        <input
          type="password"
          class="form-control"
          id="server_password"
          placeholder="Server password"
        />
      </div>
      <div class="form-group">
        <label for="server_type">Server type</label>
        <select class="form-control" id="server_type">
          <option>esxi</option>
          <option>proxmox</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary" id="add_server_button">
        Add server
      </button>
    </div>
  </div>
</template>

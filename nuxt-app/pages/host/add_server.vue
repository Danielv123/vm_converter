<template>
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
</template>

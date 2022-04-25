<template>
  <div>
    <i>A tool for converting between vmware and kvm formats using qemu-img</i>
    <h2>Why?</h2>
    <p>Moving supervisors is possible, but anoying. What you have to do is</p>
    <ol>
      <li>Move the files</li>
      <li>Use qemu-img to convert between .vmdk and .qcow2</li>
      <li>Write a new VM config file for the hypervisor you will be using</li>
      <li>Register the VM in the hypervisor interface</li>
    </ol>
    <p>
      This tool aims to simplify this process using a web interface and
      automation.
    </p>
    <h2>How</h2>
    <p>The setup will consist of a few different parts:</p>
    <ol>
      <li>Esxi host</li>
      <li>Proxmox host</li>
      <li>Frontend in Vue</li>
      <li>Backend</li>
    </ol>
    <p>The backend needs the following tools</p>
    <ol>
      <li>Nodejs with web API</li>
      <li>ssh for file transfer</li>
      <li>Powershell with PowerCLI for interacting with esxi</li>
      <li>qemu-img for converting disk formats</li>
    </ol>
    <p>
      The program is distributed as a docker container to keep setup complexity
      down.
    </p>
    <p>To migrate a vm from esxi to proxmox:</p>
    <ol>
      <li>PowerCLI gets the VM listing, datastore and directory</li>
      <li>Stop the VM</li>
      <li>Move the VM to the server for conversion</li>
      <li>Convert .vmdk to .qcow2 using qemu-img</li>
      <li>Convert vmware .vmx to kvm .conf using custom tool</li>
      <li>Move .qcow2 and .conf file to proxmox node</li>
      <li>Register the VM using proxmox API</li>
      <li>Start the VM</li>
    </ol>
    <h2>Config files</h2>
    <p>On kvm:</p>
    <ul>
      <li>/etc/pve/local/qemu-server/100.conf</li>
    </ul>
    <p>On esxi:</p>
    <ul>
      <li>/vmfs/volumes/datastore1/vm_name/vm_name.vmx</li>
    </ul>
  </div>
</template>

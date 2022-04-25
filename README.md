# VM converter

A tool for converting between vmware and kvm formats using qemu-img

## Why

Moving supervisors is possible, but anoying. What you have to do is

1. Move the files
2. Use qemu-img to convert between .vmdk and .qcow2
3. Write a new VM config file for the hypervisor you will be using
4. Register the VM in the hypervisor interface

This tool aims to simplify this process using a web interface and automation.

## How

The setup will consist of a few different parts:

1. Esxi host
2. Proxmox host
3. Frontend in Vue
4. Backend

The backend needs the following tools

1. Nodejs with web API
2. ssh for file transfer
3. Powershell with PowerCLI for interacting with esxi
4. qemu-img for converting disk formats

it is distributed as a docker container to keep setup complexity down.

To migrate a vm from esxi to proxmox:

1. PowerCLI gets the VM listing, datastore and directory
2. Stop the VM
3. Move the VM to the server for conversion
4. Convert .vmdk to .qcow2 using qemu-img
5. Convert vmware .vmx to kvm .conf using custom tool
6. Move .qcow2 and .conf file to proxmox node
7. Register the VM using proxmox API
8. Start the VM

## Config files

On kvm:

/etc/pve/local/qemu-server/100.conf


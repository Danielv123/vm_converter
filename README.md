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
5. SSH keys

The SSH keys are used for SCP transfers. They are generated with ssh-keygen:

    ssh-keygen -t rsa -b 8192 -f ~/.ssh/id_rsa -N ""

The key is then added to the proxmox nodes using the following command:

    sshpass -p Monster123 ssh-copy-id -o StrictHostKeychecking=no -i ~/.ssh/id_rsa.pub root@192.168.10.41

And for esxi nodes we download the existing key from the server:

    sshpass -p Monster123! scp -o StrictHostKeychecking=no ~/.ssh/id_rsa.pub root@192.168.10.52:/etc/ssh/keys-root/authorized_keys

The backend needs the following tools

1. Nodejs with web API
2. ssh for file transfer
3. Powershell with PowerCLI for interacting with esxi
4. qemu-img for converting disk formats

it is distributed as a docker container to keep setup complexity down.

To migrate a vm from esxi to proxmox:

1. PowerCLI gets the VM listing, datastore and directory
2. Stop the VM
3. Move the VM to the server for conversion using SCP
4. Convert .vmdk to .qcow2 using qemu-img
5. Convert vmware .vmx to kvm .conf using custom tool
6. Register the VM using proxmox API
7. Start the VM

Scp command:

    scp -rB3 root@192.168.10.52:/vmfs/volumes/ssd3/tailscale-home root@192.168.10.41:/root/tailscale-home

Adding the `C` flag for compression may reduce transfer time over WAN, but it is left out since it is not able to achieve 1 gbps.

Image conversion command:

    qemu-img convert -f vmdk windows_xp_64/windows_xp_64.vmdk -O qcow2 /var/lib/vz/images/102/windows_xp_64.qcow2

## Config files

On kvm:

/etc/pve/local/qemu-server/100.conf


chmod +x VMware-ovftool-4.4.3-18663434-lin.x86_64.bundle
./VMware-ovftool-4.4.3-18663434-lin.x86_64.bundle
# Interactive installer
apt update
apt install sshfs eatmydata -y
sshfs root@192.168.10.52:/vmfs/volumes /mnt/tmp
# Enter esxi ssh pass
cd /mnt/tmp/ssd1/UbuntuWeb
eatmydata ovftool --parallelThreads=4 UbuntuWeb.vmx /tmp/UbuntuWeb

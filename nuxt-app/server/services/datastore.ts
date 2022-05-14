import fs from "fs/promises";

const datastore = {
  servers: [],
  tasks: [],
};
const defaultDatastore = {
  servers: [
    {
      id: "1",
      name: "Esxi 1",
      ip: "192.168.10.52",
      type: "esxi",
      username: "root",
      password: "Monster123!",
    },
    {
      id: "2",
      name: "Proxmox 1",
      ip: "192.168.10.41",
      type: "proxmox",
      username: "root",
      password: "Monster123",
    },
    {
      id: "3",
      name: "Server 3",
      ip: "192.168.10.53",
      type: "proxmox",
    },
    {
      id: "4",
      name: "Server 4",
      ip: " ",
      type: "proxmox",
    },
    {
      id: "5",
      name: "Server 5",
      ip: " ",
      type: "proxmox",
    },
    {
      id: "6",
      name: "Server 6",
      ip: " ",
      type: "proxmox",
    },
    {
      id: "7",
      name: "Server 7",
      ip: " ",
      type: "proxmox",
    },
  ],
  tasks: [],
};

async function loadDatastore() {
  await fs
    .readFile("./datastore.json", "utf8")
    .then((data) => {
        const parsed = JSON.parse(data);
        for (const key in parsed) {
            if (parsed.hasOwnProperty(key)) {
                datastore[key] = parsed[key];
            }
        }
    })
    .catch((err) => {
      for (let key in defaultDatastore) {
        datastore[key] = defaultDatastore[key];
      }
    });
}

loadDatastore();

async function saveDatastore() {
    await fs.writeFile("./datastore.json", JSON.stringify(datastore, null, 2));
}

export default datastore;
export { saveDatastore };

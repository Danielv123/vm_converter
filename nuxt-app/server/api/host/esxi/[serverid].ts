export default defineEventHandler((event) => {
  return [
    {
      id: "1",
      name: "Server 1",
      ip: "192.168.10.52",
    },
    {
      id: "2",
      name: "Server 2",
      ip: "192.168.10.53",
    },
  ].find((server) => server.id === event.context.params.serverid) || {
      id: "3",
      name: "Server 3",
      ip: "192.168.10.53",
    };
});

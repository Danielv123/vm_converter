import pve from "@corsinvest/cv4pve-api-javascript";

async function sleep(s) {
  return new Promise((r) => setTimeout(r, s * 1000));
}
async function waitForReady(session) {
  await sleep(1);
  if (!session.ready) return await waitForReady(session);
  return session;
}

// Store sessions for reuse
const pve_sessions = [];

async function get_pve_session({ id, ip, username, password }) {
  if (!pve_sessions[id]) {
    let session = {
      ready: false,
      client: new pve.PveClient(ip, 8006),
    };
    pve_sessions[id] = session;

    session.ready = await session.client.login(username, password, "pam");
    return session.client;
  } else {
    pve_sessions[id].ready = await pve_sessions[id].client.login(username, password, "pam");
    if (!pve_sessions[id].ready) await waitForReady(pve_sessions[id]);
    return pve_sessions[id].client;
  }
}

export default get_pve_session;

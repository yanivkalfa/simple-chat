export function createMe(client, res) {
  return {
    userName: res && res.userName|| null,
    clientUUID: client.__uuid
  };
}

export function findUserName(res) {
  return res && res.userName || res && res.user && res.user.userName || null;
}


export function isRoute(route) {
  return route && route.path;
}
export function createMe(client) {
  return {
    userName: client.__user && client.__user.userName || null,
    clientUUID: client.__uuid
  };
}


export function isRoute(route) {
  return route && route.path;
}
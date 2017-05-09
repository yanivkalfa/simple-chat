import * as date from 'date';

export function createToClient({ headers, path, payload }) {
  return {
    headers: {
      timestamp: date.toUTC(),
      ...headers
    },
    path,
    payload
  };
}

export function createToPublish(path, payload, headers) {
  return JSON.stringify({
    headers: {
      timestamp: date.toUTC(),
      ...headers
    },
    path,
    payload
  });
}
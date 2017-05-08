import * as date from 'date';

export function createMessage({ payload, type, headers }) {
  return {
    headers: {
      timestamp: date.toUTC(),
      ...headers
    },
    payload,
    type
  };
}
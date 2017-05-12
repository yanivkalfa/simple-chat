import * as date from './date';
import uuid from 'uuid';

export function createMessage({ headers, path, payload }) {
  return {
    headers: {
      timestamp: date.toUTC(),
      ...headers
    },
    path,
    payload
  };
}

export function createToPublish({ me, payload }) {
  return JSON.stringify({
    me,
    payload,
    timestamp: date.toUTC()
  });
}
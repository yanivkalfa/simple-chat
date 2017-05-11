let events = [];

export function on(event, cbs) {
  if (!event || typeof event !== 'string' || !cbs || (!cbs.length && typeof cbs !== 'function')) {
    throw new Error('Event or Callback is missing or of wrong type');
  }

  cbs = Array.isArray(cbs) ? cbs : [ cbs ];

  events[event] = events[event] || [];
  events[event] = events[event].concat(cbs);
}

export function off(event) {
  if( events[event] ) {
    events[event] = null;
    delete events[event];
  }
}

export function get() {
  return events;
}
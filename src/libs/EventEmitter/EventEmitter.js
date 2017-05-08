export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, cbs) {
    if (!event || typeof event !== 'string' || !cbs || !cbs.length) {
      throw new Error('Event or Callback is missing or of wrong type');
    }

    cbs = Array.isArray(cbs) ? cbs : [ cbs ];

    this.events[event] = this.events[event] || [];
    this.events[event] = this.events[event].concat(cbs);
  }

  off(event) {
    if( this.events[event] ) {
      this.events[event] = null;
      delete this.events[event];
    }
  }
}
export default class OutboundRouter {
  constructor() {
    this.routs = [];
  }

  get() {
    return this.routs;
  }
  route(route, msg) {

  }

  use({ path, cbs }) {


    let found = this.routs.find((route) => {
      return route.path === path;
    });

    if( found ) {
      found.cbs = Array.isArray(cbs) ? cbs : [ cbs ];
    } else {
      this.routs.push({ path, cbs });
    }
  }

  remove(path){

    if( typeof path !== 'string' ) {
      return false;
    }

    let indexFound = this.routs.findIndex((route) => {
      return route.path === path;
    });

    if ( indexFound >= 0 ) {
      return this.routs.splice(indexFound, 1);
    }

    return false;
  }
}
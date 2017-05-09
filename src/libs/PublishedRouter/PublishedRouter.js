export default class PublishedRouter {
  constructor() {
    this.routs = [];
  }

  get() {
    return this.routs;
  }

  use({ path, hasAccess, cbs }) {


    let found = this.routs.find((route) => {
      return route.path === path;
    });

    if( found ) {
      found.cbs = Array.isArray(cbs) ? cbs : [ cbs ];
      found.hasAccess = typeof hasAccess === 'undefined' ? found.hasAccess : hasAccess;
    } else {
      this.routs.push({ path, hasAccess, cbs });
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
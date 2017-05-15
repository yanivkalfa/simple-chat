import P from 'bluebird';
import { emptyPromise } from '../utils/function';
import { findUserName } from '../utils/general';
import Router from './Router';

export default class InboundRouter extends Router {
  constructor(list) {
    super(list);
  }

  use({ action, hasAccess, success, failure, controller }) {
    if ( typeof action !== 'string') {
      throw new Error('Supplied action parameter is not a string');
    }

    let found = this.find(action);
    if( found ) {
      found.hasAccess = typeof hasAccess === 'function' ? hasAccess : found.hasAccess ; // set or override "hasAccess".
      found.success = typeof success === 'function' ? success : found.success  ; // set or override "success".
      found.failure = typeof failure === 'function' ? failure : found.failure ; // set or override "failure".
      found.controller = typeof controller === 'function' ? controller : found.controller; // set or override "controller".
    } else {
      this.list.push({ action, hasAccess, success, failure, controller });
    }
  }

  route({ path, client, msg }) {
    let l = this.list.length, i = 0;
    let res = {};

    for( i; i < l; i++ ) {
      let route = this.list[i];
      if (route.action === path.action) {
        return P.try( function routeHasAccess() {
          let hasAccess = route.hasAccess || emptyPromise;
          return hasAccess({ path, client, msg });
        }).then( function routeSuccess( hasAccessResults ) {
          res.hasAccessResults = hasAccessResults;
          res.userName = findUserName(hasAccessResults);
          let success = route.success || emptyPromise;
          return success({ path, client, msg, res });
        }).then( function routeController( successResults ) {
          res.successResults = successResults;
          let controller = route.controller || emptyPromise;
          return controller({ path, client, msg, res, success: true });
        }).catch( function routeCatch(error) {
          res.error = error;
          let failure = route.failure || emptyPromise;
          failure({ path, client, msg, res });
          let controller = route.controller || emptyPromise;
          controller({ path, client, msg, res, success: false });
        });
      }
    }

    throw new Error(`Could not found route for: ${path.action}`);
  }
}
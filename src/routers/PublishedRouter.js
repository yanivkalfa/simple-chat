import P from 'bluebird';
import { emptyPromise } from '../../utils/function';
import Router from '../Router/Router';


export default class InboundRouter extends Router {
  constructor(list = []) {
    super(list);
  }

  use({ action, sendTo, controller }) {
    if ( typeof action !== 'string') {
      throw new Error('Supplied action parameter is not a string');
    }

    let found = this.find(action);
    if( found ) {
      found.sendTo = typeof sendTo === 'function' ? sendTo : found.sendTo; // set or override "sendTo".
      found.controller = typeof controller === 'function' ? controller : found.controller; // set or override "controller".
    } else {
      this.list.push({ action, sendTo, controller });
    }
  }

  route({ action, me, msg }) {
    let l = this.list.length, i = 0;
    let res = {};

    for( i; i < l; i++ ) {
      let route = this.list[i];
      if (route.action === action) {
        return P.try( function sendTo() {
          let sendTo = route.sendTo || emptyPromise;
          return sendTo({ action, me, msg });
        }).then( function routeController( sendToResults ) {
          res.sendToResults = sendToResults;
          let controller = route.controller || emptyPromise;
          return controller({ action, me, msg, res, success: true });
        }).catch( function routeCatch(error) => {
          res.error = error;
          let controller = route.controller || emptyPromise;
          return controller({ action, me, msg, res, success: false });
        });
      }
    }

    throw new Error(`Could not found route for: ${action}`);
  }
}
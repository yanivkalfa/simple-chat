import P from 'bluebird';
import { emptyPromise } from '../../utils/function';
import { sendOutboundMessage } from '../../utils/router';
import Router from '../Router/Router';


export default class InboundRouter extends Router {
  constructor(list = []) {
    super(list);
  }

  use({ action, alterMsg, controller }) {
    if ( typeof action !== 'string') {
      throw new Error('Supplied action parameter is not a string');
    }

    let found = this.find(action);
    if( found ) {
      found.alterMsg = typeof alterMsg === 'function' ? alterMsg : found.alterMsg; // set or override "alterMsg".
      found.controller = typeof controller === 'function' ? controller : found.controller; // set or override "controller".
    } else {
      this.list.push({ action, alterMsg, controller });
    }
  }

  route({ action, sendTo, rawMsg }) {
    let l = this.list.length, i = 0;
    let msg = {};

    for( i; i < l; i++ ) {
      let route = this.list[i];
      if (route.action === action) {
        return P.try( function routeController( ) => {
          let controller = route.controller || emptyPromise;
          return controller({ action, sendTo, rawMsg });
        }).then( function alterMsg( preparedMsg ) => {
          msg = preparedMsg;
          let alterMsg = route.alterMsg || emptyPromise;
          return alterMsg({ action, sendTo, msg });
        }).then( function outboundMessage( alterMsgResults ) => {
          msg = alterMsgResults || msg;
          return sendOutboundMessage({ sendTo, msg });
        }).catch( function routeCatch(error) => {
          console.log('We had an error: ', error);
        });
      }
    }

    throw new Error(`Could not found route for: ${action}`);
  }
}
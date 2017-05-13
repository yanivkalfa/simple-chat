import P from 'bluebird';
import * as Ctrls from './OutboundRoutesControllers';
import { emptyPromise } from '../../utils/functions';

import * as Options from '../../configs/options';

let routes = [
  { path: 'OutboundMessage', controller: Ctrls.outboundMessage },
  { path: 'OutboundMessageStatus', controller: Ctrls.outboundMessageStatus },
  { path: 'OutboundAcknowledgement', controller: Ctrls.outboundAcknowledgement },
  { path: 'OutboundChatState', controller: Ctrls.outboundChatState },
  { path: 'OutboundLoggedInElsewhere', controller: Ctrls.outboundLoggedInElsewhere },
  { path: 'OutboundRosterEvent', controller: Ctrls.outboundRosterEvent },
  { path: 'OutboundInvitation', controller: Ctrls.outboundInvitation },
  { path: 'OutboundRoomEvent', controller: Ctrls.outboundRoomEvent },
  { path: 'OutboundPresence', controller: Ctrls.outboundPresence }
];

function setRoutes(Routes) {

  if ( !Array.isArray(Routes) ) {
    throw new Error('Supplied parameter is not an array of routes.');
  }

  (Routes || []).forEach(use);
}

function getRoutes() {
  return routes;
}

function use({ path, prepareMsg, alterMsg, controller }) {

  if ( typeof path !== 'string') {
    throw new Error('Supplied path parameter is not a string');
  }

  let found = routes.find((route) => {
    return route.path === path;
  });

  if( found ) {
    found.alterMsg = typeof alterMsg === 'function' ? alterMsg : found.alterMsg; // set or override "alterMsg".
    found.controller = typeof controller === 'function' ? controller : found.controller; // set or override "controller".
  } else {
    routes.push({ path, alterMsg, controller });
  }
}

function remove(path){

  if( typeof path !== 'string' ) {
    throw new Error('Supplied path parameter is not a string');
  }

  let indexFound = routes.findIndex((route) => {
    return route.path === path;
  });

  if ( indexFound >= 0 ) {
    return routes.splice(indexFound, 1);
  }

  return false;
}

export function sendOutboundMessage({ sendTo, msg }) {
  return new P((resolve, reject) => {
    if (sendTo === 'all') {
      let transport = Options.getTransport();
      transport.write(msg);
    } else {
      sendTo.write(msg);
    }
    return resolve();
  });
}

function route({ path, sendTo = 'all', rawMsg }) {
  let l = routes.length, i = 0;
  let msg = {};

  for( i; i < l; i++ ) {
    let route = routes[i];
    if (route.path === path) {
      return P.try( function routeController( ) => {
        let controller = route.controller || emptyPromise;
        return controller({ path, sendTo, rawMsg });
      }).then( function alterMsg( preparedMsg ) => {
        msg = preparedMsg;
        let alterMsg = route.alterMsg || emptyPromise;
        return alterMsg({ path, sendTo, msg });
      }).then( function outboundMessage( alterMsgResults ) => {
        msg = alterMsgResults || msg;
        return sendOutboundMessage({ sendTo, msg });
      }).catch( function routeCatch(error) => {
        console.log('We had an error: ', error);
      });
    }
  }

  return emptyPromise();
}

export default function init(Routes = []) {
  setRoutes(Routes);

  return {
    setRoutes: setRoutes,
    getRoutes: getRoutes,
    use: use,
    remove: remove,
    route: route
  }
}
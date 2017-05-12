import P from 'bluebird';
import * as Ctrls from './OutboundRoutesControllers';
import { emptyPromise } from '../../utils/functions';

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

function use({ path, alterMsg, controller }) {

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

function route({ path, sendTo = 'all', msg }) {
  let l = routes.length, i = 0;
  let res = {};

  for( i; i < l; i++ ) {
    let route = routes[i];
    if (route.path === path) {
      return P.try(()=>{
        let alterMsg = route.alterMsg || emptyPromise;
        return alterMsg({ path, sendTo, msg });
      }).then((  )=> {
        res = { success: true, error: null };
        let controller = route.controller || emptyPromise;
        return controller({ path, sendTo, msg, res, success: true });
      }).catch((error) => {
        res = { success: false, error };
        let controller = route.controller || emptyPromise;
        controller({ path, sendTo, msg, res, success: false });
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
import P from 'bluebird';
import * as Ctrls from './InboundRoutesControllers';
import { emptyPromise } from '../../utils/functions';

let routes = [
  { path: 'message/sendMessage', controller: Ctrls.messageSendMessage },
  { path: 'message/forwardMessage',  controller: Ctrls.messageForwardMessage },
  { path: 'message/sendMessageStatus',  controller: Ctrls.messageSendMessageStatus },
  { path: 'chat/sendChatState',  controller: Ctrls.chatSendChatState },
  { path: 'room/createRoom',  controller: Ctrls.roomCreateRoom },
  { path: 'room/deleteRoom',  controller: Ctrls.roomDeleteRoom },
  { path: 'room/inviteToRoom',  controller: Ctrls.roomInviteToRoom() },
  { path: 'room/declineRoomInvitation',  controller: Ctrls.roomDeclineRoomInvitation },
  { path: 'room/acceptRoomInvitation',  controller: Ctrls.roomAcceptRoomInvitation() },
  { path: 'room/kickFromRoom',  controller: Ctrls.roomKickFromRoom },
  { path: 'room/LeaveRoom',  controller: Ctrls.roomLeaveRoom() },
  { path: 'room/renameRoom',  controller: Ctrls.roomRenameRoom },
  { path: 'availability/setAvailability',  controller: Ctrls.availabilitySetAvailability() },
  { path: 'presence/userOnline',  controller: Ctrls.presenceUserOnline },
  { path: 'presence/userOffline', controller: Ctrls.presenceUserOffline() }
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

function use({ path, hasAccess, success, failure }) {
  
  if ( typeof path !== 'string') {
    throw new Error('Supplied path parameter is not a string');
  }

  let found = routes.find((route) => {
    return route.path === path;
  });

  if( found ) {
    found.success = typeof success === 'undefined' ? found.success : success; // set or override "success".
    found.failure = typeof failure === 'undefined' ? found.failure : failure; // set or override "failure".
    found.hasAccess = typeof hasAccess === 'undefined' ? found.hasAccess : hasAccess; // set or override "hasAccess".
  } else {
    routes.push({ path, hasAccess, success, failure });
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

function route({ path, client, msg }) {
  let l = routes.length, i = 0;
  let res = {};

  for( i; i < l; i++ ) {
    let route = routes[i];
    if (route.path === path) {
      return P.try(()=>{
        let hasAccess = route.hasAccess || emptyPromise;
        return hasAccess({ path, client, msg });
      }).then(( )=> {
        let success = route.success || emptyPromise;
        return success({ path, client, msg });
      }).then(( results )=> {
        res = { success: true, results, error: null };
        let controller = route.controller || emptyPromise;
        return controller({ path, client, msg, res, success: true });
      }).catch((error) => {
        res = { success: false, results: null, error };
        let failure = route.failure || emptyPromise;
        failure({ path, client, msg, res });
        let controller = route.controller || emptyPromise;
        controller({ path, client, msg, res, success: false });
      });
    }
  }

  return emptyPromise();
}

export default function init(Routes) {
  setRoutes(Routes);

  return {
    setRoutes: setRoutes,
    getRoutes: getRoutes,
    use: use,
    remove: remove,
    route: route
  }
}
import P from 'bluebird';
import * as Ctrls from './PublishedRoutesControllers';
import { emptyPromise } from '../../utils/functions';

let routes = [
  { path: 'message/sendMessage', controller: Ctrls.messageSendMessage },
  { path: 'message/forwardMessage',  controller: Ctrls.messageForwardMessage },
  { path: 'message/sendMessageStatus',  controller: Ctrls.messageSendMessageStatus },
  { path: 'chat/sendChatState',  controller: Ctrls.chatSendChatState },
  { path: 'room/createRoom',  controller: Ctrls.roomCreateRoom },
  { path: 'room/deleteRoom',  controller: Ctrls.roomDeleteRoom },
  { path: 'room/inviteToRoom',  controller: Ctrls.roomInviteToRoom },
  { path: 'room/declineRoomInvitation',  controller: Ctrls.roomDeclineRoomInvitation },
  { path: 'room/acceptRoomInvitation',  controller: Ctrls.roomAcceptRoomInvitation },
  { path: 'room/kickFromRoom',  controller: Ctrls.roomKickFromRoom },
  { path: 'room/LeaveRoom',  controller: Ctrls.roomLeaveRoom },
  { path: 'room/renameRoom',  controller: Ctrls.roomRenameRoom },
  { path: 'availability/setAvailability',  controller: Ctrls.availabilitySetAvailability },
  { path: 'presence/userOnline',  controller: Ctrls.presenceUserOnline },
  { path: 'presence/userOffline', controller: Ctrls.presenceUserOffline }
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

function use({ path, sendTo, controller }) {
  
  if ( typeof path !== 'string') {
    throw new Error('Supplied path parameter is not a string');
  }

  let found = routes.find((route) => {
    return route.path === path;
  });

  if( found ) {
    found.sendTo = typeof sendTo === 'function' ? sendTo : found.sendTo; // set or override "sendTo".
    found.controller = typeof controller === 'function' ? controller : found.controller; // set or override "controller".
  } else {
    routes.push({ path, sendTo, controller });
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

function route({ path, me, msg }) {
  let l = routes.length, i = 0;
  let res = {};

  for( i; i < l; i++ ) {
    let route = routes[i];
    if (route.path === path) {
      return P.try(()=>{
        let sendTo = route.sendTo || emptyPromise;
        return sendTo({ path, me, msg });
      }).then(( results )=> {
        res = { success: true, results, error: null };
        let controller = route.controller || emptyPromise;
        return controller({ path, me, msg, res, success: true });
      }).catch((error) => {
        res = { success: false, results: null, error };
        let controller = route.controller || emptyPromise;
        return controller({ path, me, msg, res, success: false });
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
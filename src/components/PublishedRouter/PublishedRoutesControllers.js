import P from 'bluebird';

import OutboundRouter from '../OutboundRouter/OutboundRouter';
import * as Options from '../../configs/options';


export function messageSendMessage({ path, me, msg, res, success }) {}
export function messageForwardMessage({ path, me, msg, res, success }) {}
export function messageSendMessageStatus({ path, me, msg, res, success }) {}
export function chatSendChatState({ path, me, msg, res, success }) {}
export function roomCreateRoom({ path, to, msg, res, success }) {}
export function roomDeleteRoom({ path, me, msg, res, success }) {}
export function roomInviteToRoom({ path, me, msg, res, success }) {}
export function roomDeclineRoomInvitation({ path, me, msg, res, success }) {}
export function roomAcceptRoomInvitation({ path, me, msg, res, success }) {}
export function roomKickFromRoom({ path, me, msg, res, success }) {}
export function roomLeaveRoom({ path, me, msg, res, success }) {}
export function roomRenameRoom({ path, me, msg, res, success }) {}
export function availabilitySetAvailability({ path, me, msg, res, success }) {}

export function presenceUserOnline({ path, me, msg, res, success }) {
  let outboundRouter = OutboundRouter();

  if ( success ) {
    let sendTo = res.sendToResults;

    if ( sendTo && Array.isArray(sendTo) ) {
      sendTo.forEach((client) => {
        outboundRouter.route({ path: 'OutboundPresence', sendTo: client, msg });
      });
    } else {
      outboundRouter.route({ path: 'OutboundPresence', sendTo, msg });
    }
  }

}

export function presenceUserOffline({ path, me, msg, res, success }) {}

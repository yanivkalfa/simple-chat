require('source-map-support').install();

import P from 'bluebird';

import OutboundRouter from '../OutboundRouter/OutboundRouter';
import * as Options from '../../configs/options';


export function messageSendMessage({ path, client, msg, res, success }) {}
export function messageForwardMessage({ path, client, msg, res, success }) {}
export function messageSendMessageStatus({ path, client, msg, res, success }) {}
export function chatSendChatState({ path, client, msg, res, success }) {}
export function roomCreateRoom({ path, client, msg, res, success }) {}
export function roomDeleteRoom({ path, client, msg, res, success }) {}
export function roomInviteToRoom({ path, client, msg, res, success }) {}
export function roomDeclineRoomInvitation({ path, client, msg, res, success }) {}
export function roomAcceptRoomInvitation({ path, client, msg, res, success }) {}
export function roomKickFromRoom({ path, client, msg, res, success }) {}
export function roomLeaveRoom({ path, client, msg, res, success }) {}
export function roomRenameRoom({ path, client, msg, res, success }) {}
export function availabilitySetAvailability({ path, client, msg, res, success }) {}

export function presenceUserOnline({ path, client, msg, res, success }) {
  let storeToPublish = Options.getStoreToPublish();
  let outboundRouter = OutboundRouter();
  outboundRouter.route({ path });
}

export function presenceUserOffline({ path, client, msg, res, success }) {}

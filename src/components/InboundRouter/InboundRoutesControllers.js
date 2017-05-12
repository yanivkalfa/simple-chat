import P from 'bluebird';
import uuid from 'uuid';

import OutboundRouter from '../OutboundRouter/OutboundRouter';
import * as Options from '../../configs/options';
import * as Consts from '../../configs/constants';
import * as message from '../../utils/message';
import { createMe } from '../../utils/general';


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
  let msgToPublish = {
    me: createMe(client),
    payload: message.createMessage({
      path,
      payload: {
        ...createMe(client),
        messageUUID: uuid.v1()
      }
    })
  };
  storeToPublish.publish(Consts.REDIS_CHANNEL, message.createToPublish(msgToPublish));
}

export function presenceUserOffline({ path, client, msg, res, success }) {
  let storeToPublish = Options.getStoreToPublish();
  let msgToPublish = {
    me: createMe(client),
    payload: message.createMessage({
      path,
      payload: {
        ...createMe(client),
        messageUUID: uuid.v1()
      }
    })
  };
  storeToPublish.publish(Consts.REDIS_CHANNEL, message.createToPublish(msgToPublish));
}

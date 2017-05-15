import * as Options from '../../configs/options';

export function outboundMessage({ path, sendTo, rawMsg }) {}
export function outboundMessageStatus({ path, sendTo, rawMsg }) {}
export function outboundAcknowledgement({ path, sendTo, rawMsg }) {}
export function outboundChatState({ path, sendTo, rawMsg }) {}
export function outboundLoggedInElsewhere({ path, sendTo, rawMsg }) {}
export function outboundRosterEvent({ path, sendTo, rawMsg }) {}
export function outboundInvitation({ path, sendTo, rawMsg }) {}
export function outboundRoomEvent({ path, sendTo, rawMsg }) {}
export function outboundPresence({ path, sendTo, rawMsg }) {
  return message.createMessage({
    path: 'OutboundPresence',
    payload: {
      path:'a'
    }
  })
}
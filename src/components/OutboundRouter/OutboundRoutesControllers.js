import * as Options from '../../configs/options';

export function outboundMessage({ path, sendTo, msg, res, success }) {}
export function outboundMessageStatus({ path, sendTo, msg, res, success }) {}
export function outboundAcknowledgement({ path, sendTo, msg, res, success }) {}
export function outboundChatState({ path, sendTo, msg, res, success }) {}
export function outboundLoggedInElsewhere({ path, sendTo, msg, res, success }) {}
export function outboundRosterEvent({ path, sendTo, msg, res, success }) {}
export function outboundInvitation({ path, sendTo, msg, res, success }) {}
export function outboundRoomEvent({ path, sendTo, msg, res, success }) {}
export function outboundPresence({ path, sendTo, msg, res, success }) {
  if ( success ) {
    if (sendTo === 'all') {
      let transport = Options.getTransport();
      transport.broadcast(msg);
    } else {
      sendTo.write(msg)
    }
  }
}





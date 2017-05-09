export const REDIS_CHANNEL = 'SIMPLE-CHAT';

/* Statuses */
export const SENDING = 'SENDING'; //after initial sending before server acknowledged.
export const ACKNOWLEDGED = 'ACKNOWLEDGED'; //server acknowledged it received the message.
export const NOTIFIED = 'NOTIFIED'; //user was not online so an email sent to the user.
export const DELIVERED = 'DELIVERED'; //user were online and message got delivered but not viewed or displayed
export const DISPLAYED = 'DISPLAYED'; //message received and viewed
export const PLAYED = 'PLAYED'; //message received and played (in-case of voice message)


/* Room Types */
export const GROUP = 'GROUP'; //Room with more then 1 member
export const ONE_TO_ONE = 'ONE_TO_ONE'; //One on One room

/* Outbound message */
export const OUTBOUND_MESSAGE_STATUS = 'OutboundMessageStatus';
export const OUTBOUND_ACKNOWLEDGEMENT = 'OutboundAcknowledgement';
export const OUTBOUND_CHAT_STATE = 'OutboundChatState';
export const OUTBOUND_LOGGED_IN_ELSEWHERE = 'OutboundLoggedInElsewhere';
export const OUTBOUND_ROSTER_EVENT = 'OutboundRosterEvent';
export const OUTBOUND_INVITATION = 'OutboundInvitation';
export const OUTBOUND_ROOM_EVENT = 'OutboundRoomEvent';
export const OUTBOUND_PRESENCE = 'OutboundPresence';
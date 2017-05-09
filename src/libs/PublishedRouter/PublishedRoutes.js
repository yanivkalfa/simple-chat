export default [
  { path: 'message/sendMessage',   cbs: [ ()=>{} ] },
  { path: 'message/forwardMessage',  cbs: [ ()=>{} ] },
  { path: 'message/sendMessageStatus',  cbs: [ ()=>{} ] },
  { path: 'chat/sendChatState',  cbs: [ ()=>{} ] },
  { path: 'room/createRoom',  cbs: [ ()=>{} ] },
  { path: 'room/deleteRoom',  cbs: [ ()=>{} ] },
  { path: 'room/inviteToRoom',  cbs: [ ()=>{} ] },
  { path: 'room/declineRoomInvitation',  cbs: [ ()=>{} ] },
  { path: 'room/acceptRoomInvitation',  cbs: [ ()=>{} ] },
  { path: 'room/kickFromRoom',  cbs: [ ()=>{} ] },
  { path: 'room/LeaveRoom',  cbs: [ ()=>{} ] },
  { path: 'room/renameRoom',  cbs: [ ()=>{} ] },
  { path: 'availability/setAvailability',  cbs: [ ()=>{} ] },
  { path: 'presence/userOnline',  cbs: [ ()=>{} ] },
  { path: 'presence/userOffline',  cbs: [ ()=>{} ] }
]


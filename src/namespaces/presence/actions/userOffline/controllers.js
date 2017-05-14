export function inboundController({ path, client, msg, res, success }) {
  if ( success ) {
    let storeToPublish = Options.getStoreToPublish();
    let msgToPublish = {
      me: createMe(client, res),
      payload: message.createMessage({
        path,
        payload: {
          ...createMe(client, res),
          messageUUID: uuid.v1()
        }
      })
    };
    storeToPublish.publish(Consts.REDIS_CHANNEL, message.createToPublish(msgToPublish));
  }
}

export function publishedController({ path, me, msg, res, success }) {

}

export function outboundController({ path, sendTo, rawMsg }) {

}
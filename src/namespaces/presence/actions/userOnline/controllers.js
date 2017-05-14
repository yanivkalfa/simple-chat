export function inboundController({ path, client, msg, res, success }) {
  if ( success ) {
    msg.me = createMe(client, res);
    let storeToPublish = Options.getStoreToPublish();
    storeToPublish.publish(Consts.REDIS_CHANNEL, JSON.stringify(msg));
  }
}

export function publishedController({ path, me, msg, res, success }) {
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

export function outboundController({ path, sendTo, rawMsg }) {

}
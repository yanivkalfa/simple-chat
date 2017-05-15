import P from 'bluebird';
import uuid from 'uuid';
import * as Options from '../../../../configs/options';
import * as Consts from '../../../../configs/constants';
import * as message from '../../../../utils/message';
import { createMe } from '../../../../utils/general';
import { stringifyPath } from '../../../../utils/router';

export function inboundController({ path, client, msg, res, success }) {
  if ( success ) {
    msg = message.createMessage({
      path: stringifyPath(path),
      me: createMe(client, res),
      payload: {
        ...createMe(client, res),
        messageUUID: uuid.v1()
      }
    });
    let storeToPublish = Options.getStoreToPublish();
    storeToPublish.publish(Consts.REDIS_CHANNEL, JSON.stringify(msg));
  }
}

export function publishedController({ path, me, msg, res, success }) {
  let namespaceRouter = Options.getNamespaceRouter();

  if ( success ) {
    let sendTo = res.sendToResults;
    if ( sendTo && Array.isArray(sendTo) ) {
      sendTo.forEach((client) => {
        namespaceRouter.route({ direction: 'outbound', path, sendTo: client, msg });
      });
    } else {
      namespaceRouter.route({ direction: 'outbound', path, sendTo, msg });
    }
  }
}

export function outboundController({ path, sendTo, rawMsg }) {
  return message.createMessage({
    path: stringifyPath(path),
    payload: rawMsg.payload
  });

}
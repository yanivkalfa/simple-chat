import P from 'bluebird';
import uuid from 'uuid';
import InboundRouter from './components/InboundRouter/InboundRouter';
import PublishedRouter from './components/PublishedRouter/PublishedRouter';
import * as Events from './components/Events/Events';
import * as message from './utils/message';
import { createMe } from './utils/general';

import Consts from './configs/constants';
import * as Options from './configs/Options';

function start() {

  let transport = Options.getTransport();
  let storeToSubscribe = Options.getStoreToSubscribe();
  let storeToPublish = Options.getStoreToPublish();

  let inboundRouter = InboundRouter();
  let publishedRouter = PublishedRouter();

  //let isReady = Options.getIsReady();
  let events = Events.get();

  if( !storeToSubscribe || !storeToPublish ) {
    return false;
  }

  Options.setIsReady(true);
  storeToSubscribe.subscribe(Consts.REDIS_CHANNEL);
  storeToSubscribe.on("message", function (channel, message) {
    if (channel == Consts.REDIS_CHANNEL) {
      let msg = null;
      try {
        msg = JSON.parse(message);
      } catch(e) {
        console.log('Unable to parse message');
      }

      if ( !msg ) {
        return false;
      }

      publishedRouter.route({
        path: msg.payload.path,
        me: msg.me,
        msg: msg.payload
      });
    }
  });

  transport.on('connection', (client) => {
    client.__uuid = uuid.v1();
    let connectionCbs = events.connection && Array.isArray(events.connection) || [];
    P.all(connectionCbs).then((results) => {
      client.__user = results[0] || null;
      storeToPublish.publish(Consts.REDIS_CHANNEL, message.createToPublish({
        me: createMe(client),
        payload: message.createMessage({
          path: 'presence/userOnline',
          payload: {
            ...createMe(client),
            messageUUID: uuid.v1()
          }
        })
      }));
    });


    client.on('inboundMessage', function (msg) {
      inboundRouter.route({ path: msg.path, client, msg });
    });
  });

  transport.on('disconnection', (client)=> {
    let disconnectionCbs =  events.disconnection && Array.isArray(events.disconnection) || [];
    P.all(disconnectionCbs).then(() => {
      storeToPublish.publish(Consts.REDIS_CHANNEL, message.createToPublish({
        me: createMe(client),
        payload: message.createMessage({
          path: 'presence/userOffline',
          payload: {
            ...createMe(client),
            messageUUID: uuid.v1()
          }
        })
      }));
      client.__uuid = null;
      client.__user = null;
    });
  });
}

export default function init({ transport, storeToSubscribe, storeToPublish, inboundRouts, outboundRoutes, publishedRoutes }) {
  Options.setTransport(transport);
  Options.setStoreToSubscribe(storeToSubscribe);
  Options.setStoreToPublish(storeToPublish);
  Options.setIsReady(false);

  return {
    inboundRouter: InboundRouter(inboundRouts),
    outboundRouter: OutboundRouter(outboundRoutes),
    publishedRouter: PublishedRouter(publishedRoutes),
    ...Options,
    ...Events,
    start: start
  }
}

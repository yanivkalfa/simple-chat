//require('source-map-support').install();

import P from 'bluebird';
import uuid from 'uuid';
import InboundRouter from './components/InboundRouter/InboundRouter';
import OutboundRouter from './components/OutboundRouter/OutboundRouter';
import PublishedRouter from './components/PublishedRouter/PublishedRouter';

import * as Consts from './configs/constants';
import * as Options from './configs/options';

function start() {

  let transport = Options.getTransport();
  let storeToSubscribe = Options.getStoreToSubscribe();
  let storeToPublish = Options.getStoreToPublish();

  let inboundRouter = InboundRouter();
  let publishedRouter = PublishedRouter();

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
    inboundRouter.route({ path: 'presence/userOnline', client });

    client.on('inboundMessage', function (msg) {
      inboundRouter.route({ path: msg.path, client, msg });
    });
  });

  transport.on('disconnection', (client)=> {
    inboundRouter.route({ path: 'presence/userOffline', client });
    client.__uuid = null;
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
    start: start
  }
}

import P from 'bluebird';
import PublishedRouter from './libs/PublishedRouter/PublishedRouter';
import InboundRouter from './libs/InboundRouter/InboundRouter';
import OutboundRouter from './libs/OutboundRouter/OutboundRouter';
import * as events from './components/Events';
import Consts from './configs/constants';

import * as message from './utils/message';

export default class SimpleChat extends EventEmitter {
  constructor({ transport, storeToSubscribe, storeToPublish, inboundRouts, outboundRoutes, publishedRoutes }) {
    super();
    this.transport = transport;
    this.storeToSubscribe = storeToSubscribe;
    this.storeToPublish = storeToPublish;
    this.PublishedRouter = new PublishedRouter(publishedRoutes || []);
    this.InboundRouter = new InboundRouter(inboundRouts || []);
    this.OutboundRouter = new OutboundRouter(outboundRoutes || []);

    this.isReady = false;
  }

  setTransport(transport) {
    this.transport = transport;
  }

  setStoreToSubscribe(storeToSubscribe) {
    this.storeToSubscribe = storeToSubscribe;
  }

  setStoreToPublish(storeToPublish) {
    this.storeToPublish = storeToPublish;
  }

  setPublishedRouter(publishedRouter) {
    this.PublishedRouter = publishedRouter;
  }

  setInboundRouter(inboundRouter) {
    this.InboundRouter = inboundRouter;
  }

  setOutboundRouter(outboundRouter) {
    this.OutboundRouter = outboundRouter;
  }

  publishedRouter() {
    return this.PublishedRouter;
  }

  inboundRouter() {
    return this.InboundRouter;
  }

  outboundRouter() {
    return this.OutboundRouter;
  }

  start() {

    if( !this.storeToSubscribe || !this.storeToPublish ) {
      return false;
    }

    this.storeToSubscribe.subscribe(Consts.REDIS_CHANNEL);

    this.transport.on('connection', (client)=> {
      let connectionCbs =  this.events.connection && Array.isArray(this.events.connection) || [];
      P.all(connectionCbs).then((results) => {
        const userName = results[0].userName || null;
        this.storeToPublish.publish(Consts.REDIS_CHANNEL, message.createToPublish('presence/userOnline', { userName }));
      });


      client.on('inboundMessage', function (msg) {
        this.InboundRouter.route(this.storeToPublish, msg.path, client, msg);

      });
    });

    this.transport.on('disconnection', (client)=> {
      this.storeToSubscribe.unsubscribe(Consts.REDIS_CHANNEL);
      let disconnectionCbs =  this.events.disconnection && Array.isArray(this.events.disconnection) || [];

      P.all(disconnectionCbs).then(() => {
        this.StorePublisher.publish('presence/userOffline', client, client.__user);
        client.__user = null;
      });
    });

  }
}


// add to

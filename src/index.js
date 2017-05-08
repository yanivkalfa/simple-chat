import redis from 'redis';
import primus from 'primus';

import InboundRouter from 'libs/InboundRouter/InboundRouter';
import OutboundRouter from 'libs/OutboundRouter/OutboundRouter';
import EventEmitter from 'libs/EventEmitter/EventEmitter';

import Consts from 'configs/constants';

export class SimpleChat extends EventEmitter {
  constructor({ transport, storeToSubscribe, storeToPublish, inboundRouts, outboundRoutes }) {
    this.transport = transport;
    this.storeToSubscribe = storeToSubscribe;
    this.storeToPublish = storeToPublish;
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

  setInboundRouter(InboundRouter) {
    this.InboundRouter = InboundRouter;
  }

  setOutboundRouter(OutboundRouter) {
    this.OutboundRouter = OutboundRouter;
  }

  inboundRouter() {
    return this.InboundRouter;
  }

  OutboundRouter() {
    return this.OutboundRouter;
  }

  start() {

    if( !this.storeToSubscribe || !this.storeToPublish ) {
      return false;
    }

    this.storeToSubscribe.subscribe("SIMPLE-CHAT");

    this.transport.on('connection', (client)=> {
      if ( this.events.connection &&  Array.isArray(this.events.connection) ) {
        P.all(this.events.connection).then((results) => {
          client.__user = results[0];
          this.storeToPublish.publish('SIMPLE-CHAT', Consts.OUTBOUND_PRESENCE);
        });
      }


    });

    this.transport.on('disconnection', (client)=> {

    });

    this.transport.on('end', ()=> {

    });

  }
}


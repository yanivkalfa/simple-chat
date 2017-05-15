//require('source-map-support').install();

import P from 'bluebird';
import uuid from 'uuid';
import NamespaceRouter from './routers/NamespaceRouter';

import { bulkAddNamespaces } from './utils/namespace';
import * as Consts from './configs/constants';
import * as Options from './configs/options';

function start() {

  let transport = Options.getTransport();
  let storeToSubscribe = Options.getStoreToSubscribe();
  let storeToPublish = Options.getStoreToPublish();
  let namespaceRouter = Options.getNamespaceRouter();

  if( !storeToSubscribe || !storeToPublish ) {
    return false;
  }

  Options.setIsReady(true);
  storeToSubscribe.subscribe(Consts.REDIS_CHANNEL);
  storeToSubscribe.on("message", function subOnMessage(channel, message) {
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

      namespaceRouter.route({ direction: 'published', path: msg.path, me: msg.me,  msg });
    }
  });

  transport.on('connection', function transportOnConnection(client) {
    client.__uuid = uuid.v1();
    namespaceRouter.route({ direction: 'inbound', path: { namespace: 'presence', action: 'userOnline' }, client });

    client.on('data', function clientOnData(msg) {
      namespaceRouter.route({ direction: 'inbound', path: msg.path, client, msg });
    });
  });

  transport.on('disconnection', function transportOnDisconnection(client) {
    namespaceRouter.route({ direction: 'inbound', path: { namespace: 'presence', action: 'userOffline' }, client });
    client.__uuid = null;
  });
}

export default function init({ transport, storeToSubscribe, storeToPublish, stringPath, namespaces }) {
  Options.setTransport(transport);
  Options.setStoreToSubscribe(storeToSubscribe);
  Options.setStoreToPublish(storeToPublish);
  Options.setNamespaceRouter(new NamespaceRouter(namespaces));
  Options.setIsReady(false);
  Options.setStringPath(stringPath);
  bulkAddNamespaces();

  return {
    ...Options,
    start: start,
    bulkAddNamespaces
  }
}
import P from 'bluebird';
import { createNamespace } from '../utils/namespace';
import { parsePath } from '../utils/router';
import Router from './Router';

export default class NamespaceRouter extends Router {
  constructor(list) {
    super(list);
    this.propName = 'name';
  }

  use(name) {
    if (typeof name !== 'string') {
      throw new Error('Supplied name parameter is not a string');
    }

    let namespace = this.find(name);
    if (!namespace) {
      namespace = createNamespace(name);
      this.list.push(namespace);
    }

    return namespace;
  }

  route({ direction, path, client, msg = {}, me, sendTo }) {
    msg.path = path = parsePath(path); // making sure path is always an object so it will be easier to work with.
    let foundNamespace =  this.find(path.namespace);
    direction = direction.toLowerCase();
    if ( foundNamespace ) {
      if ( direction === 'inbound') {
        return foundNamespace.inboundRouter.route({ path, client, msg });
      }

      if ( direction === 'published') {
        return foundNamespace.publishedRouter.route({ path, me, msg });
      }

      if ( direction === 'outbound') {
        return foundNamespace.outboundRouter.route({ path, sendTo, rawMsg: msg });
      }

    }
    throw new Error('Could not found the namespace you\'r looking for.');
  }
}
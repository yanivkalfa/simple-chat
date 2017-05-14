import * as Options from '../configs/options';

export function parsePath(path) {
  let parsedPath = {};

  if ( typeof path === 'string' ) {
    path = path.replace('\\', '/').split('/');
    parsedPath.namespace = path[0];
    parsedPath.action = path[1];
  } else  if ( typeof path === 'object' ) {
    parsedPath.namespace = path.namespace;
    parsedPath.action = path.action;
  }

  if ( parsedPath.namespace && parsedPath.action ) {
    return parsedPath;
  }

  throw new Error('Unable to parse path, path should either be a string or an object with namespace and action properties');
}

export function sendOutboundMessage({ sendTo, msg }) {
  return new P((resolve, reject) => {
    if (sendTo === 'all') {
      let transport = Options.getTransport();
      transport.write(msg);
    } else {
      sendTo.write(msg);
    }
    return resolve();
  });
}
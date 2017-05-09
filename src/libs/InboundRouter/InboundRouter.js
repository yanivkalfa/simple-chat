import inboundRoutes from './InboundRouter';

export default class InboundRouter {
  constructor() {
    this.routs = [];
  }

  get() {
    return this.routs;
  }

  use({ path, hasAccess, cbs }) {


    let found = this.routs.find((route) => {
      return route.path === path;
    });

    if( found ) {
      found.cbs = Array.isArray(cbs) ? cbs : [ cbs ];
      found.hasAccess = typeof hasAccess === 'undefined' ? found.hasAccess : hasAccess; // set or override "hasAccess".
    } else {
      this.routs.push({ path, hasAccess, to, cbs });
    }
  }

  remove(path){

    if( typeof path !== 'string' ) {
      return false;
    }

    let indexFound = this.routs.findIndex((route) => {
      return route.path === path;
    });

    if ( indexFound >= 0 ) {
      return this.routs.splice(indexFound, 1);
    }

    return false;
  }

  route({ path, client, msg }) {
    inboundRoutes.forEach((route) => {
      if (route.path === path) {
        return P.try(()=>{
          return hasAccess(path, msg, connection);
        }).then(( user )=> {
          return P.all([
            user,
            sendTo(user, msg, connection),
            success(user, msg, connection)
          ])
        }).then(( user )=> {
          respondToClientWithSuccess();
          publishToRedis(user, msg);
        }).catch((err) => {
          failur();
          return respondToClientWithFailur();
        });
      }
    });
  }
}


msg.to = to;
this.storeToPublish.publish(Consts.REDIS_CHANNEL, msg);

function cbs(msg, hasAccess, sendTo,  success, failur) {
  return P.try(()=>{
    return hasAccess(path, msg, connection);
  }).then(( user )=> {
    return P.all([
      user,
      sendTo(user, msg, connection),
      success(user, msg, connection)
    ])
  }).then(( user )=> {
    respondToClientWithSuccess();
    publishToRedis(user, msg);
  }).catch((err) => {
    failur();
    return respondToClientWithFailur();
  });
}
import InboundRouter from './../routers/InboundRouter';
import PublishedRouter from './../routers/PublishedRouter';
import OutboundRouter from './../routers/OutboundRouter';

export function createNamespace(name) {
  return {
    name: name,
    inboundRouter: new InboundRouter(),
    publishedRouter: new PublishedRouter(),
    outboundRouter: new OutboundRouter()
  }
}
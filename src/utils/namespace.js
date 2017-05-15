import * as Options from '../configs/options';
import InboundRouter from './../routers/InboundRouter';
import PublishedRouter from './../routers/PublishedRouter';
import OutboundRouter from './../routers/OutboundRouter';
import namespaces from './../namespaces/';

export function createNamespace(name) {
  return {
    name: name,
    inboundRouter: new InboundRouter(),
    publishedRouter: new PublishedRouter(),
    outboundRouter: new OutboundRouter()
  }
}

export function bulkAddNamespaces( userNamespaces ) {
  let namespaceRouter = Options.getNamespaceRouter();

  ( userNamespaces|| namespaces || [] ).forEach(function namespaceIterator(namespaceConfig) {
    let { name, actions } = namespaceConfig;
    let namespace = namespaceRouter.use(name);

    (actions || []).forEach(function actionIterator(action) {
      namespace.inboundRouter.use(action.inboundRouter);
      namespace.publishedRouter.use(action.publishedRouter);
      namespace.outboundRouter.use(action.outboundRouter);
    });
  })
}
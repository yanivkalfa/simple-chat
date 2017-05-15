import * as Ctrls from './controllers';
import { emptyPromise } from '../../../../utils/function';

let action = 'userOnline';
export default {
  inboundRouter: {
    action,
    hasAccess: emptyPromise,
    success: emptyPromise,
    failure: emptyPromise,
    controller: Ctrls.inboundController
  },
  publishedRouter: {
    action,
    sendTo: emptyPromise,
    controller: Ctrls.publishedController
  },
  outboundRouter: {
    action,
    alterMsg: emptyPromise,
    controller: Ctrls.outboundController
  }
}
let transport = null;
let storeToSubscribe = null;
let storeToPublish = null;
let namespaceRouter = null;
let isReady = false;
let stringPath = false;


/* Setters */
export function setTransport(Transport) {
  transport = Transport;
}

export function setStoreToSubscribe(StoreToSubscribe) {
  storeToSubscribe = StoreToSubscribe;
}

export function setStoreToPublish(StoreToPublish) {
  storeToPublish = StoreToPublish;
}

export function setIsReady(IsReady) {
  isReady = IsReady;
}

export function setStringPath(StringPath) {
  stringPath = typeof StringPath === 'boolean' ? StringPath : stringPath;
}

export function setNamespaceRouter(NamespaceRouter) {
  namespaceRouter = NamespaceRouter;
}



/* Getters */
export function getTransport() {
  return transport;
}

export function getStoreToSubscribe() {
  return storeToSubscribe;
}

export function getStoreToPublish() {
  return storeToPublish;
}

export function getIsReady() {
  return isReady;
}

export function getStringPath() {
  return stringPath;
}

export function getNamespaceRouter() {
  return namespaceRouter;
}
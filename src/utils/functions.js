import P from 'bluebird';

export function emptyPromise() {
  return new P((resolve, reject)=> {
    return resolve();
  });
}
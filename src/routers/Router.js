import P from 'bluebird';
import { emptyPromise } from '../utils/function';
import { findUserName } from '../utils/general';

export default class Router {
  
  constructor(list = []) {
    this.List = list || [];
    this.propName = 'action';
  }
  
  setList(list) {
    if ( !Array.isArray(list) ) {
      throw new Error('Supplied parameter is not an array.');
    }

    (list || []).forEach(this.use);
  }

  getList() {
    return this.list;
  }

  remove(value) {
    if( typeof value !== 'string' ) {
      throw new Error('Supplied parameter is not a string');
    }

    let indexFound = this.findIndex(value);
    if ( indexFound >= 0 ) {
      return this.list.splice(indexFound, 1);
    }

    return false;
  }

  findIndex(value) {
    return this.list.findIndex((record) => {
      return record[this.propName] === value;
    });
  }

  find(value) {
    return this.list.find((record) => {
      return record[this.propName] === value;
    });
  }
}
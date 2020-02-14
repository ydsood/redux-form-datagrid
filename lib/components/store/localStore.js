// @flow

// Ensure immutability of store contents
const storeData = Symbol('Grid Data');


type Data = Array<Object>;

class LocalStore {
  getData:Function;

  getSize:Function;

  constructor(data: Data) {
    // don't allow these to be set after store initialization
    // $FlowFixMe
    this[storeData] = data;
    this.getData = this.getData.bind(this);
    this.getSize = this.getSize.bind(this);
  }

  getSize(): number {
    // $FlowFixMe
    const storeSize = this[storeData] ? this[storeData].length : 0;
    return storeSize;
  }

  getData() {
    // $FlowFixMe
    return this[storeData];
  }

  clear() {
    // $FlowFixMe
    delete this[storeData];
  }
}

export default LocalStore;

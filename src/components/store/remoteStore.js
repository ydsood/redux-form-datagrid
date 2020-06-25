// @flow

class RemoteStore {
  getData: () => Array<Object>

  getSize: () => number

  constructor(getData: () => Array<Object>, getSize: () => number) {
    this.getData = getData;
    this.getSize = getSize;
  }
}

export default RemoteStore;

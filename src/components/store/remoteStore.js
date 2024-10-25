// @flow

class RemoteStore {
  getData: () => Array<Object>

  getSize: () => number

  constructor(fetcher: () => Array<Object>, pageSize: number = 10) {
    this.totalRecords = 0;
    this.pageSize = pageSize;
    this.fetcher = fetcher;
  }

  async getData(params: Object = {}): Promise<Array<Object>> {
    const fetcherParams = {
      ...params,
    };

    try {
      const response = await this.fetcher(fetcherParams);
      const { data, totalRecords } = response;
      this.totalRecords = totalRecords;

      return {
        data,
        totalRecords,
      };
    } catch (error) {
      throw new Error("Data fetch failed");
    }
  }

  getSize(): number {
    return this.totalRecords;
  }

  clear() {
    this.fetcher = null;
    this.pageSize = 0;
    this.totalRecords = 0;
  }
}

export default RemoteStore;

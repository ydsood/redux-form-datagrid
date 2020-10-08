// @flow
import type { LocalStore } from '../../store/localStore';

export default class SortingHandler {
  constructor() {
    this.sortData = this.sortData.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  sortData(store: LocalStore, columnName: any, isAscending: any,
    format: string, getValue: any): Array<Object> {
    const data = store.getData();
    const property = columnName;
    if (format === 'number') {
      data.sort((a, b) => {
        const first = parseFloat(getValue ? getValue(a[property] || 0) : a[property] || 0);
        const second = parseFloat(getValue ? getValue(b[property] || 0) : b[property] || 0);
        return isAscending ? first - second : second - first;
      });
    }

    if (format === 'string') {
      data.sort((a, b) => {
        const first = getValue ? getValue(b[property]).toLowerCase() : b[property].toLowerCase();
        const second = getValue ? getValue(a[property]).toLowerCase() : a[property].toLowerCase();
        const ascending = first > second ? -1 : 1;
        const descending = second > first ? -1 : 1;
        return isAscending ? ascending : descending;
      });
    }

    if (format === 'date') {
      data.sort((a, b) => {
        const da = new Date(a[property]);
        const db = new Date(b[property]);
        return isAscending ? da - db : db - da;
      });
    }
    if (data && Array.isArray(data)) {
      return data;
    }
    return data;
  }
}

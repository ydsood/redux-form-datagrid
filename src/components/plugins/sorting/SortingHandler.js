// @flow

export default class SortingHandler {
  activeColumn: String;

  isAscending: Boolean;

  columnModel: Array<Object>;

  sortData: Function;

  updateActiveColumn: Function;

  constructor(columnModel: Array<Object>) {
    this.activeColumn = "";
    this.isAscending = false;

    this.columnModel = columnModel || [];

    this.sortData = this.sortData.bind(this);
    this.updateActiveColumn = this.updateActiveColumn.bind(this);
  }

  updateActiveColumn(activeColumn: String) {
    if (activeColumn !== this.activeColumn) {
      this.activeColumn = activeColumn;
      this.isAscending = true;
    } else if (this.isAscending) {
      this.isAscending = false;
    } else {
      this.activeColumn = "";
    }
  }

  sortData(data: Array<Object>): Array<Object> {
    const { activeColumn, isAscending, columnModel } = this;

    if (!activeColumn) {
      return data;
    }

    const currentColumn = columnModel.find((column) => column.dataIndex === activeColumn);
    const { dataIndex, sortingType, getValue } = currentColumn;

    if (sortingType === "number") {
      return data.sort((a, b) => {
        const first = parseFloat(getValue ? getValue(a[dataIndex] || 0) : a[dataIndex] || 0);
        const second = parseFloat(getValue ? getValue(b[dataIndex] || 0) : b[dataIndex] || 0);
        return !isAscending ? first - second : second - first;
      });
    } if (sortingType === "date") {
      return data.sort((a, b) => {
        const da = new Date(getValue ? getValue(a[dataIndex]) : a[dataIndex]);
        const db = new Date(getValue ? getValue(b[dataIndex]) : b[dataIndex]);
        return !isAscending ? da - db : db - da;
      });
    }

    return data.sort((a, b) => {
      const first = getValue ? getValue(a[dataIndex]).toLowerCase() : a[dataIndex].toLowerCase();
      const second = getValue ? getValue(b[dataIndex]).toLowerCase() : b[dataIndex].toLowerCase();
      const ascending = first > second ? -1 : 1;
      const descending = second > first ? -1 : 1;
      return !isAscending ? ascending : descending;
    });
  }
}

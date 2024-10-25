// @flow

export default class RemoteSortingHandler {
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

  sortData(): Object {
    const { activeColumn, isAscending } = this;

    if (!activeColumn) {
      return {};
    }

    return {
      sortColumn: activeColumn,
      sortDirection: isAscending ? "ASC" : "DESC",
    };
  }
}

// @flow

export default class RemoteSortingHandler {
  activeColumn: String;

  isAscending: Boolean;

  columnModel: Array<Object>;

  getSortingInfo: Function;

  updateActiveColumn: Function;

  onSortChange: Function | null;

  constructor(columnModel: Array<Object>, options?: Object) {
    const {
      defaultSortColumn,
      defaultSortDirection,
      onSortChange,
    } = options || {};

    this.activeColumn = defaultSortColumn || "";
    // Default to ASC when a default column is provided but no direction
    this.isAscending = defaultSortColumn ? (defaultSortDirection === "DESC" ? false : true) : false;

    this.columnModel = columnModel || [];

    this.onSortChange = typeof onSortChange === "function" ? onSortChange : null;

    this.getSortingInfo = this.getSortingInfo.bind(this);
    this.updateActiveColumn = this.updateActiveColumn.bind(this);

    // Emit initial sort state if provided
    if (this.activeColumn && this.onSortChange) {
      this.emitSortChange();
    }
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

    this.emitSortChange();
  }

  getSortingInfo(): Object {
    const { activeColumn, isAscending } = this;

    if (!activeColumn) {
      return {};
    }

    return {
      sortColumn: activeColumn,
      sortDirection: isAscending ? "ASC" : "DESC",
    };
  }

  emitSortChange() {
    if (!this.onSortChange) return;
    const info = this.getSortingInfo();
    if (info && info.sortColumn) {
      try {
        // Prefer object payload
        this.onSortChange(info);
      } catch (e) {
        // Fallback to positional args if consumer expects them
        try { this.onSortChange(info.sortColumn, info.sortDirection); } catch (_) { /* noop */ }
      }
    }
  }
}

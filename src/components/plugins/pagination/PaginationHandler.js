// @flow

export default class PaginationHandler {
  cursor: Number;

  data: Array<Object>;

  pageSize: Number;

  moveToNextPage: Function;

  moveToPreviousPage: Function;

  moveToFirstPage: Function;

  moveToLastPage: Function;

  getFirstRecordPosition: Function;

  getLastRecordPosition: Function;

  isOnFirstPage: Function;

  isOnLastPage: Function;

  getCurrentPage: Function;

  constructor(pageSize: number) {
    this.cursor = 0;
    this.data = [];

    this.pageSize = pageSize;

    this.moveToNextPage = this.moveToNextPage.bind(this);
    this.moveToPreviousPage = this.moveToPreviousPage.bind(this);
    this.moveToFirstPage = this.moveToFirstPage.bind(this);
    this.moveToLastPage = this.moveToLastPage.bind(this);
    this.getFirstRecordPosition = this.getFirstRecordPosition.bind(this);
    this.getLastRecordPosition = this.getLastRecordPosition.bind(this);
    this.isOnFirstPage = this.isOnFirstPage.bind(this);
    this.isOnLastPage = this.isOnLastPage.bind(this);
    this.getCurrentPage = this.getCurrentPage.bind(this);
  }

  moveToNextPage() {
    const { cursor, pageSize, data } = this;

    const start = cursor + pageSize;
    if (start >= 0 && start < data.length) {
      this.cursor = start;
    }
  }

  moveToPreviousPage() {
    const { cursor, pageSize, data } = this;

    const start = cursor - pageSize;
    if (start >= 0 && start < data.length) {
      this.cursor = start;
    } else if (start < 0) {
      this.cursor = 0;
    }
  }

  moveToFirstPage() {
    this.cursor = 0;
  }

  moveToLastPage() {
    const { pageSize, data } = this;
    const totalPages = parseInt(data.length / pageSize, 10)
      + (data.length % pageSize === 0 ? 0 : 1);
    const start = pageSize * (totalPages - 1);
    if (start >= 0 && start < data.length) {
      this.cursor = start;
    } else {
      this.cursor = 0;
    }
  }

  getFirstRecordPosition(): number {
    return this.cursor + 1;
  }

  getLastRecordPosition(): number {
    const { cursor, pageSize, data } = this;

    const currentPage = data ? data.slice(cursor, cursor + pageSize) : [];

    return cursor + currentPage.length;
  }

  isOnFirstPage(): boolean {
    const { pageSize } = this;

    return this.getFirstRecordPosition() < pageSize;
  }

  isOnLastPage(): number {
    const { data } = this;

    return this.getLastRecordPosition() >= data.length;
  }

  getCurrentPage(data: Array<Object>): Array<Object> {
    const { cursor, pageSize } = this;

    this.data = data;

    if (cursor >= data.length) {
      return this.moveToLastPage(data);
    }

    return data.slice(this.cursor, this.cursor + pageSize);
  }
}

// @flow

export default class RemotePaginationHandler {
  page: Number;

  totalRecords: Number;

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

  getTotalNumberOfRecords: Function;

  constructor(pageSize: number, totalRecords: number) {
    this.page = 1;
    this.pageSize = pageSize;
    this.totalRecords = totalRecords;
    this.moveToNextPage = this.moveToNextPage.bind(this);
    this.moveToPreviousPage = this.moveToPreviousPage.bind(this);
    this.moveToFirstPage = this.moveToFirstPage.bind(this);
    this.moveToLastPage = this.moveToLastPage.bind(this);
    this.getFirstRecordPosition = this.getFirstRecordPosition.bind(this);
    this.getLastRecordPosition = this.getLastRecordPosition.bind(this);
    this.isOnFirstPage = this.isOnFirstPage.bind(this);
    this.isOnLastPage = this.isOnLastPage.bind(this);
    this.getCurrentPage = this.getCurrentPage.bind(this);
    this.getTotalNumberOfRecords = this.getTotalNumberOfRecords.bind(this);
  }

  getTotalNumberOfRecords() {
    return this.totalRecords;
  }

  getTotalPages() {
    this.totalPages = parseInt(this.totalRecords / this.pageSize, 10)
      + (this.totalRecords % this.pageSize === 0 ? 0 : 1);
    return this.totalPages;
  }

  moveToNextPage() {
    const { page } = this;

    const nextPage = page + 1;
    if (nextPage > 0 && nextPage <= this.getTotalPages()) {
      this.page = nextPage;
    }
  }

  moveToPreviousPage() {
    const { page } = this;

    const previousPage = page - 1;
    if (previousPage >= 1) {
      this.page = previousPage;
    } else if (previousPage < 1) {
      this.page = 1;
    }
  }

  moveToFirstPage() {
    this.page = 1;
  }

  moveToLastPage() {
    this.page = this.getTotalPages();
  }

  getFirstRecordPosition(): number {
    return (this.page - 1) * this.pageSize + 1;
  }

  getLastRecordPosition(): number {
    const currentCursor = this.page * this.pageSize;

    if (currentCursor >= this.totalRecords) {
      return this.totalRecords;
    }

    return currentCursor;
  }

  isOnFirstPage(): boolean {
    return this.page === 1;
  }

  isOnLastPage(): number {
    return this.page === this.getTotalPages();
  }

  getCurrentPage(params: Object = {}): Object {
    const { page, pageSize } = this;
    return {
      ...params,
      page,
      pageSize,
    };
  }
}

// @flow

type nextFunction = (current: number, pageSize: number) => Array<Object>;
type prevFunction = (current: number, pageSize: number) => Array<Object>;
type firstPageFunction = (pageSize: number) => Array<Object>;
type lastPageFunction = (pageSize: number) => Array<Object>;

export type PaginationProps = {
  next: nextFunction,
  prev: prevFunction,
  firstPage: firstPageFunction,
  lastPage: lastPageFunction,
  pageSize: number,
  totalRecords: number,
  currentStart: number,
}

class PaginationHandler {
  constructor({
    next,
    prev,
    firstPage,
    lastPage,
    pageSize,
    totalRecords,
    currentStart,
  }: PaginationProps) {
    this.next = next;
    this.prev = prev;
    this.firstPage = firstPage;
    this.lastPage = lastPage;
    this.pageSize = pageSize;
    this.totalRecords = totalRecords;
    this.currentStart = currentStart;
  }

  next: nextFunction

  prev: prevFunction

  firstPage: firstPageFunction

  lastPage: lastPageFunction

  pageSize: number

  totalRecords: number

  currentStart: number
}

export default PaginationHandler;

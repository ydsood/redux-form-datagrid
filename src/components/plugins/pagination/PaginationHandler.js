// @flow
export type PaginationProps = {
  pageSize: number,
  cursor?: number,
}

type State = {
  cursor: number,
  pageEnd: number,
  pageSize: number
}

export default class PaginationHandler {
  constructor(pageSize: number, cursor?: number) {
    this.state = { cursor: cursor || 0, pageSize: pageSize || 5 };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.currentPage = this.currentPage.bind(this);
    this.firstPage = this.firstPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
  }

  state: State

  setState(newState) {
    Object.assign(this.state, newState);
  }

  next(data: Array<Object>): Array<Object> {
    const { cursor, pageSize } = this.state;
    const start = cursor + pageSize;
    if (start >= 0 && start < data.length) {
      const end = start + pageSize;
      const returnValue = data.slice(start, end);
      this.setState({ cursor: start, pageEnd: start + returnValue.length });
      return returnValue;
    }
    return null;
  }

  prev(data: Array<Object>): Array<Object> {
    const { cursor, pageSize } = this.state;
    let start = cursor - pageSize;
    start = start < 0 ? 0 : start;
    if (start >= 0 && start < data.length) {
      const end = start + pageSize;
      const returnValue = data.slice(start, end);
      this.setState({ cursor: start, pageEnd: start + returnValue.length });
      return returnValue;
    }
    return null;
  }

  currentPage(data: Array<Object>): Array<Object> {
    const { cursor, pageSize } = this.state;

    if (cursor >= data.length) {
      return this.lastPage(data);
    }

    const returnValue = data.slice(cursor, cursor + pageSize);

    this.setState({ cursor, pageEnd: cursor + returnValue.length });

    return returnValue;
  }

  firstPage(data: Array<Object>): Array<Object> {
    const { pageSize } = this.state;
    const start = 0;
    const end = start + pageSize;
    this.setState({ cursor: start, pageEnd: end });
    const returnValue = data.slice(start, end);
    this.setState({ cursor: start, pageEnd: start + returnValue.length });
    return returnValue;
  }

  lastPage(data: Array<Object>): Array<Object> {
    const { pageSize } = this.state;
    const totalPages = parseInt(data.length / pageSize, 10)
      + (data.length % pageSize === 0 ? 0 : 1);
    let start = pageSize * (totalPages - 1);
    if (start < 0 || start >= data.length) {
      start = 0;
    }

    const end = start + pageSize;
    const returnValue = data.slice(start, end);
    this.setState({ cursor: start, pageEnd: start + returnValue.length });
    return returnValue;
  }

  getFirstRecordPosition(): number {
    return this.state.cursor + 1;
  }

  getLastRecordPosition(): number {
    return this.state.pageEnd;
  }

  getPageSize(): number {
    return this.state.pageSize;
  }
}

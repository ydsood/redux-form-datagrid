import React, { Component } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import type PaginationHandler from './PaginationHandler';


type Props = {
  paginationHandler: PaginationHandler
}

class PaginationControls extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.paginationHandler = props.paginationHandler;
  }

  paginationHandler: PaginationHandler

  render() {
    const {
      firstPage, prev, next, lastPage, pageSize, totalRecords, currentStart,
    }: PaginationHandler = this.props.paginationHandler;
    return (
      <Table.HeaderCell colSpan="3" textAlign="right">
        <span>
          <Icon link name="angle double left" onClick={() => firstPage(pageSize)} />
          <Icon link name="angle left" onClick={() => prev(currentStart, pageSize)} />
        </span>
        <span>{currentStart}</span>
        <span>{currentStart + pageSize}</span>
        <span> of </span>
        <span>{totalRecords}</span>
        <span>
          <Icon link name="angle right" onClick={() => next(currentStart, pageSize)} />
          <Icon link name="angle double right" onClick={() => lastPage(pageSize)} />
        </span>
      </Table.HeaderCell>
    );
  }
}


export default PaginationControls;

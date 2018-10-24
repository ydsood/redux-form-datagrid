import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import PaginationHandler from './PaginationHandler';
import Icon from '../../../elements/icons';


type Props = {
  updateGridState: (Function) => void,
  pageSize: number,
  totalRecords: number,
  colSpan: number
}

class PaginationControls extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.paginationHandler = new PaginationHandler(props.pageSize);
  }

  componentDidMount() {
    const { updateGridState } = this.props;
    updateGridState(this.paginationHandler.firstPage);
  }

  componentDidUpdate(prevProps) {
    if (this.props.totalRecords !== prevProps.totalRecords) {
      const { updateGridState } = this.props;
      updateGridState(this.paginationHandler.firstPage);
    }
  }


  paginationHandler: PaginationHandler

  render() {
    const { updateGridState, totalRecords, colSpan } = this.props;
    return (
      <Table.HeaderCell textAlign="right" colSpan={colSpan}>
        <Icon link name="angle double left" onClick={() => updateGridState(this.paginationHandler.firstPage)} />
        <Icon link name="angle left" onClick={() => updateGridState(this.paginationHandler.prev)} />
        <span>{this.paginationHandler.getFirstRecordPosition()} - {this.paginationHandler.getLastRecordPosition()}</span>
        <span> of </span>
        <span>{totalRecords}</span>
        <Icon link name="angle right" onClick={() => updateGridState(this.paginationHandler.next)} />
        <Icon link name="angle double right" onClick={() => updateGridState(this.paginationHandler.lastPage)} />
      </Table.HeaderCell>
    );
  }
}


export default PaginationControls;

import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import TableCell from './tableCell';

export default class TableRow extends Component<Object> {
  buildRowCells() {
    const {
      input, editable, data, name,
    } = this.props;
    const renderData = input ? input.value : data;
    const cells = this.props.columnModel.get().map((column) => {
      const cellNamePrefix = input ? input.name : name;
      const { dataIndex } = column;
      const value = renderData[dataIndex];
      const key = `${cellNamePrefix}.${column.dataIndex}`;
      return (
        <Table.Cell key={key}>
          <TableCell
            name={cellNamePrefix}
            column={column}
            value={value}
            editable={editable}
          />
        </Table.Cell>
      );
    });
    return cells;
  }

  buildCustomizedCell() {
    const {
      input, data, cellComponent: CellComponent, columnModel,
    } = this.props;
    const renderData = input ? input.value : data;
    return (
      <Table.Cell colSpan={columnModel.get().length}>
        <CellComponent {...renderData} columnModel={columnModel.get()} />
      </Table.Cell>
    );
  }

  render() {
    const { cellComponent } = this.props;
    return (
      <Table.Row>
        {!cellComponent
          ? this.buildRowCells()
          : this.buildCustomizedCell()}
      </Table.Row>
    );
  }
}

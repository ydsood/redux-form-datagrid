import React, { Component } from "react";
import { createUseStyles } from "react-jss";
import { Checkbox, Icon, Table } from "semantic-ui-react";

import TableCell from "./tableCell";

class TableRow extends Component<Object> {
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
      input, data, cellComponent: CellComponent, columnModel, titleFormatter,
    } = this.props;
    const renderData = input ? input.value : data;
    return (
      <Table.Cell colSpan={columnModel.get().length}>
        <CellComponent
          titleFormatter={titleFormatter}
          {...renderData}
          columnModel={columnModel.get()}
        />
      </Table.Cell>
    );
  }

  render() {
    const {
      data,
      cellComponent,
      editable,
      editIndividualRows,
      bulkEdit,
      startEditingContent,
      removeContent,
      classes,
      updateGridState,
      toggleSelect,
      selectedRecords,
    } = this.props;
    return (
      <Table.Row>
        {editable && bulkEdit && (
          <Table.Cell collapsing verticalAlign="top">
            <div className={classes.buttonWrapper}>
              <Checkbox
                className={classes.checkbox}
                checked={selectedRecords.includes(data.reduxFormIndex)}
                onChange={() => {
                  toggleSelect(data.reduxFormIndex);
                  updateGridState();
                }}
              />
            </div>
          </Table.Cell>
        )}
        {!cellComponent
          ? this.buildRowCells()
          : this.buildCustomizedCell()}
        {editable && editIndividualRows && (
          <Table.Cell collapsing verticalAlign="top">
            <div className={classes.buttonWrapper}>
              <Icon className={classes.button} link name="pencil" onClick={() => startEditingContent(data.reduxFormIndex)} />
              <Icon className={classes.button} link name="trash" onClick={() => removeContent(data.reduxFormIndex)} />
            </div>
          </Table.Cell>
        )}
      </Table.Row>
    );
  }
}

const styles = {
  buttonWrapper: {
    padding: "0.5em 0 !important",
  },
  button: {
    margin: "0 0.25em !important",
  },
  checkbox: {
    verticalAlign: "middle !important",
  },
};

export default (props) => (
  <TableRow {...props} classes={createUseStyles(styles)()} />
);

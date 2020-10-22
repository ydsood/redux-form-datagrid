import React, { Component } from "react";
import { createUseStyles } from "react-jss";
import { Button, Checkbox, Table } from "semantic-ui-react";
import { RequiredFieldValidator } from "./datagridField/DefaultFormField";

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

      let isError = false;
      if (column.meta) {
        const currentValidators = column.meta.validators || [];
        if (column.meta.required) {
          currentValidators.push(RequiredFieldValidator);
        }

        currentValidators.forEach((validate) => {
          if (validate(data[dataIndex])) {
            isError = true;
          }
        });
      }

      return (
        <Table.Cell key={key} negative={isError}>
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
      input, data, cellComponent: CellComponent, columnModel, subsections, titleFormatter,
    } = this.props;
    const renderData = input ? input.value : data;

    const colModel = columnModel.get();

    return (
      <Table.Cell colSpan={colModel.length}>
        <CellComponent
          titleFormatter={titleFormatter}
          {...renderData}
          columnModel={colModel}
          subsections={subsections}
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
      columnModel,
    } = this.props;

    let isError = false;
    if (cellComponent) {
      columnModel.get().forEach((column) => {
        if (column.meta) {
          const currentValidators = column.meta.validators || [];
          if (column.meta.required) {
            currentValidators.push(RequiredFieldValidator);
          }

          currentValidators.forEach((validate) => {
            if (validate(data[column.dataIndex])) {
              isError = true;
            }
          });
        }
      });
    }

    return (
      <Table.Row negative={isError}>
        {editable && bulkEdit && (
          <Table.Cell collapsing verticalAlign="top">
            <div className={classes.checkboxWrapper}>
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
            <Button basic circular icon="pencil" onClick={() => startEditingContent(data.reduxFormIndex)} />
            <Button basic circular icon="trash" onClick={() => removeContent(data.reduxFormIndex)} />
          </Table.Cell>
        )}
      </Table.Row>
    );
  }
}

const styles = {
  checkboxWrapper: {
    padding: "0.5em 0 !important",
  },
  checkbox: {
    verticalAlign: "middle !important",
  },
};

export default (props) => (
  <TableRow {...props} classes={createUseStyles(styles)()} />
);

import React, { Component } from "react";
import { createUseStyles } from "react-jss";
import { Button, Checkbox, Table } from "semantic-ui-react";
import { RequiredFieldValidator } from "./datagridField/DefaultFormField";
import { applyFieldResolvers } from "./util";

import TableCell from "./tableCell";

class TableRow extends Component<Object> {

  constructor(props: Props) {
    super(props);

    this.handleRowClick = this.handleRowClick.bind(this);
  }

  gerResolvedColumns = (columnModel, renderData) => {
    return applyFieldResolvers(columnModel.get(), renderData);
  }

  isErrorOnColumn = (column) => {
    const { data } = this.props;

    let isError = false;

    const { dataIndex } = column;
    if (column.meta) {
      const currentValidators = column.meta.validators || [];
      if (!column.meta.hidden && column.meta.required && !currentValidators.includes(RequiredFieldValidator)) {
        currentValidators.push(RequiredFieldValidator);
      }

      currentValidators.forEach((validate) => {
        if (validate(data[dataIndex])) {
          isError = true;
        }
      });
    }

    return isError;
  };

  handleRowClick = () => {
    const { onRowClick, data } = this.props;
    if (onRowClick) {
      onRowClick(data);
    }
  }

  buildRowCells() {
    const {
      input, editable, data, name, columnModel, basic, classes,
    } = this.props;
    const renderData = input ? input.value : data;
    const colModel = this.gerResolvedColumns(columnModel, renderData);
    const cells = colModel.map((column) => {
      const cellNamePrefix = input ? input.name : name;
      const { dataIndex } = column;
      const value = renderData[dataIndex];
      const key = `${cellNamePrefix}.${column.dataIndex}`;

      return (
        <Table.Cell key={key} negative={this.isErrorOnColumn(column)} className={basic === "very" ? classes.veryBasicGrid : ""}>
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
      subsections, titleFormatter, classes, basic,
    } = this.props;
    const renderData = input ? input.value : data;
    const colModel = this.gerResolvedColumns(columnModel, renderData);

    return (
      <Table.Cell colSpan={colModel.length} className={basic === "very" ? classes.veryBasicGrid : ""}>
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
      isSelected,
      columnModel,
      input,
      basic,
      onRowClick,
    } = this.props;

    const renderData = input ? input.value : data;

    const colModel = this.gerResolvedColumns(columnModel, renderData);

    let isError = false;
    if (cellComponent) {
      colModel.forEach((column) => {
        if (this.isErrorOnColumn(column)) {
          isError = true;
        }
      });
    }

    return (
      <Table.Row
        negative={isError}
        onClick={() => this.handleRowClick()}
        className={`${basic === "very" ? classes.veryBasicGrid : ""} ${onRowClick ? classes.dataGridRow : ""}`}
      >
        {editable && bulkEdit && (
          <Table.Cell collapsing verticalAlign="top" className={basic === "very" ? classes.veryBasicGrid : ""}>
            <div className={classes.checkboxWrapper}>
              <Checkbox
                className={classes.checkbox}
                checked={isSelected}
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
          <Table.Cell collapsing verticalAlign="top" className={basic === "very" ? classes.veryBasicGrid : ""}>
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
  veryBasicGrid: {
    borderLeft: "none !important",
    background: "#fff !important",
  },
  dataGridRow: {
    background: "#fff !important",
    "&:hover": {
      transform: "scale(1, 1.1)",
      boxShadow: "2px 0px 4px #d4d4d5",
      zIndex: 2,
      cursor: "pointer",
    },
  },
};

export default (props) => (
  <TableRow {...props} classes={createUseStyles(styles)()} />
);

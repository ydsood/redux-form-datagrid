import React, { Component } from "react";
import { Table, Segment } from "semantic-ui-react";
import buildGrid from "../gridHOC";
import TableRow from "../tableRow";

type StaticDatagridProps = {
  data: Array<Object>,
  error: *,
  columnModel: Function,
  subsections: Array<Object>,
  editable: boolean,
  editIndividualRows: boolean,
  bulkEdit: boolean,
  buildTitleBar: Function,
  buildTableHeaders: Function,
  buildTableFooter: Function,
  titleFormatter: Function,
  noDataComponent?: Component<*>,
  cellComponent?: Component<*>,
  name: string,
  hidden?: boolean,
  startEditingContent: Function,
  removeContent: Function,
  toggleSelect: Function,
  updateGridState: Function,
  basic: string,
  onRowClick: Function,
};

class StaticDatagrid extends Component<StaticDatagridProps> {
  buildTableRows() {
    const {
      data,
      columnModel,
      subsections,
      cellComponent,
      titleFormatter,
      editable,
      editIndividualRows,
      bulkEdit,
      startEditingContent,
      removeContent,
      toggleSelect,
      updateGridState,
      basic,
      onRowClick,
    } = this.props;
    return data.map((item) => {
      const name = `${this.props.name}[${item.reduxFormIndex}]`;
      return (
        <TableRow
          key={name}
          data={item}
          columnModel={columnModel}
          subsections={subsections}
          editable={editable}
          onRowClick={onRowClick}
          editIndividualRows={editIndividualRows}
          bulkEdit={bulkEdit}
          titleFormatter={titleFormatter}
          name={name}
          cellComponent={cellComponent}
          startEditingContent={startEditingContent}
          removeContent={removeContent}
          toggleSelect={toggleSelect}
          isSelected={!!item.reduxFormIsSelected}
          updateGridState={updateGridState}
          basic={basic}
        />
      );
    });
  }

  buildTableBody() {
    const {
      data,
      columnModel,
      editable,
      editIndividualRows,
      bulkEdit,
      noDataComponent: NoDataComponent,
    } = this.props;

    let columnSpan = columnModel.get().length;
    if (editable && editIndividualRows) {
      columnSpan += 1;
    }
    if (editable && bulkEdit) {
      columnSpan += 1;
    }

    const emptyBody = (
      <Table.Row>
        <Table.Cell colSpan={columnSpan} textAlign="center">
          <NoDataComponent />
        </Table.Cell>
      </Table.Row>
    );
    const tableBody = !data || data.length === 0 ? emptyBody : this.buildTableRows();
    return <Table.Body>{tableBody}</Table.Body>;
  }

  render() {
    const {
      hidden,
      error,
      editable,
      bulkEdit,
      basic,
    } = this.props;
    const style = hidden ? { display: "none" } : {};
    const renderComponent = (
      <Segment basic>
        <div className="grid" style={style}>
          {this.props.buildTitleBar()}
          { error }
          <Table celled={basic !== "very"} basic={basic} sortable definition={editable && bulkEdit}>
            {this.props.buildTableHeaders()}
            {this.buildTableBody()}
            {this.props.buildTableFooter()}
          </Table>
        </div>
      </Segment>
    );
    return renderComponent;
  }
}

StaticDatagrid.defaultProps = {
  noDataComponent: null,
  cellComponent: null,
  hidden: null,
};

const foo = buildGrid(StaticDatagrid);
export default foo;

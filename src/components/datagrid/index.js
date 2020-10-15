import React, { Component } from "react";
import { Table, Segment } from "semantic-ui-react";
import buildGrid from "../gridHOC";
import TableRow from "../tableRow";

type StaticDatagridProps = {
  data: Array<Object>,
  error: *,
  columnModel: Function,
  editable: boolean,
  editIndividualRows: boolean,
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
};

class StaticDatagrid extends Component<StaticDatagridProps> {
  buildTableRows() {
    const {
      data,
      columnModel,
      cellComponent,
      titleFormatter,
      editIndividualRows,
      startEditingContent,
      removeContent,
    } = this.props;
    let rowNumber = 0;
    return data.map((item) => {
      rowNumber += 1;
      const name = `${this.props.name}[${rowNumber}]`;
      return (
        <TableRow
          key={name}
          data={item}
          columnModel={columnModel}
          editIndividualRows={editIndividualRows}
          titleFormatter={titleFormatter}
          name={name}
          cellComponent={cellComponent}
          startEditingContent={startEditingContent}
          removeContent={removeContent}
        />
      );
    });
  }

  buildTableBody() {
    const {
      data,
      columnModel,
      noDataComponent: NoDataComponent,
    } = this.props;

    const emptyBody = (
      <Table.Row>
        <Table.Cell colSpan={columnModel.get().length} textAlign="center">
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
      editIndividualRows,
    } = this.props;
    const style = hidden ? { display: "none" } : {};
    const renderComponent = (
      <Segment basic>
        <div className="grid" style={style}>
          {this.props.buildTitleBar()}
          { error }
          <Table celled definition={editable && editIndividualRows}>
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
import React, { Component } from 'react';
import { Table, Segment, Header } from 'semantic-ui-react';
import buildGrid from '../gridHOC';
import TableRow from '../tableRow';

type StaticDatagridProps = {
  data: Array<Object>,
  title: string,
  columnModel: Function,
  buildTableHeaders: Function,
  buildTableFooter: Function,
  noDataComponent?: Component<*>,
  cellComponent?: Component<*>,
  name: string
};

class StaticDatagrid extends Component<StaticDatagridProps> {
  buildTableRows() {
    const {
      data,
      columnModel,
      cellComponent,
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
          name={name}
          cellComponent={cellComponent}
        />
      );
    });
  }

  buildTableBody() {
    const { data, columnModel, noDataComponent: NoDataComponent } = this.props;

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
    const { cellComponent } = this.props;

    const renderComponent = (
      <Segment basic>
        <div className="grid">
          <Header as="h4">{`${this.props.title}`}</Header>
          <Table>
            {!cellComponent ? (
              this.props.buildTableHeaders()
            ) : (
              <div />
            )}
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
};

const foo = buildGrid(StaticDatagrid);
export default foo;

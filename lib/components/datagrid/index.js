import React, { Component } from 'react';
import { Table, Segment, Header } from 'semantic-ui-react';
import buildGrid from '../gridHOC';
import TableRow from '../tableRow';


type StaticDatagridProps = {
  data: Array<Object>,
  error: *,
  title: string,
  columnModel: Function,
  buildTableHeaders: Function,
  buildTableFooter: Function,
  titleFormatter: Function,
  noDataComponent?: Component<*>,
  cellComponent?: Component<*>,
  name: string,
  hidden?: boolean,
  editButtonLabel?: string,
};


class StaticDatagrid extends Component<StaticDatagridProps> {
  buildTableRows() {
    const {
      data,
      columnModel,
      cellComponent,
      titleFormatter,
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
          titleFormatter={titleFormatter}
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
    const { hidden, error } = this.props;
    const style = hidden ? { display: 'none' } : {};
    const renderComponent = (
      <Segment basic>
        <div className="grid" style={style}>
          { this.props.title && <Header as="h4">{`${this.props.title}`}</Header> }
          { error }
          <Table>
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

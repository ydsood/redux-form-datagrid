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
  name: string
};

class StaticDatagrid extends Component<StaticDatagridProps> {
  buildTableBody() {
    const { data, columnModel } = this.props;
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
        />
      );
    });
  }

  render() {
    const renderComponent = (
      <Segment>
        <div className="grid">
          <Header as="h4">{`${this.props.title}`}</Header>
          <Table>
            {this.props.buildTableHeaders()}
            <Table.Body>{this.buildTableBody()}</Table.Body>
            {this.props.buildTableFooter()}
          </Table>
        </div>
      </Segment>
    );
    return renderComponent;
  }
}

const foo = buildGrid(StaticDatagrid);
export default foo;

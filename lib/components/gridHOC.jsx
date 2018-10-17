// @flow
import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import type { StaticDatagrid } from './datagrid';
import ColumnModel from './columnModel';
import type { ColumnModelType } from './columnModel';
import { PaginationControls } from './plugins/pagination';
import { LocalStore, RemoteStore } from './store';
import type { LocalStore as LocalStoreType, RemoteStore as RemoteStoreType } from './store';

type Props = {
  data: Array<Object>,
  editable?: boolean,
  columnModel: Array<Object>,
  localStore?: boolean,
};

type State = {
  data: Array<Object>,
}

type StoreType = LocalStoreType | RemoteStore;
type UpdateStateFunctionType = (store: StoreType) => Array<Object>;

export default (Grid: StaticDatagrid) => class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.colModel = new ColumnModel(props.columnModel);
    this.buildTableHeaders = this.buildTableHeaders.bind(this);
    this.buildTableFooter = this.buildTableFooter.bind(this);
    this.updateGridState = this.updateGridState.bind(this);
    this.store = new LocalStore(props.data);
    this.state = { data: this.store.getData() };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data && this.props.localStore) {
      this.store.clear();
      this.store = new LocalStore(this.props.data);
    }
  }

  store: LocalStoreType | RemoteStoreType;

  updateGridState: Function;

  updateGridState(updateState: UpdateStateFunctionType) {
    const data = updateState(this.store);
    if (data && Array.isArray(data)) {
      this.setState({ data });
    }
  }

  buildTableHeaders: Function;

  buildTableHeaders() {
    return (
      <Table.Header>
        <Table.Row>
          {this.props.editable && <Table.HeaderCell />}
          {this.colModel
            .get()
            .map(item => (
              <Table.HeaderCell key={item.dataIndex}>
                {item.name}
              </Table.HeaderCell>
            ))}
        </Table.Row>
      </Table.Header>
    );
  }

  buildTableFooter: Function;

  buildTableFooter() {
    const data = this.store.getData();
    return (
      <Table.Footer fullWidth>
        <Table.Row>
          <PaginationControls
            updateGridState={this.updateGridState}
            totalRecords={data && data.length}
            colSpan={this.colModel.get().length}
          />
        </Table.Row>
      </Table.Footer>
    );
  }

  colModel: ColumnModelType;

  render() {
    const { columnModel: _, data, ...rest } = this.props;
    return (
      <Grid
        columnModel={this.colModel}
        buildTableHeaders={this.buildTableHeaders}
        buildTableFooter={this.buildTableFooter}
        data={this.state.data}
        {...rest}
      />
    );
  }
};

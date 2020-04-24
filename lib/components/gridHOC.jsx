// @flow
import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import md5 from 'md5';
import _ from "lodash";
import { inspect } from "util";

import type { StaticDatagrid } from './datagrid';
import ColumnModel from './columnModel';
import type { ColumnModelType } from './columnModel';
import { PaginationControls } from './plugins/pagination';
import { EditControls } from './plugins/edit';
import { LocalStore, RemoteStore } from './store';
import type {
  LocalStore as LocalStoreType,
  RemoteStore as RemoteStoreType,
} from './store';

type Props = {
  data: Array<Object>,
  editable?: boolean,
  startEditingContent: Function,
  columnModel: Array<Object>,
  localStore?: boolean,
  pageSize: number,
  cellComponent: Component<*>,
  editButtonLabel:string,
};

type StoreType = LocalStoreType | RemoteStoreType;

type State = {
  store: StoreType,
  data: Array<Object>
};

type UpdateStateFunctionType = (store: StoreType) => Array<Object>;

const generateObjectArrayHash = (arr: Array<Object>) => md5(inspect(arr));

export default (Grid: StaticDatagrid) => class extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.colModel = new ColumnModel(props.columnModel);
    this.buildTableHeaders = this.buildTableHeaders.bind(this);
    this.buildTableFooter = this.buildTableFooter.bind(this);
    this.updateGridState = this.updateGridState.bind(this);
    this.state = {
      store: new LocalStore(this.props.data),
      data: this.props.data,
    };
  }

  componentDidMount() {
    this.setState({ store: new LocalStore(this.props.data) });
  }

  componentDidUpdate(prevProps:Props) {
    if (prevProps.data !== this.props.data) {
      if (this.state.store && this.state.store instanceof LocalStore) {
        this.state.store.clear();
        // eslint-disable-next-line
        this.setState({ store: new LocalStore(this.props.data) });
      }
    }

    if (!_.isEqual(prevProps.columnModel, this.props.columnModel)) {
      this.colModel = new ColumnModel(this.props.columnModel);
    }
  }

  componentWillUnmount() {
    this.state.store.clear();
    this.setState({});
  }

    updateGridState: Function;

    updateGridState(updateState: UpdateStateFunctionType) {
      const data = updateState(this.state.store);
      if (data && Array.isArray(data)) {
        this.setState({ data });
      }
    }

    buildTableHeaders: Function;

    buildTableHeaders() {
      return (
        <Table.Header>
          <Table.Row>
            {
              this.props.cellComponent
                ? <Table.HeaderCell colSpan={this.colModel.get().length} />
                : this.colModel.get().map(item => (
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
      const data = this.state.store.getData();
      const {
        editable, startEditingContent, editButtonLabel,
      } = this.props;
      return (
        <Table.Footer fullWidth>
          <Table.Row>
            {
              editable
              && (
              <EditControls
                startEditingContent={startEditingContent}
                editButtonLabel={editButtonLabel}
              />
              )
            }
            <PaginationControls
              key={generateObjectArrayHash(data)}
              updateGridState={this.updateGridState}
              totalRecords={data && data.length}
              colSpan={this.colModel.get().length}
              pageSize={this.props.pageSize}
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

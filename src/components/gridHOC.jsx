// @flow
import React, { Component } from "react";
import { Table, Icon } from "semantic-ui-react";
import md5 from "md5";
import _ from "lodash";
import { inspect } from "util";

import type { StaticDatagrid } from "./datagrid";
import ColumnModel from "./columnModel";
import type { ColumnModelType } from "./columnModel";
import { PaginationControls } from "./plugins/pagination";
import { SortingControls } from './plugins/sorting';
import { EditControls } from "./plugins/edit";
import { ExportControls } from "./plugins/export";
import { LocalStore } from "./store";
import type {
  LocalStore as LocalStoreType,
  RemoteStore as RemoteStoreType,
} from "./store";

type Props = {
  data: Array<Object>,
  editable: boolean,
  startEditingContent: Function,
  columnModel: Array<Object>,
  pageSize: number,
  cellComponent: Component<*>,
  editButtonLabel: string,
  exportable: boolean,
  exportButtonLabel: String,
  exportFileName: string,
};

type StoreType = LocalStoreType | RemoteStoreType;

type State = {
  store: StoreType,
  data: Array<Object>,
  activeColumn: String
};

type UpdateStateFunctionType = (store: StoreType) => Array<Object>;
type SortStateFunctionTypes = (...store: StoreType) => Array<Object>;

const generateObjectArrayHash = (arr: Array<Object>) => md5(inspect(arr));

export default (Grid: StaticDatagrid) => class GridHOC extends Component<Props, State> {
  updateGridState: Function;

  updateGridColumnState: Function;

  buildTableHeaders: Function;

  buildTableFooter: Function;

  colModel: ColumnModelType;

  constructor(props: Props) {
    super(props);
    this.colModel = new ColumnModel(props.columnModel);
    this.buildTableHeaders = this.buildTableHeaders.bind(this);
    this.buildTableFooter = this.buildTableFooter.bind(this);
    this.updateGridState = this.updateGridState.bind(this);
    this.updateGridColumnState = this.updateGridColumnState.bind(this);
    this.state = {
      store: new LocalStore(this.props.data),
      data: this.props.data,
      activeColumn: '',
    };
  }

  componentDidMount() {
    this.setState({ store: new LocalStore(this.props.data) });
  }

  componentDidUpdate(prevProps: Props) {
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

  updateGridState(updateState: UpdateStateFunctionType) {
    const data = updateState(this.state.store);
    if (data && Array.isArray(data)) {
      this.setState({ data });
    }
  }

  updateGridColumnState: Function;

  updateGridColumnState(columnName: any, isAscending: any, format: string, getValue: any, sortData: SortStateFunctionTypes) {
    const data = sortData(this.state.store, columnName, isAscending, format, getValue);
    if (data && Array.isArray(data)) {
      this.setState({ data });
    }
  }


  buildTableHeaders() {
    return (
      <Table.Header>
        <Table.Row>
          {
            this.props.cellComponent
              ? <Table.HeaderCell colSpan={this.colModel.get().length} />
              : this.colModel.get().map((item) => (
                <SortingControls
                  updateGridColumnState={(dataIndex, sortable, sortingType, getValue, sortData) => {
                    if (item.sortable !== undefined) {
                      item.sortable = !item.sortable;
                    }
                    this.setState({ activeColumn: dataIndex });
                    this.updateGridColumnState(dataIndex, sortable, sortingType, getValue, sortData);
                  }}
                  dataIndex={item.dataIndex}
                  sortable={item.sortable}
                  sortingType={item.sortingType}
                  activeColumn={this.state.activeColumn}
                  getValue={item.getValue}
                  name={item.name}
                />
              ))
          }
        </Table.Row>
      </Table.Header>
    );
  }

  buildTableFooter() {
    const data = this.state.store.getData();
    const {
      editable,
      startEditingContent,
      editButtonLabel,
      exportable,
      exportButtonLabel,
      exportFileName,
      columnModel
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
          {
            exportable
            && (
              <ExportControls
                data={data}
                exportFileName={exportFileName}
                exportButtonLabel={exportButtonLabel}
                columnModel={columnModel}
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

  render() {
    const { columnModel, data, ...rest } = this.props;
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

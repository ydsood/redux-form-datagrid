// @flow
import React, { Component } from "react";
import {
  Header, Table, Grid as SemanticGrid,
} from "semantic-ui-react";
import md5 from "md5";
import _ from "lodash";
import { inspect } from "util";

import type { StaticDatagrid } from "./datagrid";
import ColumnModel from "./columnModel";
import type { ColumnModelType } from "./columnModel";
import { PaginationControls } from "./plugins/pagination";
import { SortingControls } from "./plugins/sorting";
import { EditControls } from "./plugins/edit";
import { ExportControls } from "./plugins/export";
import { LocalStore } from "./store";
import type {
  LocalStore as LocalStoreType,
  RemoteStore as RemoteStoreType,
} from "./store";
import { SearchBar } from "./plugins/search";

type Props = {
  data: Array<Object>,
  editable: boolean,
  editIndividualRows: boolean,
  title: String,
  searchable: boolean,
  searchPlaceholder: String,
  startEditingContent: Function,
  addContent: Function,
  removeContent: Function,
  columnModel: Array<Object>,
  pageSize: number,
  cellComponent: Component<*>,
  editButtonLabel: string,
  addButtonLabel: string,
  exportable: boolean,
  exportButtonLabel: String,
  exportFileName: string,
};

type StoreType = LocalStoreType | RemoteStoreType;

type State = {
  store: StoreType,
  filteredData: Array<Object>,
  sortedData: Array<Object>,
  renderedData: Array<Object>,
  activeColumn: String,
};

type UpdateStateFunctionType = (data: Array<Object>) => Array<Object>;
type SortStateFunctionTypes = (...data: Array<Object>) => Array<Object>;
type FilterStateFunctionTypes = (...data: Array<Object>) => Array<Object>;

const generateObjectArrayHash = (arr: Array<Object>) => md5(inspect(arr));

const includeReduxFormIndex = (arr: Array<Object>) => arr.map((item, index) => ({
  ...item,
  reduxFormIndex: index,
}));

export default (Grid: StaticDatagrid) => class GridHOC extends Component<Props, State> {
  updateGridState: Function;

  updateGridColumnState: Function;

  filterBySearch: Function;

  buildTitleBar: Function;

  buildTableHeaders: Function;

  buildTableFooter: Function;

  colModel: ColumnModelType;

  constructor(props: Props) {
    super(props);
    this.colModel = new ColumnModel(props.columnModel);
    this.buildTitleBar = this.buildTitleBar.bind(this);
    this.buildTableHeaders = this.buildTableHeaders.bind(this);
    this.buildTableFooter = this.buildTableFooter.bind(this);
    this.updateGridState = this.updateGridState.bind(this);
    this.filterBySearch = this.filterBySearch.bind(this);
    this.updateGridColumnState = this.updateGridColumnState.bind(this);
    this.state = {
      store: new LocalStore(includeReduxFormIndex(this.props.data)),
      filteredData: this.props.data,
      sortedData: this.props.data,
      renderedData: this.props.data,
      activeColumn: "",
    };
  }

  componentDidMount() {
    this.setState({ store: new LocalStore(includeReduxFormIndex(this.props.data)) });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data !== this.props.data) {
      if (this.state.store && this.state.store instanceof LocalStore) {
        this.state.store.clear();
        // eslint-disable-next-line
        this.setState({ store: new LocalStore(includeReduxFormIndex(this.props.data)) });
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
    let data = this.state.store.getData();
    if (this.state.activeColumn) {
      data = this.state.sortedData;
    } else if (this.props.searchable) {
      data = this.state.filteredData;
    }

    const renderedData = updateState(data);
    if (renderedData && Array.isArray(renderedData)) {
      this.setState({ renderedData });
    }
  }

  updateGridColumnState(
    isAscending: any,
    sortData: SortStateFunctionTypes,
  ) {
    let data = this.state.store.getData();
    if (this.props.searchable) {
      data = this.state.filteredData;
    }

    if (this.state.activeColumn) {
      data = sortData(data, isAscending);
    }

    if (data && Array.isArray(data)) {
      this.setState({ sortedData: data });
    }
  }

  filterBySearch(
    columnFilters: Array<Object>,
    inputValue: String,
    filterData: FilterStateFunctionTypes,
  ) {
    const { searchable } = this.props;

    let data = this.state.store.getData();
    if (searchable) {
      data = filterData(data, columnFilters, inputValue);
    }

    if (data && Array.isArray(data)) {
      this.setState({ filteredData: data });
    }
  }

  buildTitleBar() {
    const {
      title, searchable, searchPlaceholder, columnModel,
    } = this.props;
    const data = this.state.store.getData();

    const searchByTagColumns = columnModel.filter((column) => column.searchByTag);

    return (
      <SemanticGrid columns="equal">
        <SemanticGrid.Column verticalAlign="middle">
          {title && <Header as="h4" floated="left">{`${title}`}</Header>}
        </SemanticGrid.Column>
        {searchable && (
          <SemanticGrid.Column verticalAlign="middle">
            <SearchBar
              gridData={data}
              columnModel={columnModel}
              columns={searchByTagColumns}
              placeholder={searchPlaceholder}
              filter={this.filterBySearch}
            />
          </SemanticGrid.Column>
        )}
      </SemanticGrid>
    );
  }

  buildTableHeaders() {
    let data = this.state.store.getData();
    if (this.props.searchable) {
      data = this.state.filteredData;
    }

    return !this.props.cellComponent && (
      <Table.Header>
        <Table.Row>
          {this.props.editIndividualRows && (
            <Table.HeaderCell />
          )}
          {
            this.colModel.get().map((item) => (
              <SortingControls
                dataHash={generateObjectArrayHash(data)}
                updateGridColumnState={(dataIndex, isAscending, sortData) => {
                  this.setState({ activeColumn: dataIndex });
                  this.updateGridColumnState(isAscending, sortData);
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
    const {
      editable,
      editIndividualRows,
      startEditingContent,
      addContent,
      editButtonLabel,
      addButtonLabel,
      searchable,
      exportable,
      exportButtonLabel,
      exportFileName,
      columnModel,
    } = this.props;

    let data = this.state.store.getData();
    if (this.state.activeColumn) {
      data = this.state.sortedData;
    } else if (searchable) {
      data = this.state.filteredData;
    }

    return (
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell colSpan={this.colModel.get().length + (editIndividualRows ? 1 : 0)}>
            {
              editable
              && (
                <EditControls
                  editIndividualRows={editIndividualRows}
                  startEditingContent={startEditingContent}
                  editButtonLabel={editButtonLabel}
                  addContent={addContent}
                  addButtonLabel={addButtonLabel}
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
              dataHash={generateObjectArrayHash(data)}
              updateGridState={this.updateGridState}
              totalRecords={data.length}
              pageSize={this.props.pageSize}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  render() {
    return (
      <Grid
        {...this.props}
        columnModel={this.colModel}
        buildTitleBar={this.buildTitleBar}
        buildTableHeaders={this.buildTableHeaders}
        buildTableFooter={this.buildTableFooter}
        data={this.state.renderedData}
      />
    );
  }
};

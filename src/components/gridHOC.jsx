// @flow
import React, { Component } from "react";
import {
  Header, Table, Grid as SemanticGrid,
} from "semantic-ui-react";
import _ from "lodash";

import type { StaticDatagrid } from "./datagrid";
import ColumnModel from "./columnModel";
import type { ColumnModelType } from "./columnModel";
import { PaginationControls, PaginationHandler } from "./plugins/pagination";
import { SortingControlHeader, SortingHandler } from "./plugins/sorting";
import { SearchBar, SearchHandler } from "./plugins/search";
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
  editIndividualRows: boolean,
  title: String,
  searchable: boolean,
  searchPlaceholder: String,
  startEditingContent: Function,
  addContent: Function,
  removeContent: Function,
  columnModel: Array<Object>,
  pageSize?: number,
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

const includeReduxFormIndex = (arr: Array<Object>) => arr.map((item, index) => ({
  ...item,
  reduxFormIndex: index,
}));

export default (Grid: StaticDatagrid) => {
  class GridHOC extends Component<Props, State> {
    colModel: ColumnModelType;

    paginationHandler: PaginationHandler;

    sortingHandler: SortingHandler;

    searchHandler: SearchHandler;

    buildTitleBar: Function;

    buildTableHeaders: Function;

    buildTableFooter: Function;

    updateGridState: Function;

    constructor(props: Props) {
      super(props);

      this.colModel = new ColumnModel(props.columnModel);
      this.paginationHandler = new PaginationHandler(props.pageSize);
      this.sortingHandler = new SortingHandler(props.columnModel);
      this.searchHandler = new SearchHandler(props.searchable, props.columnModel);

      this.buildTitleBar = this.buildTitleBar.bind(this);
      this.buildTableHeaders = this.buildTableHeaders.bind(this);
      this.buildTableFooter = this.buildTableFooter.bind(this);
      this.updateGridState = this.updateGridState.bind(this);

      this.state = {
        store: new LocalStore(includeReduxFormIndex(this.props.data)),
        renderedData: includeReduxFormIndex(this.props.data),
      };
    }

    componentDidMount() {
      this.setState({ store: new LocalStore(includeReduxFormIndex(this.props.data)) });
    }

    componentDidUpdate(prevProps: Props) {
      if (prevProps.data !== this.props.data) {
        if (this.state.store && this.state.store instanceof LocalStore) {
          this.state.store.clear();

          const newData = includeReduxFormIndex(this.props.data);

          // eslint-disable-next-line
          this.setState({
            store: new LocalStore(newData),
            renderedData: this.paginationHandler.getCurrentPage(
              this.sortingHandler.sortData(
                this.searchHandler.filterData(
                  newData,
                ),
              ),
            ),
          });
        }
      }

      if (!_.isEqual(prevProps.columnModel, this.props.columnModel)) {
        this.colModel = new ColumnModel(this.props.columnModel);
      }
    }

    componentWillUnmount() {
      this.state.store.clear();
    }

    updateGridState() {
      this.setState((prevState) => ({
        renderedData: this.paginationHandler.getCurrentPage(
          this.sortingHandler.sortData(
            this.searchHandler.filterData(
              prevState.store.getData(),
            ),
          ),
        ),
      }));
    }

    buildTitleBar() {
      const {
        title, searchable, searchPlaceholder,
      } = this.props;

      const data = this.state.store.getData();

      return (
        <SemanticGrid columns="equal">
          <SemanticGrid.Column verticalAlign="middle">
            {title && <Header as="h4" floated="left">{`${title}`}</Header>}
          </SemanticGrid.Column>
          {searchable && (
            <SemanticGrid.Column verticalAlign="middle">
              <SearchBar
                data={data}
                placeholder={searchPlaceholder}
                updateGridState={this.updateGridState}
                searchHandler={this.searchHandler}
              />
            </SemanticGrid.Column>
          )}
        </SemanticGrid>
      );
    }

    buildTableHeaders() {
      return !this.props.cellComponent && (
        <Table.Header>
          <Table.Row>
            {this.props.editIndividualRows && (
              <Table.HeaderCell />
            )}
            {this.colModel.get().map((column) => (column.sortable ? (
              <SortingControlHeader
                key={column.dataIndex}
                sortingHandler={this.sortingHandler}
                updateGridState={this.updateGridState}
                column={column}
              />
            ) : (
              <Table.HeaderCell key={column.dataIndex}>
                {column.name}
              </Table.HeaderCell>
            )))}
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
        exportable,
        exportButtonLabel,
        exportFileName,
        columnModel,
      } = this.props;

      const data = this.state.store.getData();

      return (
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan={this.colModel.get().length + (editIndividualRows ? 1 : 0)}>
              {editable && (
                <div style={{ float: "left" }}>
                  <EditControls
                    editIndividualRows={editIndividualRows}
                    startEditingContent={startEditingContent}
                    editButtonLabel={editButtonLabel}
                    addContent={addContent}
                    addButtonLabel={addButtonLabel}
                  />
                </div>
              )}
              {exportable && (
                <div style={{ float: "left" }}>
                  <ExportControls
                    data={data}
                    exportFileName={exportFileName}
                    exportButtonLabel={exportButtonLabel}
                    columnModel={columnModel}
                  />
                </div>
              )}
              <div style={{ float: "right" }}>
                <PaginationControls
                  paginationHandler={this.paginationHandler}
                  updateGridState={this.updateGridState}
                />
              </div>
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
  }

  GridHOC.defaultProps = {
    pageSize: 5,
  };

  return GridHOC;
};

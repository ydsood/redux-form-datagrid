// @flow
import React, { Component } from "react";
import {
  Header, Table, Grid as SemanticGrid,
} from "semantic-ui-react";
import _ from "lodash";

import { createUseStyles } from "react-jss";
import type { StaticDatagrid } from "./datagrid";
import ColumnModel from "./columnModel";
import type { ColumnModelType } from "./columnModel";
import { PaginationControls, PaginationHandler } from "./plugins/pagination";
import { SortingControlHeader, SortingHandler } from "./plugins/sorting";
import { SearchBar, SearchHandler } from "./plugins/search";
import { EditControls, EditHandler } from "./plugins/edit";
import { ExportControls } from "./plugins/export";
import { LocalStore } from "./store";
import type {
  LocalStore as LocalStoreType,
  RemoteStore as RemoteStoreType,
} from "./store";

type Props = {
  data: Array<Object>,
  formName: String,
  fieldName: String,
  editable: boolean,
  editIndividualRows: boolean,
  bulkEdit: boolean,
  title: String,
  searchable: boolean,
  searchPlaceholder: String,
  startEditingContent: Function,
  addContent: Function,
  removeContent: Function,
  removeMultiple: Function,
  columnModel: Array<Object>,
  pageSize?: number,
  cellComponent: Component<*>,
  editButtonLabel: string,
  editButtonAriaLabel: String,
  bulkEditButtonLabel: string,
  bulkDeleteButtonLabel: string,
  selectAllButtonLabel: string,
  selectAllFilteredButtonLabel: string,
  unselectAllButtonLabel: string,
  addButtonLabel: string,
  exportable: boolean,
  exportButtonLabel: String,
  exportFileName: string,
  basic: string,
  classes: Object,
  hideTableHeader: boolean,
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

    editHandler: EditHandler;

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
      this.editHandler = new EditHandler();

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

          if (this.props.bulkEdit) {
            this.editHandler.clearAllSelected();
          }

          // eslint-disable-next-line
          this.setState({
            store: new LocalStore(newData),
          });

          this.updateGridState();
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
              this.editHandler.applySelected(
                prevState.store.getData(),
              ),
            ),
          ),
        ),
      }));
    }

    buildTitleBar() {
      const {
        title, searchable, searchPlaceholder, basic,
      } = this.props;

      const data = this.state.store.getData();

      return (
        <SemanticGrid columns="equal">
          {basic !== "very" && title && (
            <SemanticGrid.Column verticalAlign="middle">
              <Header as="h4" floated="left">{`${title}`}</Header>
            </SemanticGrid.Column>
          )}
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
      const {
        classes,
        basic,
        hideTableHeader,
      } = this.props;
      return !hideTableHeader && (
        <Table.Header>
          <Table.Row>
            {this.props.editable && this.props.bulkEdit && (
              <Table.HeaderCell />
            )}
            {this.colModel.get().filter((item) => !item.meta?.hidden).map((column) => (column.sortable ? (
              <SortingControlHeader
                key={column.dataIndex}
                sortingHandler={this.sortingHandler}
                updateGridState={this.updateGridState}
                column={column}
                basic={basic}
                classes={classes}
              />
            ) : (
              <Table.HeaderCell key={column.dataIndex} style={{ width: column.width }} className={basic === "very" ? classes.veryBasicGrid : ""}>
                {column.name}
              </Table.HeaderCell>
            )))}
            {this.props.editable && this.props.editIndividualRows && (
              <Table.HeaderCell />
            )}
          </Table.Row>
        </Table.Header>
      );
    }

    buildTableFooter() {
      const {
        formName,
        fieldName,
        editable,
        editIndividualRows,
        bulkEdit,
        startEditingContent,
        addContent,
        removeMultiple,
        editButtonLabel,
        editButtonAriaLabel,
        bulkEditButtonLabel,
        bulkDeleteButtonLabel,
        selectAllButtonLabel,
        selectAllFilteredButtonLabel,
        unselectAllButtonLabel,
        addButtonLabel,
        exportable,
        exportButtonLabel,
        exportFileName,
        columnModel,
        classes,
        basic,
      } = this.props;

      const data = this.state.store.getData();

      let columnSpan = this.colModel.get().length;
      if (editable && editIndividualRows) {
        columnSpan += 1;
      }
      if (editable && bulkEdit) {
        columnSpan += 1;
      }

      const style = basic === "very" ? { background: "#fff" } : {};

      return (
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan={columnSpan} style={style}>
              {editable && (
                <div className={classes.footerButtons}>
                  <EditControls
                    editIndividualRows={editIndividualRows}
                    bulkEdit={bulkEdit}
                    startEditingContent={startEditingContent}
                    editButtonLabel={editButtonLabel}
                    editButtonAriaLabel={editButtonAriaLabel}
                    bulkEditButtonLabel={bulkEditButtonLabel}
                    bulkDeleteButtonLabel={bulkDeleteButtonLabel}
                    selectAllButtonLabel={selectAllButtonLabel}
                    selectAllFilteredButtonLabel={selectAllFilteredButtonLabel}
                    unselectAllButtonLabel={unselectAllButtonLabel}
                    addContent={addContent}
                    removeMultiple={removeMultiple}
                    addButtonLabel={addButtonLabel}
                    editHandler={this.editHandler}
                    selectableData={this.paginationHandler.data}
                    isFiltered={(
                      !!this.searchHandler.tagsList.length || !!this.searchHandler.inputValue
                    )}
                    updateGridState={this.updateGridState}
                    columnModel={this.colModel.get()}
                    formName={formName}
                    fieldName={fieldName}
                  />
                </div>
              )}
              {exportable && (
                <div className={classes.footerButtons}>
                  <ExportControls
                    data={data}
                    exportFileName={exportFileName}
                    exportButtonLabel={exportButtonLabel}
                    columnModel={columnModel}
                  />
                </div>
              )}
              <div className={basic === "very" ? classes.centerFooterPagination : classes.footerPagination}>
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
          toggleSelect={this.editHandler.toggleSelect}
          updateGridState={this.updateGridState}
        />
      );
    }
  }

  GridHOC.defaultProps = {
    pageSize: 5,
  };

  const styles = {
    footerButtons: {
      float: "left !important",
      marginRight: "0.25em !important",
      marginTop: "12px !important",
    },
    footerPagination: {
      float: "right !important",
      margin: "0.5em 0 !important",
    },
    centerFooterPagination: {
      margin: "0.5em 0 !important",
      textAlign: "center",
    },
    veryBasicGrid: {
      borderLeft: "none !important",
      background: "#fff !important",
    },
    dataGrid: {
      overflowX: "overlay",
      overflowY: "hidden",
      paddingBottom: "20px",
    },
    footerTable: {
      border: "none !important",
      marginTop: "0 !important",
    },
  };

  return (props) => (
    <GridHOC {...props} classes={createUseStyles(styles)()} />
  );
};

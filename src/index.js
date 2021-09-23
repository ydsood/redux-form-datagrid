import React, { Component } from "react";
import type { ComponentType } from "react";
import StaticDatagrid from "./components/datagrid";

export { default as DatagridField } from "./components/datagridField";

export type column = {
  dataIndex: string,
  name: string,
  editor?: ComponentType<*>,
  singleField?: boolean,
  order: number,
  meta?: {
    required: boolean,
    label: string,
    entity: string
  }
};

export { SearchBar } from "./components/plugins/search";
export type { SearchBarProps } from "./components/plugins/search";

type metaData = {
  hidden?: boolean,
  disabled?: boolean,
}

export type DataGridProps = {
  data: Array<Object> | void,
  title: string,
  columnModel: Array<column>,
  name: string,
  noDataComponent?: Component<*>,
  cellComponent?: Component<*>,
  localStore?: boolean,
  pageSize?: number,
  meta?: metaData
};

function DataGrid(props: DataGridProps) {
  return (
    <StaticDatagrid {...props} />
  );
}

DataGrid.defaultProps = {
  noDataComponent: null,
  cellComponent: null,
  localStore: true,
  pageSize: 5,
  meta: null,
};

export default DataGrid;

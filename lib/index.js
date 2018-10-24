import React, { Component } from 'react';
import type { ComponentType } from 'react';
import md5 from 'md5';
import StaticDatagrid from './components/datagrid';
import 'babel-polyfill';

export type column = {
  dataIndex: string,
  name: string,
  editor?: ComponentType<*>,
  order: number,
  meta?: {
    required: boolean,
    label: string,
    entity: string
  },
};

export type DataGridProps = {
  data: Array<Object> | void,
  title: string,
  columnModel: Array<column>,
  name: string,
  noDataComponent?: Component<*>,
  localStore?: boolean,
  pageSize?: number,
};

function DataGrid(props: DataGridProps) {
  const {
    data, title, columnModel, name, noDataComponent, localStore, pageSize,
  } = props;
  return (
    <StaticDatagrid
      data={data}
      title={title}
      columnModel={columnModel}
      name={name}
      noDataComponent={noDataComponent}
      localStore={localStore}
      pageSize={pageSize}
    />
  );
}

DataGrid.defaultProps = {
  noDataComponent: null,
  localStore: true,
  pageSize: 5,
};

export default DataGrid;

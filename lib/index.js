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
  noDataComponent?: Component<*>
};

function DataGrid(props: DataGridProps) {
  const {
    data, title, columnModel, name, noDataComponent,
  } = props;
  const key = md5(data);
  return (
    <StaticDatagrid
      key={key}
      data={data}
      title={title}
      columnModel={columnModel}
      name={name}
      noDataComponent={noDataComponent}
    />
  );
}

DataGrid.defaultProps = {
  noDataComponent: null,
};

export default DataGrid;

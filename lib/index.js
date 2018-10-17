import React, { Component } from 'react';
import type { ComponentType } from 'react';
import StaticDatagrid from './components/datagrid';

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
  getData?: Function,
  columnModel: Array<column>,
  name: string,
  noDataComponent?: Component<*>
};

function DataGrid(props: DataGridProps) {
  const {
    data, getData, title, columnModel, name, noDataComponent,
  } = props;

  return (
    <StaticDatagrid
      data={data}
      getData={getData}
      title={title}
      columnModel={columnModel}
      name={name}
      noDataComponent={noDataComponent}
    />
  );
}

DataGrid.defaultProps = {
  getData: undefined,
  noDataComponent: null,
};

export default DataGrid;

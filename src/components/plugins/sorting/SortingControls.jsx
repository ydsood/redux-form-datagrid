import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import SortingHandler from './SortingHandler';
import Icon from '../../../elements/icons';


type Props = {
  updateGridColumnState: (Function) => void,
  dataIndex: String,
  sortable: Boolean,
  sortingType: String,
  getValue: Function,
  name: String,
  activeColumn: String
}

class SortingControls extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.SortingHandler = new SortingHandler();
  }

  SortingHandler: SortingHandler

  render() {
    const {
      updateGridColumnState, dataIndex, sortable, sortingType, getValue, name, activeColumn,
    } = this.props;
    return (
      <Table.HeaderCell
        key={dataIndex}
        onClick={() => {
          if (sortable !== undefined) {
            updateGridColumnState(dataIndex, sortable, sortingType,
              getValue, this.SortingHandler.sortData);
          }
        }}
        className={sortable !== undefined ? 'tableHeader' : ''}
      >
        {name}
        {dataIndex === activeColumn
          ? (
            <Icon
              link
              name={sortable ? 'caret up' : 'caret down'}
            />
          ) : ''}
      </Table.HeaderCell>
    );
  }
}


export default SortingControls;

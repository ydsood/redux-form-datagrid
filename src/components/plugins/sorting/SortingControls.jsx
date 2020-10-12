import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import SortingHandler from "./SortingHandler";
import Icon from "../../../elements/icons";

type Props = {
  dataHash: String,
  updateGridColumnState: (Function) => void,
  dataIndex: String,
  sortable: Boolean,
  sortingType: String,
  getValue: Function,
  name: String,
  activeColumn: String
}

type State = {
  isAscending: Boolean,
}

class SortingControls extends Component<Props, State> {
  SortingHandler: SortingHandler

  constructor(props: Props) {
    super(props);

    this.SortingHandler = new SortingHandler(props.dataIndex, props.sortingType, props.getValue);

    this.state = {
      isAscending: false,
    };
  }

  componentDidUpdate(prevProps) {
    const {
      updateGridColumnState, dataHash, dataIndex, activeColumn,
    } = this.props;

    if ((dataHash !== prevProps.dataHash) && (activeColumn === dataIndex)) {
      updateGridColumnState(this.SortingHandler.sortData, dataIndex, this.state.isAscending);
    }
  }

  render() {
    const {
      updateGridColumnState, dataIndex, sortable, name, activeColumn,
    } = this.props;
    return (
      <Table.HeaderCell
        key={dataIndex}
        onClick={sortable && (() => {
          this.setState((prevState) => ({ isAscending: !prevState.isAscending }));
          updateGridColumnState(this.SortingHandler.sortData, dataIndex, !this.state.isAscending);
        })}
        className={sortable ? "tableHeader" : ""}
      >
        {name}
        {dataIndex === activeColumn
          ? (
            <Icon
              link
              name={this.state.isAscending ? "caret up" : "caret down"}
            />
          ) : ""}
      </Table.HeaderCell>
    );
  }
}

export default SortingControls;

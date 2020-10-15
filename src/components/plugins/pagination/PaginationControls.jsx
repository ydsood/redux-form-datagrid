import React, { Component, Fragment } from "react";
import PaginationHandler from "./PaginationHandler";
import Icon from "../../../elements/icons";

type Props = {
  dataHash: String,
  updateGridState: (Function) => void,
  pageSize: number,
  totalRecords: number,
}

class PaginationControls extends Component<Props> {
  paginationHandler: PaginationHandler

  constructor(props: Props) {
    super(props);
    this.paginationHandler = new PaginationHandler(props.pageSize);
  }

  componentDidMount() {
    const { updateGridState } = this.props;
    updateGridState(this.paginationHandler.firstPage);
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataHash !== prevProps.dataHash) {
      const { updateGridState } = this.props;
      updateGridState(this.paginationHandler.currentPage);
    }
  }

  render() {
    const { updateGridState, totalRecords } = this.props;
    return (
      <div style={{ float: "right" }}>
        {totalRecords ? (
          <Fragment>
            {this.paginationHandler.getFirstRecordPosition()
              >= this.paginationHandler.state.pageSize ? (
                <Icon
                  link
                  name="angle double left"
                  onClick={() => updateGridState(this.paginationHandler.firstPage)}
                />
              ) : ""}
            {this.paginationHandler.getFirstRecordPosition()
              >= this.paginationHandler.state.pageSize ? (
                <Icon
                  link
                  name="angle left"
                  onClick={() => updateGridState(this.paginationHandler.prev)}
                />
              ) : ""}
            <span>
              {this.paginationHandler.getFirstRecordPosition()}
              - {this.paginationHandler.getLastRecordPosition()}
            </span>
            <span> of </span>
            <span>{totalRecords}</span>
            {this.paginationHandler.state.pageEnd < this.props.totalRecords ? (
              <Icon
                link
                name="angle right"
                onClick={() => updateGridState(this.paginationHandler.next)}
              />
            ) : ""}
            {this.paginationHandler.state.pageEnd < this.props.totalRecords ? (
              <Icon
                link
                name="angle double right"
                onClick={() => updateGridState(this.paginationHandler.lastPage)}
              />
            ) : ""}
          </Fragment>
        ) : null}
      </div>
    );
  }
}

export default PaginationControls;

import React, { Fragment } from "react";
import { Icon } from "semantic-ui-react";

import PaginationHandler from "./PaginationHandler";

type Props = {
  paginationHandler: PaginationHandler,
  updateGridState: (Function) => void,
};

const PaginationControls = ({
  paginationHandler,
  updateGridState,
}: Props) => (paginationHandler.data.length && (
  <Fragment>
    {!paginationHandler.isOnFirstPage() && (
      <Icon
        link
        name="angle double left"
        onClick={() => {
          paginationHandler.moveToFirstPage();
          updateGridState();
        }}
      />
    )}
    {!paginationHandler.isOnFirstPage() && (
      <Icon
        link
        name="angle left"
        onClick={() => {
          paginationHandler.moveToPreviousPage();
          updateGridState();
        }}
      />
    )}
    <span>
      {`${paginationHandler.getFirstRecordPosition()} - ${paginationHandler.getLastRecordPosition()}`}
    </span>
    <span> of </span>
    <span>{paginationHandler.data.length}</span>
    {!paginationHandler.isOnLastPage() && (
      <Icon
        link
        name="angle right"
        onClick={() => {
          paginationHandler.moveToNextPage();
          updateGridState();
        }}
      />
    )}
    {!paginationHandler.isOnLastPage() && (
      <Icon
        link
        name="angle double right"
        onClick={() => {
          paginationHandler.moveToLastPage();
          updateGridState();
        }}
      />
    )}
  </Fragment>
));

export default PaginationControls;

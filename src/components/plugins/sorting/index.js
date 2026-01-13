// @flow
import SortingControlHeader from "./SortingControlHeader";
import SortingHandler from "./SortingHandler";
import RemoteSortingHandler from "./RemoteSortingHandler";

const GetSortingHandler = (
  mode: "remote" | "local",
  columnModel: Array<Object>,
  options?: Object,
) => {
  if (mode === "remote") {
    return new RemoteSortingHandler(columnModel, options);
  }

  return new SortingHandler(columnModel, options);
};

export {
  SortingControlHeader,
  GetSortingHandler,
};

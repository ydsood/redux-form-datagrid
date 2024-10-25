// @flow
import SortingControlHeader from "./SortingControlHeader";
import SortingHandler from "./SortingHandler";
import RemoteSortingHandler from "./RemoteSortingHandler";

const GetSortingHandler = (mode: "remote" | "local", columnModel: Array<Object>) => {
  if (mode === "remote") {
    return new RemoteSortingHandler(columnModel);
  }

  return new SortingHandler(columnModel);
};

export {
  SortingControlHeader,
  GetSortingHandler,
};

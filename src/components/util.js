import _ from "lodash";

export const applyFieldResolvers = (columnModel, rowData) => columnModel.map((column) => {
  const colModelCopy = _.cloneDeep(columnModel);
  const { fieldMetaResolver = [] } = column;
  let meta = column.meta || {};

  for (let i = 0; i < fieldMetaResolver.length; i += 1) {
    const fieldResolver = fieldMetaResolver[i];

    if (typeof fieldResolver === "function") {
      meta = fieldResolver(colModelCopy, rowData, column.dataIndex) || meta;
    }
  }

  return {
    ...column,
    meta,
  };
});

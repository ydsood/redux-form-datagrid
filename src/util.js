import _ from "lodash";

// eslint-disable-next-line
export function chunkConditional(array, size, predicate) {
  if (!predicate || typeof predicate !== "function") {
    return _.chunk(array, size);
  }
  const length = array ? array.length : 0;
  if (!length || size < 1) {
    return [];
  }

  const result = [];
  let index = 0;
  while (index < length) {
    const slice = _.slice(array, index, index + size);
    const terminationIndex = _.findIndex(slice, predicate);
    if (terminationIndex >= 0) {
      const firstSlice = _.dropRight(slice, Math.min(size, slice.length) - terminationIndex);
      if (firstSlice.length > 0) {
        result.push(firstSlice);
      }
      result.push([slice[terminationIndex]]);
      index = index + terminationIndex + 1;
    } else {
      result.push(slice);
      index += size;
    }
  }
  return result;
}

export function buildVariableSizeFieldSection(fields) {
  const groupedItems = [];
  let currentRowWidth = 0;

  fields.forEach((field) => {
    if (field.meta?.hidden) {
      return;
    }

    const fieldWidth = field.meta && field.meta.width ? field.meta.width : 16;

    if (currentRowWidth === 0 || currentRowWidth + fieldWidth > 16) {
      currentRowWidth = fieldWidth;
      groupedItems.push([field]);
    } else {
      currentRowWidth += fieldWidth;
      groupedItems[groupedItems.length - 1].push(field);
    }
  });

  return groupedItems;
}

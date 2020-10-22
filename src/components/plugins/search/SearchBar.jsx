import React from "react";
import { createUseStyles } from "react-jss";
import { Dropdown } from "semantic-ui-react";
import _ from "lodash";

import SearchHandler from "./SearchHandler";
import SearchTagOption from "./SearchTagOption";

type Props = {
  data: Array<Object>,
  placeholder?: String,
  searchHandler: SearchHandler,
  updateGridState: Function,
};

const useStyles = createUseStyles({
  hiddenOption: {
    display: "none !important",
  },
  searchIcon: {
    paddingTop: "0.65em !important",
  },
});

const SearchBar = ({
  data,
  placeholder,
  searchHandler,
  updateGridState,
}: Props) => {
  const { inputValue, tagsList, columnModel } = searchHandler;
  const classes = useStyles();

  const columns = columnModel.filter((column) => column.searchByTag);

  const filteredOptionsData = columns.map((key) => {
    const columnData = {};
    const obj = columns.filter((object) => object.dataIndex === key.dataIndex);
    columnData.label = obj[0].name;
    columnData.value = obj[0].dataIndex;
    columnData.key = key.dataIndex;
    columnData.formatter = key.formatter;

    const columnValues = data.map((record) => ((
      record[key.dataIndex] !== null
      && record[key.dataIndex] !== undefined
      && key.formatter
    ) ? key.formatter(record[key.dataIndex]) : record[key.dataIndex]))
      .filter((columnValue) => columnValue);

    columnData.resultValues = _.uniq(columnValues);

    return columnData;
  });

  const listItems = filteredOptionsData
    .map((item) => item.resultValues && item.resultValues.map((resultValue) => ({
      key: `${item.value}_${resultValue}`,
      text: `${item.label}: ${resultValue}`,
      value: `${item.value}_${resultValue}`,
      className: tagsList.map((tag) => tag.dataIndex).includes(item.value)
        ? classes.hiddenOption
        : undefined,
      content: (
        <SearchTagOption label={item.label} value={resultValue} />
      ),
      onClick: () => {
        searchHandler.selectedListOption(
          resultValue, item.label, item.value, item.formatter,
        );
        updateGridState();
      },
    })))
    .reduce((prev, curr) => prev.concat(curr), []);

  const tagItems = tagsList.map((item) => `${item.dataIndex}_${item.text}`);

  return (
    <Dropdown
      icon={{
        name: "search",
        className: classes.searchIcon,
      }}
      placeholder={placeholder}
      fluid
      multiple
      search
      selection
      scrolling
      onSearchChange={(event) => {
        searchHandler.updateInputValue(event.target?.value);
        updateGridState();
      }}
      onFocus={(event) => {
        searchHandler.updateInputValue(event.target?.value);
        updateGridState();
      }}
      searchQuery={inputValue}
      noResultsMessage={null}
      options={listItems}
      value={tagItems}
      renderLabel={(item) => ({
        content: item.text,
        onRemove: (event, tagData) => {
          searchHandler.removeTag(tagData);
          updateGridState();
        },
      })}
    />
  );
};

SearchBar.defaultProps = {
  placeholder: "Search",
};

export default SearchBar;

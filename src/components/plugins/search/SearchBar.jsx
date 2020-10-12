import React, { Component, Fragment } from "react";
import _ from "lodash";

import { Dropdown, Label } from "semantic-ui-react";
import SearchHandler from "./SearchHandler";

export type SearchBarProps = {
  columnModel: Array<Object>,
  columns: Array<Object>,
  gridData: Array,
  filter: Function,
  placeholder?: String,
  classes: Object,
}

class Search extends Component<SearchBarProps> {
  constructor(props) {
    super(props);

    this.SearchHandler = new SearchHandler(props.columnModel);

    this.state = {
      inputValue: "",
      tagsList: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.gridData !== prevProps.gridData) {
      const { tagsList, inputValue } = this.state;
      this.props.filter(tagsList, inputValue, this.SearchHandler.filterData);
    }
  }

  selectedListOption = (value, label, item, formatter) => {
    const { tagsList } = this.state;

    const tag = {
      text: value,
      dataIndex: item,
      colLabel: label,
      formatter,
    };

    const tags = _.cloneDeep(tagsList);
    tags.push(tag);
    this.setState({
      tagsList: tags,
      inputValue: "",
    });
    this.props.filter(tags, "", this.SearchHandler.filterData);
  };

  removeTag = (event, data) => {
    const { tagsList, inputValue } = this.state;

    const [dataIndex] = data.value.split("_");

    const tags = _.filter(tagsList, (obj) => obj.dataIndex !== dataIndex);
    this.setState({ tagsList: tags });
    this.props.filter(tags, inputValue, this.SearchHandler.filterData);
  }

  prepareFilterTagOptions = () => {
    const { columns, gridData, classes } = this.props;
    const { tagsList } = this.state;
    const filteredOptionsData = columns.map((key) => {
      const columnData = {};
      const obj = columns.filter((object) => object.dataIndex === key.dataIndex);
      columnData.label = obj[0].name;
      columnData.value = obj[0].dataIndex;
      columnData.key = key.dataIndex;
      columnData.formatter = key.formatter;
      const columnValues = gridData.map((record) => {
        const recordTextValue = (record[key.dataIndex] !== null) && (
          (key.formatter && key.formatter(record[key.dataIndex]))
          || record[key.dataIndex]
        );

        return recordTextValue;
      }).filter((columnValue) => columnValue);

      columnData.resultValues = _.uniq(columnValues);

      return columnData;
    });

    return filteredOptionsData
      .map((item) => item.resultValues && item.resultValues.map((resultValue) => ({
        key: `${item.value}_${resultValue}`,
        text: `${item.label}: ${resultValue}`,
        value: `${item.value}_${resultValue}`,
        className: tagsList.map((tag) => tag.dataIndex).includes(item.value)
          ? classes.hiddenOption
          : undefined,
        content: (
          <Fragment>
            <Label content={item.label} />
            {resultValue}
          </Fragment>
        ),
        onClick: () => this.selectedListOption(resultValue, item.label, item.value, item.formatter),
      })))
      .reduce((prev, curr) => prev.concat(curr), []);
  }

  onInputChange = (event) => {
    const { value } = event.target;
    const { tagsList } = this.state;
    if (value) {
      this.setState({ inputValue: value });
      this.props.filter(tagsList, value, this.SearchHandler.filterData);
    } else {
      this.setState({ inputValue: "" });
      this.props.filter(tagsList, "", this.SearchHandler.filterData);
    }
  };

  render() {
    const {
      inputValue, tagsList,
    } = this.state;
    const { placeholder, classes } = this.props;

    const listItems = this.prepareFilterTagOptions();

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
        onSearchChange={this.onInputChange}
        onFocus={this.onInputChange}
        searchQuery={inputValue}
        noResultsMessage={null}
        options={listItems}
        value={tagItems}
        renderLabel={(item) => ({
          content: item.text,
          onRemove: this.removeTag,
        })}
      />
    );
  }
}

Search.defaultProps = {
  placeholder: "Search",
};

export default Search;

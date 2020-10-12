import React, { Component } from "react";
import _ from "lodash";

import SearchHandler from "./SearchHandler";

export type SearchBarProps = {
  columnModel: Array<Object>,
  columns: Array<Object>,
  gridData: Array,
  matchCount?: Number,
  filter: Function,
  placeholder: String,
  classes: Object,
}

class Search extends Component<SearchBarProps> {
  constructor(props) {
    super(props);

    this.SearchHandler = new SearchHandler(props.columnModel);

    this.state = {
      filterOptions: [],
      inputValue: "",
      tagsList: [],
      showFilterOptions: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.gridData !== prevProps.gridData) {
      const { tagsList, inputValue } = this.state;
      this.props.filter(this.SearchHandler.filterData, tagsList, inputValue);
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
      filterOptions: [],
      showFilterOptions: false,
    });
    this.props.filter(this.SearchHandler.filterData, tags);
  };

  removeTag = (tag) => {
    const { tagsList, inputValue } = this.state;
    const tags = _.filter(tagsList, (obj) => obj.text !== tag.text);
    this.setState({ tagsList: tags });
    this.props.filter(this.SearchHandler.filterData, tags, inputValue);
  }

  onInputClearTag = (event) => {
    const keyCode = event.which || event.keyCode;
    const { tagsList, inputValue } = this.state;
    if (keyCode === 8 && inputValue.length === 0 && tagsList.length > 0) {
      const tags = _.cloneDeep(tagsList);
      tags.pop();
      this.setState({ tagsList: tags });
      this.props.filter(this.SearchHandler.filterData, tags);
    }
  }

  prepareFilteredData = (input) => {
    const { columns, gridData, matchCount } = this.props;
    const { tagsList } = this.state;
    const filteredOptionsData = [];
    let showFilterOptions = false;
    const keys = _.differenceBy(columns, tagsList, "dataIndex");
    keys.forEach((key) => {
      const columnData = {};
      const obj = columns.filter((object) => object.dataIndex === key.dataIndex);
      columnData.label = obj[0].name;
      columnData.value = obj[0].dataIndex;
      columnData.key = key.dataIndex;
      columnData.formatter = key.formatter;
      const columnValues = [];
      const count = matchCount || 10;

      gridData.map((record) => {
        const recordTextValue = record[key.dataIndex] && (
          (key.formatter && key.formatter(record[key.dataIndex]))
          || record[key.dataIndex]
        );

        if (
          columnValues.length < count
          && recordTextValue
          && recordTextValue.trim().toLowerCase().startsWith(input.toLowerCase())
        ) {
          columnValues.push(recordTextValue);
        }
        return columnValues;
      });
      columnData.resultValues = _.uniq(columnValues);

      showFilterOptions = showFilterOptions || !!columnData.resultValues.length;

      filteredOptionsData.push(columnData);
    });
    this.setState({ filterOptions: filteredOptionsData, showFilterOptions });
  }

  onInputChange = (event) => {
    const { value } = event.target;
    const { columns } = this.props;
    const { tagsList } = this.state;
    if (value) {
      this.setState({ inputValue: value });

      if (!columns || columns.length !== tagsList.length) {
        this.prepareFilteredData(value);
      }

      this.props.filter(this.SearchHandler.filterData, tagsList, value);
    } else {
      this.setState({ filterOptions: [], inputValue: "", showFilterOptions: false });
      this.props.filter(this.SearchHandler.filterData, tagsList, "");
    }
  };

  createRightColum = ({
    resultValues, label, value, formatter,
  }) => {
    const view = resultValues.map((item) => (
      <span
        role="presentation"
        key={item}
        className={this.props.classes.columnList}
        onClick={() => this.selectedListOption(item, label, value, formatter)}
      >
        {item}
      </span>
    ));
    return view;
  }

  render() {
    const {
      filterOptions, inputValue, tagsList, showFilterOptions,
    } = this.state;
    const { placeholder, classes } = this.props;

    const listItems = filterOptions.map((item) => {
      if (item.resultValues && item.resultValues.length) {
        return (
          <div key={item.value} className={classes.leftRightColumn}>
            <div className={classes.leftColumn}>{item.label}</div>
            <div className={classes.rightColumn}>
              {this.createRightColum(item)}
            </div>
          </div>
        );
      }
      return "";
    });

    const tagItems = tagsList.length ? tagsList.map((item) => (
      <span className={classes.tag} key={item.text}>
        {item.colLabel}:{item.text}
        <span
          className={classes.close}
          role="presentation"
          onClick={() => this.removeTag(item)}
        >
          X
        </span>
      </span>
    )) : "";

    return (
      <div className={classes.searchContainer}>
        <div className={classes.inputContainer}>
          {tagItems}
          <input
            placeholder={placeholder || "Search"}
            onChange={this.onInputChange}
            onFocus={this.onInputChange}
            onBlur={() => this.setState({ showFilterOptions: false })}
            onKeyDown={this.onInputClearTag}
            className={classes.inputField}
            value={inputValue}
          />
        </div>
        <div
          className={classes.dropDownContainer}
          role="presentation"
          style={{ display: showFilterOptions ? "" : "none" }}
          onMouseDown={(event) => event.preventDefault()}
        >
          {listItems}
        </div>
      </div>
    );
  }
}

Search.defaultProps = {
  matchCount: 5,
};

export default Search;

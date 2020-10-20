// @flow

export default class SearchHandler {
  inputValue: String;

  tagsList: Array<Object>;

  enabled: Boolean;

  columnModel: Array<Object>;

  selectedListOption: Function;

  removeTag: Function;

  updateInputValue: Function;

  filterData: Function;

  constructor(enabled: Boolean, columnModel: Array<Object>) {
    this.inputValue = "";
    this.tagsList = [];

    this.enabled = enabled;
    this.columnModel = columnModel;

    this.selectedListOption = this.selectedListOption.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.filterData = this.filterData.bind(this);
  }

  selectedListOption = (value, label, item, formatter) => {
    const { tagsList } = this;

    tagsList.push({
      text: value,
      dataIndex: item,
      colLabel: label,
      formatter,
    });

    this.inputValue = "";
  };

  removeTag = (tagValue) => {
    const { tagsList } = this;

    const [dataIndex] = tagValue.split("_");

    this.tagsList = tagsList.filter((obj) => obj.dataIndex !== dataIndex);
  }

  updateInputValue = (value) => {
    if (value) {
      this.inputValue = value;
    } else {
      this.inputValue = "";
    }
  };

  filterData(data: Array<Object>): Array<Object> {
    const {
      columnModel, inputValue, tagsList, enabled,
    } = this;

    if (!enabled) {
      return data;
    }

    let gridData = data;
    if (tagsList && tagsList.length) {
      tagsList.forEach((element) => {
        gridData = gridData.filter((item) => {
          const recordTextValue = (
            item[element.dataIndex] !== null
            && item[element.dataIndex] !== undefined
            && element.formatter
          ) ? element.formatter(item[element.dataIndex]) : item[element.dataIndex];

          return recordTextValue && recordTextValue === element.text;
        });
      });
    }

    const searchByTextColumns = columnModel.filter(
      (column) => column.searchByText || column.searchByTag,
    );
    if (searchByTextColumns.length && inputValue && inputValue !== "") {
      gridData = gridData.filter((item) => {
        for (let i = 0; i < searchByTextColumns.length; i += 1) {
          const column = searchByTextColumns[i];

          const recordTextValue = (
            item[column.dataIndex] !== null
            && item[column.dataIndex] !== undefined
            && column.formatter
          ) ? column.formatter(item[column.dataIndex]) : item[column.dataIndex];

          if (
            recordTextValue
            && recordTextValue.toLowerCase().includes(inputValue.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      });
    }

    return gridData;
  }
}

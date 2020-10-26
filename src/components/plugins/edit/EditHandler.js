// @flow
import _ from "lodash";

export default class EditHandler {
  selectedRecords: Array<Number>;

  toggleSelect: Function;

  select: Function;

  unselect: Function;

  clearAllSelected: Function;

  constructor() {
    this.selectedRecords = [];

    this.toggleSelect = this.toggleSelect.bind(this);
    this.select = this.select.bind(this);
    this.unselect = this.unselect.bind(this);
    this.clearAllSelected = this.clearAllSelected.bind(this);
  }

  toggleSelect(index) {
    if (this.selectedRecords.includes(index)) {
      this.selectedRecords = this.selectedRecords.filter((record) => record !== index);
    } else {
      this.selectedRecords.push(index);
    }
  }

  select(...indices) {
    this.selectedRecords = _.union(this.selectedRecords, indices);
  }

  unselect(...indices) {
    this.selectedRecords = _.difference(this.selectedRecords, indices);
  }

  clearAllSelected() {
    this.selectedRecords = [];
  }
}

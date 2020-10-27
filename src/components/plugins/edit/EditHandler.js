// @flow

export default class EditHandler {
  selectedRecords: Array<Number>;

  toggleSelect: Function;

  select: Function;

  unselect: Function;

  clearAllSelected: Function;

  constructor() {
    this.selectedRecords = {};

    this.toggleSelect = this.toggleSelect.bind(this);
    this.select = this.select.bind(this);
    this.unselect = this.unselect.bind(this);
    this.clearAllSelected = this.clearAllSelected.bind(this);
  }

  toggleSelect(index) {
    this.selectedRecords[index] = !this.selectedRecords[index];
  }

  select(...indices) {
    indices.forEach((index) => {
      this.selectedRecords[index] = true;
    });
  }

  unselect(...indices) {
    indices.forEach((index) => {
      this.selectedRecords[index] = false;
    });
  }

  clearAllSelected() {
    this.selectedRecords = {};
  }

  applySelected(data: Array<Object>) {
    return data.map((record) => ({
      ...record,
      reduxFormIsSelected: this.selectedRecords[record.reduxFormIndex],
    }));
  }
}

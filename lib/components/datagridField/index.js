// @flow
import React, { Fragment } from 'react';
import type { FieldArrayProps } from 'redux-form';
import type { column } from '../columnModel';
import DataGrid from '../datagrid';
import FormFieldModal from './FormFieldModal';

type DatagridProps = {
  columnModel: Array<column>,
}

class DatagridField extends React.Component<FieldArrayProps & DatagridProps, *> {
  constructor(props: FieldArrayProps & DatagridProps) {
    super(props);
    this.state = { addingContent: false };
    this.doneEditingContent = this.doneEditingContent.bind(this);
    this.startEditingContent = this.startEditingContent.bind(this);
    this.addContent = this.addContent.bind(this);
    this.removeContent = this.removeContent.bind(this);
  }

  buildDataFromFields() {
    const { fields } = this.props;
    return fields.getAll() || [];
  }

  doneEditingContent: Function;

  doneEditingContent() {
    this.setState({ addingContent: false });
  }

  startEditingContent: Function;

  startEditingContent() {
    this.setState({ addingContent: true });
  }

  addContent: Function;

  addContent() {
    const { fields, columnModel } = this.props;
    if (!fields || !fields.push) {
      throw Error(`Incorrect fields prop passed to FieldArray renderer component: ${JSON.stringify(fields)}`);
    } else {
      const newItem = columnModel
        .map(x => x.dataIndex)
        .reduce((acc, curr) => {
          acc[curr] = undefined;
          return acc;
        }, {});
      fields.push(newItem);
    }
  }

  removeContent: Function;

  removeContent(index: number) {
    const { fields } = this.props;
    fields.remove(index);
  }

  render() {
    const data = this.buildDataFromFields();
    const { addingContent } = this.state;
    const { fields, columnModel } = this.props;
    return (
      <Fragment>
        <DataGrid
          {...this.props}
          editable
          data={data}
          startEditingContent={this.startEditingContent}
        />
        <FormFieldModal
          columnModel={columnModel}
          fields={fields}
          open={addingContent}
          doneEditingContent={this.doneEditingContent}
          addContent={this.addContent}
          removeContent={this.removeContent}
        />
      </Fragment>
    );
  }
}

export default DatagridField;

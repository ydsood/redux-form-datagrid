// @flow
import React, { Fragment } from 'react';
import type { FieldArrayProps } from 'redux-form';
import { Message } from 'semantic-ui-react';
import type { column } from '../columnModel';
import DataGrid from '../datagrid';
import FormFieldModal from './FormFieldModal';

type DatagridProps = {
  columnModel: Array<column>,
  disabled?: boolean,
  addButtonLabel?: string,
  doneButtonLabel?: string,
}

class DatagridField extends React.Component<FieldArrayProps & DatagridProps, *> {
  static defaultProps: *;

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
    const { fields } = this.props;
    const data = fields.getAll();
    if (data && data.length === 1) {
      const record = fields.get(0);
      if (typeof record === 'object' && Object.keys(record).every(key => !record[key])) {
        this.removeContent(0);
      } else if (!record && record !== 0) {
        this.removeContent(0);
      }
    }
    this.setState({ addingContent: false });
  }

  startEditingContent: Function;

  startEditingContent() {
    const { fields } = this.props;
    const data = fields.getAll();
    if (!data || data.length < 1) {
      this.addContent();
    }
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
    const {
      fields, columnModel, disabled, meta: { error, warning }, addButtonLabel, doneButtonLabel,
    } = this.props;
    const errorBlock = ((error && <Message error content={error} />)
      || (warning && <Message warning content={warning} />));
    return (
      <Fragment>
        <DataGrid
          {...this.props}
          editable={!disabled}
          data={data}
          startEditingContent={this.startEditingContent}
          error={errorBlock}
        />
        <FormFieldModal
          addButtonLabel={addButtonLabel}
          doneButtonLabel={doneButtonLabel}
          columnModel={columnModel}
          fields={fields}
          open={addingContent}
          doneEditingContent={this.doneEditingContent}
          addContent={this.addContent}
          removeContent={this.removeContent}
          error={errorBlock}
        />
      </Fragment>
    );
  }
}

DatagridField.defaultProps = {
  disabled: false,
  addButtonLabel: undefined,
  doneButtonLabel: undefined,
};

export default DatagridField;

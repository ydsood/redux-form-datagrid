// @flow
import React, { Fragment } from "react";
import type { FieldArrayProps } from "redux-form";
import { Message } from "semantic-ui-react";
import type { column } from "../columnModel";
import DataGrid from "../datagrid";
import FormFieldModal from "./FormFieldModal";

type DatagridProps = {
  columnModel: Array<column>,
  subsections: Array<Object>,
  editIndividualRows?: boolean,
  bulkEdit?: boolean,
  disabled?: boolean,
  addButtonLabel?: string,
  doneButtonLabel?: string,
  onChange?: Function,
}

class DatagridField extends React.Component<FieldArrayProps & DatagridProps, *> {
  doneEditingContent: Function;

  startEditingContent: Function;

  addContent: Function;

  removeContent: Function;

  removeMultiple: Function;

  constructor(props: FieldArrayProps & DatagridProps) {
    super(props);
    this.state = { addingContent: false, currentFieldIndex: -1 };
    this.doneEditingContent = this.doneEditingContent.bind(this);
    this.startEditingContent = this.startEditingContent.bind(this);
    this.addContent = this.addContent.bind(this);
    this.removeContent = this.removeContent.bind(this);
    this.removeMultiple = this.removeMultiple.bind(this);
  }

  componentDidUpdate(prevProps: FieldArrayProps & DatagridProps) {
    const { onChange, fields } = this.props;

    if (fields !== prevProps.fields) {
      onChange(fields.getAll());
    }
  }

  buildDataFromFields() {
    const { fields } = this.props;
    return fields.getAll() || [];
  }

  doneEditingContent() {
    const { fields } = this.props;
    const data = fields.getAll();
    if (data && data.length === 1) {
      const record = fields.get(0);
      if (typeof record === "object" && Object.keys(record).every((key) => !record[key])) {
        this.removeContent(0);
      } else if (!record && record !== 0) {
        this.removeContent(0);
      }
    }
    this.setState({ addingContent: false, currentFieldIndex: -1 });
  }

  startEditingContent(index: number) {
    const { fields } = this.props;
    const data = fields.getAll();
    let currentFieldIndex = index;
    if (index == null) {
      if (!data || data.length < 1) {
        this.addContent();
        currentFieldIndex = 0;
      } else {
        currentFieldIndex = -1;
      }
    }

    this.setState({ addingContent: true, currentFieldIndex });
  }

  addContent() {
    const { fields, columnModel } = this.props;
    if (!fields || !fields.push) {
      throw Error(`Incorrect fields prop passed to FieldArray renderer component: ${JSON.stringify(fields)}`);
    } else {
      const newItem = columnModel
        .map((x) => x.dataIndex)
        .reduce((acc, curr) => {
          acc[curr] = undefined;
          return acc;
        }, {});
      fields.push(newItem);

      this.startEditingContent(fields.length);
    }
  }

  removeContent(index: number) {
    const { fields } = this.props;
    fields.remove(index);
  }

  removeMultiple(...indices) {
    const { fields } = this.props;

    const keptFields = fields.getAll().filter((field, i) => !indices.includes(i));

    // Known redux-form bug that fields.splice doesn't work properly,
    // so have to do this in two operations.
    // https://github.com/redux-form/redux-form/issues/1758
    fields.removeAll();
    keptFields.forEach((field, i) => fields.insert(i, field));
  }

  render() {
    const data = this.buildDataFromFields();
    const { addingContent, currentFieldIndex } = this.state;
    const {
      fields,
      columnModel,
      subsections,
      disabled,
      editIndividualRows,
      bulkEdit,
      meta: { error, warning },
      addButtonLabel,
      doneButtonLabel,
    } = this.props;
    const errorBlock = ((error && <Message role="alert" error content={error} />)
      || (warning && <Message role="alert" warning content={warning} />));

    return (
      <Fragment>
        <DataGrid
          {...this.props}
          editable={!disabled}
          editIndividualRows={editIndividualRows}
          bulkEdit={bulkEdit}
          data={data}
          startEditingContent={this.startEditingContent}
          addContent={this.addContent}
          removeContent={this.removeContent}
          removeMultiple={this.removeMultiple}
          addButtonLabel={addButtonLabel}
          error={errorBlock}
          fieldName={fields.name}
        />
        <FormFieldModal
          addButtonLabel={addButtonLabel}
          doneButtonLabel={doneButtonLabel}
          columnModel={columnModel}
          subsections={subsections}
          fields={fields}
          editIndividualRows={editIndividualRows}
          open={addingContent}
          currentFieldIndex={currentFieldIndex}
          doneEditingContent={this.doneEditingContent}
          addContent={this.addContent}
          removeContent={this.removeContent}
        />
      </Fragment>
    );
  }
}

DatagridField.defaultProps = {
  disabled: false,
  editIndividualRows: false,
  bulkEdit: false,
  addButtonLabel: undefined,
  doneButtonLabel: undefined,
  onChange: () => {},
};

export default DatagridField;

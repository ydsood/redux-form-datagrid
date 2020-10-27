import React from "react";
import {
  Button, Divider, Dropdown, Form, Modal,
} from "semantic-ui-react";
import { change, clearFields, formValueSelector } from "redux-form";
import _ from "lodash";

import { connect } from "react-redux";
import DefaultFormField from "../../datagridField/DefaultFormField";

type Props = {
  open: Boolean,
  onClose: Function,
  columnModel: Array<Object>,
  selectedRecords: Array<Number>,
  formName: String,
  fieldName: String,
  change: Function,
  clearFields: Function,
  values: Object,
};

type State = {
  fields: Array<Object>,
};

class BulkEditModal extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      fields: [],
    };
  }

  cancel = () => {
    const {
      onClose,
      formName,
      fieldName,
      clearFields: clearFieldValues,
    } = this.props;

    this.setState({ fields: [] });
    clearFieldValues(formName, false, false, `${fieldName}_BULKEDIT`);
    onClose();
  }

  submit = () => {
    const {
      onClose,
      selectedRecords,
      formName,
      fieldName,
      change: changeFormValue,
      clearFields: clearFieldValues,
      values,
    } = this.props;
    const { fields } = this.state;

    selectedRecords.forEach(
      (i) => fields.forEach(
        (field) => changeFormValue(
          formName,
          `${fieldName}[${i}].${field.value}`,
          values[field.value],
        ),
      ),
    );

    this.setState({ fields: [] });
    clearFieldValues(formName, false, false, `${fieldName}_BULKEDIT`);
    onClose();
  }

  renderDropdown = () => {
    const {
      columnModel,
    } = this.props;
    const { fields } = this.state;

    return (
      <Dropdown
        placeholder="Select fields to edit..."
        fluid
        multiple
        search
        selection
        scrolling
        value={fields.map((field) => field.value)}
        options={columnModel.filter((column) => !column.meta?.hidden).map((column) => ({
          key: column.dataIndex,
          text: column.name,
          value: column.dataIndex,
          onClick: (event, data) => this.setState((prevProps) => ({
            fields: [...prevProps.fields, data],
          })),
        }))}
        renderLabel={(item) => ({
          content: item.text,
          onRemove: (event, data) => this.setState((prevProps) => ({
            fields: prevProps.fields.filter((field) => field.value !== data.value),
          })),
        })}
      />
    );
  }

  renderField = (field) => {
    const {
      columnModel,
      fieldName,
    } = this.props;

    const fieldNameParts = fieldName ? fieldName.split(".") : [];
    const finalFieldName = (fieldNameParts.length > 0) ? fieldNameParts[fieldNameParts.length - 1] : "";

    const column = columnModel.find((c) => c.dataIndex === field.value);

    let fieldEditor = <div key={`${finalFieldName}_BULKEDIT.${column.dataIndex}`} />;

    const label = (column.meta && column.meta.label) || column.name;
    let columnProps = _.cloneDeep(column);
    let meta = columnProps.meta || {};
    delete columnProps.meta;
    meta = { ...meta, label, width: 16 };
    columnProps = { ...columnProps, props: meta };

    if (!column.editor) {
      fieldEditor = (
        <DefaultFormField
          {...columnProps}
          name={`${finalFieldName}_BULKEDIT.${column.dataIndex}`}
          width={16}
          key={`${finalFieldName}_BULKEDIT.${column.dataIndex}`}
        />
      );
    } else {
      const FieldComponent = column.editor;
      fieldEditor = (
        <FieldComponent
          {...columnProps}
          meta={{
            ...columnProps.props,
            width: 16,
          }}
          name={`${finalFieldName}_BULKEDIT.${column.dataIndex}`}
          width={16}
          key={`${finalFieldName}_BULKEDIT.${column.dataIndex}`}
        />
      );
    }

    return fieldEditor;
  }

  render() {
    const {
      open,
      onClose,
      selectedRecords,
    } = this.props;

    const { fields } = this.state;

    return (
      <Modal open={open} size="tiny" onClose={onClose}>
        <Modal.Content>
          <Form>
            {this.renderDropdown()}
            {(fields.length > 0) && <Divider />}
            {fields.map(this.renderField)}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={this.cancel}
            content="Cancel"
            negative
          />
          <Button
            onClick={this.submit}
            content={`Update ${selectedRecords.length} Records`}
            positive
            disabled={fields.length === 0}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  values: formValueSelector(ownProps.formName)(state, `${ownProps.fieldName}_BULKEDIT`),
});

export default connect(
  mapStateToProps,
  {
    change,
    clearFields,
  },
)(BulkEditModal);

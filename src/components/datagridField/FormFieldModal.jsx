// @flow
import React, { Fragment } from "react";
import {
  Form, Modal, Button, Segment, Label,
} from "semantic-ui-react";
import { Field } from "redux-form";
import _ from "lodash";
import { buildVariableSizeFieldSection } from "../../util";
import DefaultFormField, { RequiredFieldValidator } from "./DefaultFormField";

type Props = {
  fields: *,
  error: *,
  columnModel: Array<Object>,
  open: boolean,
  doneEditingContent: Function,
  addContent: Function,
  removeContent: Function,
  addButtonLabel?: string,
  doneButtonLabel?: string,
}

class FormFieldModal extends React.Component<Props> {
  buildFormFieldsModal(fieldName: string, index: number, fields: *) {
    const { columnModel, removeContent } = this.props;
    const chunkedColumnModel = buildVariableSizeFieldSection(columnModel);
    const fieldToRender = chunkedColumnModel.map((columns) => {
      const mappedFields = columns.map((item) => {
        let field = <div />;
        const label = (item.meta && item.meta.label) || item.name;
        let columnProps = _.cloneDeep(item);
        const { fieldMetaResolver = [] } = columnProps;
        const colModelCopy = _.cloneDeep(columnModel);
        let meta = columnProps.meta || {};
        delete columnProps.meta;

        for (let i = 0; i < fieldMetaResolver.length; i += 1) {
          const fieldResolver = fieldMetaResolver[i];

          if (typeof fieldResolver === "function") {
            meta = fieldResolver(colModelCopy, fields.get(index), item.dataIndex) || meta;
          }
        }

        meta = { ...meta, label };
        columnProps = { ...columnProps, props: meta };

        if (!item.editor) {
          const required = item.meta && item.meta.required;
          const width = (item.meta && item.meta.width) || 16;
          let validate = [];
          if (required) {
            validate = [RequiredFieldValidator];
          }
          field = (
            <Field
              {...columnProps}
              name={`${fieldName}.${item.dataIndex}`}
              key={item.dataIndex}
              component={DefaultFormField}
              validate={validate}
              width={width}
            />
          );
        } else {
          const FieldComponent = item.editor;
          field = (
            <FieldComponent
              {...columnProps}
              meta={columnProps.props}
              name={`${fieldName}.${item.dataIndex}`}
              key={item.dataIndex}
            />
          );
        }
        return field;
      });

      const rowKey = columns.map((c) => c.dataIndex).join(",");
      return (
        <Form.Group key={rowKey}>
          { mappedFields }
        </Form.Group>
      );
    });

    return (
      <Segment key={fieldName} color="black">
        <Label as="a" icon="trash" color="red" ribbon="right" index={index} onClick={(event, data) => removeContent(data.index)} />
        {fieldToRender}
      </Segment>
    );
  }

  render() {
    const {
      fields, open, doneEditingContent, addContent, error, addButtonLabel, doneButtonLabel,
    } = this.props;
    const formFields = fields
      .map((fieldName, index) => this.buildFormFieldsModal(fieldName, index, fields));

    if (!open) {
      return (
        <Fragment>
          <Segment hidden>
            { formFields }
          </Segment>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <Modal
          open={open}
          closeOnEscape={false}
          closeOnDimmerClick={false}
          onClose={doneEditingContent}
        >
          <Modal.Content open={open}>
            { error }
            <Form>
              { formFields }
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={addContent}
              positive
              labelPosition="right"
              icon="plus"
              content={addButtonLabel}
            />
            <Button
              onClick={doneEditingContent}
              positive
              labelPosition="right"
              icon="checkmark"
              content={doneButtonLabel}
            />
          </Modal.Actions>
        </Modal>
      </Fragment>
    );
  }
}

FormFieldModal.defaultProps = {
  addButtonLabel: "Add",
  doneButtonLabel: "Done",
};

export default FormFieldModal;

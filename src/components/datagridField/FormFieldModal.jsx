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
  columnModel: Array<Object>,
  open: boolean,
  doneEditingContent: Function,
  addContent: Function,
  removeContent: Function,
  addButtonLabel?: string,
  doneButtonLabel?: string,
  currentFieldIndex: number,
  editIndividualRows: boolean,
}

class FormFieldModal extends React.Component<Props> {
  // eslint-disable-next-line class-methods-use-this
  applyFieldResolvers(columnModel, rowData) {
    return columnModel.map((column) => {
      const colModelCopy = _.cloneDeep(columnModel);
      const { fieldMetaResolver = [] } = column;
      let meta = column.meta || {};

      for (let i = 0; i < fieldMetaResolver.length; i += 1) {
        const fieldResolver = fieldMetaResolver[i];

        if (typeof fieldResolver === "function") {
          meta = fieldResolver(colModelCopy, rowData, column.dataIndex) || meta;
        }
      }

      return {
        ...column,
        meta,
      };
    });
  }

  buildFormFields(fieldName: string, index: number, fields: *) {
    const { columnModel } = this.props;
    const resolvedColumnModel = this.applyFieldResolvers(columnModel, fields.get(index));
    const chunkedColumnModel = buildVariableSizeFieldSection(resolvedColumnModel);

    return chunkedColumnModel.map((columns) => {
      const mappedFields = columns.map((item) => {
        let field = <div />;
        const label = (item.meta && item.meta.label) || item.name;
        let columnProps = _.cloneDeep(item);
        let meta = columnProps.meta || {};
        delete columnProps.meta;
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
  }

  render() {
    const {
      fields,
      open,
      doneEditingContent,
      addContent,
      addButtonLabel,
      doneButtonLabel,
      editIndividualRows,
      currentFieldIndex,
      removeContent,
    } = this.props;

    let formFields = null;
    if (!editIndividualRows) {
      formFields = fields.map((fieldName, index) => (
        <Segment key={fieldName} color="black">
          <Label as="a" icon="trash" color="red" ribbon="right" index={index} onClick={(event, data) => removeContent(data.index)} />
          {this.buildFormFields(fieldName, index, fields)}
        </Segment>
      ));
    } else if (currentFieldIndex > -1) {
      formFields = this.buildFormFields(
        fields.map((field) => field)[currentFieldIndex],
        currentFieldIndex,
        fields,
      );
    }

    return (
      <Fragment>
        <Modal
          open={open}
          closeOnEscape
          closeOnDimmerClick
          onClose={doneEditingContent}
        >
          <Modal.Content open={open}>
            <Form>
              { formFields }
            </Form>
          </Modal.Content>
          <Modal.Actions>
            {!editIndividualRows && (
              <Button
                onClick={addContent}
                positive
                labelPosition="right"
                icon="plus"
                content={addButtonLabel}
              />
            )}
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

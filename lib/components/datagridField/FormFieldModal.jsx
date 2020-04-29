// @flow
import React, { Fragment } from 'react';
import {
  Form, Modal, Button, Segment, Label,
} from 'semantic-ui-react';
import { Field } from 'redux-form';
import _ from 'lodash';
import { buildVariableSizeFieldSection } from '../../util';
import DefaultFormField, { RequiredFieldValidator } from './DefaultFormField';

type Props = {
  fields: *,
  error: *,
  columnModel: Array<Object>,
  open: boolean,
  doneEditingContent: Function,
  addContent: Function,
  removeContent: Function,
}

class FormFieldModal extends React.Component<Props> {
  buildFormFieldsModal(fieldName: string, index: number, fields: *) {
    const { columnModel, removeContent } = this.props;
    const chunkedColumnModel = buildVariableSizeFieldSection(columnModel);
    // chunkConditional(columnModel, 2, column => !!column.singleField);
    const fieldToRender = chunkedColumnModel.map((columns) => {
      const mappedFields = columns.map((item) => {
        let field = <div />;
        const label = (item.meta && item.meta.label) || item.name;
        let columnProps = _.cloneDeep(item);
        const { fieldMetaResolver = [] } = columnProps;
        let meta = columnProps.meta || {};
        delete columnProps.meta;

        for (let i = 0; i < fieldMetaResolver.length; i += 1) {
          const fieldResolver = fieldMetaResolver[i];
          if (typeof fieldResolver === 'function') meta = fieldResolver(columnModel, fields.get(index), item.dataIndex) || meta;
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
              name={`${fieldName}.${item.dataIndex}`}
            />
          );
        }
        return field;
      });
      return (
        <Form.Group>
          { mappedFields }
        </Form.Group>
      );
    });
    return (
      <Segment color="black">
        <Label as="a" icon="trash" color="red" ribbon="right" index={index} onClick={(event, data) => removeContent(data.index)} />
        {fieldToRender}
      </Segment>
    );
  }

  render() {
    const {
      fields, open, doneEditingContent, addContent, error,
    } = this.props;
    const formFields = fields
      .map((fieldName, index) => this.buildFormFieldsModal(fieldName, index, fields));
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
              content="Add"
            />
            <Button
              onClick={doneEditingContent}
              positive
              labelPosition="right"
              icon="checkmark"
              content="Done"
            />
          </Modal.Actions>
        </Modal>
        <Segment hidden>
          { formFields }
        </Segment>
      </Fragment>
    );
  }
}

export default FormFieldModal;

// @flow
import React, { Fragment } from 'react';
import {
  Form, Modal, Button, Segment, Label,
} from 'semantic-ui-react';
import { Field } from 'redux-form';
import _ from 'lodash';
import DefaultFormField, { RequiredFieldValidator } from './DefaultFormField';

type Props = {
  fields: *,
  columnModel: Array<Object>,
  open: boolean,
  doneEditingContent: Function,
  addContent: Function,
  removeContent: Function,
}

class FormFieldModal extends React.Component<Props> {
  buildFormFieldsModal(fieldName: string, index: number) {
    const { columnModel, removeContent } = this.props;
    const chunkedColumnModel = _.chunk(columnModel, 2);
    const fieldToRender = chunkedColumnModel.map(columns => (
      <Form.Group widths="equal">
        {
          columns.map((item) => {
            let field = <div />;
            const label = (item.meta && item.meta.label) || item.name;
            let columnProps = _.cloneDeep(item);
            const meta = Object.assign(columnProps.meta || {}, { label });
            columnProps = Object.assign(columnProps, { props: meta });
            delete columnProps.meta;
            if (!item.editor) {
              const required = item.meta && item.meta.required;
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
          })
        }
      </Form.Group>
    ));
    return (
      <Segment color="black">
        <Label as="a" icon="trash" color="red" ribbon="right" index={index} onClick={(event, data) => removeContent(data.index)} />
        {fieldToRender}
      </Segment>
    );
  }

  render() {
    const {
      fields, open, doneEditingContent, addContent,
    } = this.props;
    const formFields = fields
      .map((fieldName, index) => this.buildFormFieldsModal(fieldName, index));
    return (
      <Fragment>
        <Modal
          open={open}
          closeOnEscape={false}
          closeOnDimmerClick={false}
          onClose={doneEditingContent}
        >
          <Modal.Content open={open}>
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
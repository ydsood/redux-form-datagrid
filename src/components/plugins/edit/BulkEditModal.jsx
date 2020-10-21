import React, { useState } from "react";
import {
  Button, Divider, Dropdown, Form, Modal,
} from "semantic-ui-react";
import { change, formValueSelector } from "redux-form";
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
  values: Object,
};

const BulkEditModal = ({
  open,
  onClose,
  columnModel,
  selectedRecords,
  formName,
  fieldName,
  change: changeFormValue,
  values,
}: Props) => {
  const [fields, setFields] = useState([]);

  const fieldNameParts = fieldName ? fieldName.split(".") : [];
  const finalFieldName = (fieldNameParts.length > 0) ? fieldNameParts[fieldNameParts.length - 1] : "";

  return (
    <Modal open={open} size="tiny" onClose={onClose}>
      <Modal.Content>
        <Form>
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
              onClick: (event, data) => setFields([...fields, data]),
            }))}
            renderLabel={(item) => ({
              content: item.text,
              onRemove: (event, data) => setFields(
                fields.filter((field) => field.value !== data.value),
              ),
            })}
          />
          {(fields.length > 0) && <Divider />}
          {fields.map((field) => {
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
          })}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => {
            setFields([]);
            onClose();
          }}
          content="Cancel"
          negative
        />
        <Button
          onClick={() => {
            selectedRecords.forEach(
              (i) => fields.forEach(
                (field) => changeFormValue(
                  formName,
                  `${fieldName}[${i}].${field.value}`,
                  values[field.value],
                ),
              ),
            );

            setFields([]);
            onClose();
          }}
          content={`Update ${selectedRecords.length} Records`}
          positive
          disabled={fields.length === 0}
        />
      </Modal.Actions>
    </Modal>
  );
};

const mapStateToProps = (state, ownProps) => ({
  values: formValueSelector(ownProps.formName)(state, `${ownProps.fieldName}_BULKEDIT`),
});

export default connect(
  mapStateToProps,
  {
    change,
  },
)(BulkEditModal);

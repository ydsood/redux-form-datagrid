import React from "react";
import _ from "lodash";
import { Accordion, Form } from "semantic-ui-react";

import { Field } from "redux-form";
import DefaultFormField, { RequiredFieldValidator } from "./DefaultFormField";

// eslint-disable-next-line
function chunkConditional(array, predicate) {
  if (!predicate || typeof predicate !== "function") {
    return [array];
  }

  let index = 0;
  const length = array ? array.length : 0;
  const result = [];
  while (index < length) {
    const remaining = _.slice(array, index);
    const terminationIndex = _.findIndex(remaining, predicate);
    if (terminationIndex >= 0) {
      const firstSlice = _.dropRight(remaining, remaining.length - terminationIndex);
      if (firstSlice.length > 0) {
        result.push(firstSlice);
      }
      result.push([remaining[terminationIndex]]);
      index = index + terminationIndex + 1;
    } else {
      result.push(remaining);
      break;
    }
  }

  return result;
}

function buildVariableSizeFieldSection(columns) {
  const filteredColumns = columns.filter((column) => column.meta);

  const groupedItems = [];
  let currentRowWidth = 0;

  filteredColumns.forEach((column) => {
    const fieldWidth = column.meta.width;

    if (column.meta.hidden && groupedItems.length === 0) {
      groupedItems.push([column]);
    } else if (column.meta.hidden) {
      groupedItems[groupedItems.length - 1].push(column);
    } else if (column.type === "linebreak") {
      currentRowWidth = Number.MAX_SAFE_INTEGER;
    } else if (currentRowWidth === 0 || currentRowWidth + fieldWidth > 16) {
      currentRowWidth = fieldWidth;
      groupedItems.push([column]);
    } else {
      currentRowWidth += fieldWidth;
      groupedItems[groupedItems.length - 1].push(column);
    }
  });

  return groupedItems;
}

function createFieldGroups(
  columns,
  fieldName: string,
  index: Number,
  totalDataRows: Number,
) {
  const chunkedColumns = buildVariableSizeFieldSection(columns);

  return chunkedColumns.map((chunk) => {
    const rowKey = chunk.map((column) => column.dataIndex).join(",");
    return (
      <Form.Group key={rowKey}>
        {chunk.map((column) => {
          let field = <div />;
          const label = (column.meta && column.meta.label) || column.name;
          const ariaLabel = `${label} ${index + 1} of ${totalDataRows}`;
          let columnProps = _.cloneDeep(column);
          let meta = columnProps.meta || {};
          delete columnProps.meta;
          meta = { ...meta, label, "aria-label": ariaLabel };
          columnProps = { ...columnProps, props: meta };

          const required = column.meta && column.meta.required;
          const validate = (column.meta && column.meta.validators) || [];
          if (required) {
            validate.push(RequiredFieldValidator);
          }

          if (!column.editor) {
            const width = (column.meta && column.meta.width) || 16;

            field = (
              <Field
                {...columnProps}
                name={`${fieldName}.${column.dataIndex}`}
                key={column.dataIndex}
                component={DefaultFormField}
                validate={validate}
                width={width}
              />
            );
          } else {
            const FieldComponent = column.editor;
            field = (
              <FieldComponent
                {...columnProps}
                meta={columnProps.props}
                name={`${fieldName}.${column.dataIndex}`}
                validators={validate}
                key={column.dataIndex}
              />
            );
          }
          return field;
        })}
      </Form.Group>
    );
  });
}

export function renderFieldsAndSubsections(
  fieldsAndSubsections,
  fieldName: string,
  index: Number,
  totalDataRows: Number,
) {
  const fieldChunks = chunkConditional(fieldsAndSubsections, (x) => !!x.fields);

  return fieldChunks.map((chunk) => {
    if (chunk.length === 1 && !!chunk[0].fields) {
      const subsection = chunk[0];

      // hide the field if the subsection is hidden
      if (subsection.meta && subsection.fields) {
        subsection.fields.forEach((field) => {
          const currentField = field;
          currentField.meta = field.meta && {
            ...field.meta,
            hidden: subsection.meta.hidden || field.meta.hidden,
          };
        });
      }

      const displayValue = (subsection.meta && subsection.meta.hidden) ? "none" : "";

      return (
        <Accordion
          fluid
          styled
          style={{ display: displayValue }}
          defaultActiveIndex={0}
          panels={[
            {
              key: subsection.name,
              title: subsection.label,
              content: {
                content: createFieldGroups(
                  subsection.fields,
                  fieldName,
                  index,
                  totalDataRows,
                ),
              },
            },
          ]}
        />
      );
    }

    return createFieldGroups(
      chunk,
      fieldName,
      index,
      totalDataRows,
    );
  });
}

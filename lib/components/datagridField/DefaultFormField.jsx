// @flow
import React from 'react';
import type { FormFieldProps } from 'redux-form';
import { Input, Form, Message } from 'semantic-ui-react';

// eslint-disable-next-line react/prefer-stateless-function
export default class SemanticReduxFormField extends React.Component<FormFieldProps> {
  render() {
    const {
      input,
      label,
      fieldClass,
      required,
      meta: { touched, error, warning },
      as: As = Input,
      ...props
    } = this.props;
    const errorBlock = touched
      && ((error && <Message error content={error} />)
        || (warning && <Message warning content={warning} />));
    const displayValue = props.hidden ? 'none' : '';
    const name = props.name ? props.name : input.name;
    return (
      <Form.Field
        width={props.width}
        name={name}
        error={touched && error}
        required={required}
        style={{ display: displayValue }}
      >
        <label>
          {label}
          <As
            {...input}
          />
        </label>
        {errorBlock}
      </Form.Field>
    );
  }
}

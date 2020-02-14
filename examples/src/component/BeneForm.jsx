import React from 'react';
import { DatagridField } from 'redux-form-datagrid'; 
import { Form, Icon, Button } from 'semantic-ui-react';
import { FieldArray, reduxForm } from 'redux-form';
import type { column } from './__mocks__/columnDef';
import NoDataComponent from '../NoDataComponent';

const columnModel:Array<column> = [
  {
    dataIndex: 'firstName',
    name: 'First Name',
    order: 1,
    meta:{
      label:"First Name"
    }
  },
  {
    dataIndex: 'lastName',
    name: 'Last Name',
    order: 2,
    meta:{
      label:"Last Name"
    }
  },
  {
    dataIndex: 'govtID',
    name: 'Government ID',
    order: 2,
    sortComparator: 'default',
    formatter: value =>
      value && `${value.substring(0, 3)}-${value.substring(3, 5)}-${value.substring(5)}`,
    meta:{
      label:'Government ID'
    }
  },
  {
    dataIndex: 'phone',
    name: 'Phone',
    // missing order should be pushed to end
    formatter: value => (
      <div>
        <Icon name="phone" />
        {value && `(${value.substring(0, 3)})-${value.substring(3, 6)}-${value.substring(
          6
        )}`}
      </div>
    ),
    meta:{
      label:'Phone'
    }
  }
];

const beneForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props;
  console.log(DatagridField);
  return(
    <Form onSubmit={handleSubmit(data => alert(JSON.stringify(data)))}>
      <FieldArray component={DatagridField} name="beneficiaryGrid" title="Beneficiary Form" columnModel={columnModel} noDataComponent={NoDataComponent} />
      <Button type="submit" />
    </Form>
  );
}

export default reduxForm({
  form: 'benform'
})(beneForm);
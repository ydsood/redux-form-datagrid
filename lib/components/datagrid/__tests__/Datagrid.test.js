import React from 'react';
import { render, within } from '@testing-library/react';
import Datagrid from '../index';

const mockProps = {
  name: 'name',
  title: 'title',
  // Define mock columns out of order to ensure a valid test.
  columnModel: [
    {
      name: 'First Column',
      dataIndex: 'firstColumn',
      order: 1,
    },
    {
      name: 'Third Column',
      dataIndex: 'thirdColumn',
      order: 3,
    },
    {
      name: 'Second Column',
      dataIndex: 'secondColumn',
      order: 2,
    },
  ],
  data: [
    {
      firstColumn: '1.1',
      secondColumn: '1.2',
      thirdColumn: '1.3',
    },
    {
      // Define mock data out of order to ensure a valid test.
      thirdColumn: '2.3',
      firstColumn: '2.1',
      secondColumn: '2.2',
    },
    {
      firstColumn: '3.1',
      secondColumn: '3.2',
      thirdColumn: '3.3',
    },
  ],
  localStore: true,
};

describe('datagrid component', () => {
  it('renders column headers in order', () => {
    // Note: make sure the columns are defined out of order to ensure a valid test.
    const { container } = render(<Datagrid {...mockProps} />);
    const columnHeaders = container.querySelectorAll('th');
    expect(columnHeaders[0].textContent).toBe('First Column');
    expect(columnHeaders[1].textContent).toBe('Second Column');
    expect(columnHeaders[2].textContent).toBe('Third Column');
  });

  it('renders rows of data in the grid', () => {
    const { container } = render(<Datagrid {...mockProps} />);
    const rows = container.querySelectorAll('tbody > tr');
    expect(rows.length).toBe(3);
  });

  it('renders cells of data in each row', () => {
    const { container } = render(<Datagrid {...mockProps} />);
    const rows = container.querySelectorAll('tbody > tr');
    const cellsByRow = [...rows].map(row => row.querySelectorAll('td'));
    cellsByRow.forEach(cells => expect(cells.length).toBe(3));
  });

  it('renders data in the correct column', () => {
    // Note: make sure the data are defined out of order to ensure a valid test.
    const { container } = render(<Datagrid {...mockProps} />);
    const secondRow = container.querySelectorAll('tbody > tr')[1];
    const cells = secondRow.querySelectorAll('td');
    expect(cells[0].textContent).toBe('2.1');
    expect(cells[1].textContent).toBe('2.2');
    expect(cells[2].textContent).toBe('2.3');
  });

  it('renders a custom NoDataComponent when provided', () => {
    const NO_DATA_TEXT = "These aren't the data you're looking for.";
    const NoDataComponent = () => <div>{NO_DATA_TEXT}</div>;

    const newProps = { ...mockProps, data: [], noDataComponent: NoDataComponent };
    const { container } = render(<Datagrid {...newProps} />);
    const gridElement = container.querySelector('.grid');
    const noDataMessage = within(gridElement).getByText(NO_DATA_TEXT);
    expect(noDataMessage).toBeDefined();
  });

  it('renders an empty grid when NoDataComponent is not provided', () => {
    const { container } = render(<Datagrid {...mockProps} data={[]} />);
    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeDefined();
  });
});

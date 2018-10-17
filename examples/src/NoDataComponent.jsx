// @flow
import React from 'react';
import './App.css';
import { Image, Header } from 'semantic-ui-react';
import noDataImage from './no-data-placeholder.png';

const styles = {
  paddingContainer: {
    paddingTop: '40px',
    paddingBottom: '40px',
  },
  noDataImageSize: {
    textAlign: 'center',
    margin: 'auto',
    width: '150px',
  },
};

const NoDataComponent = (props) => {
  const text = props;

  return (
    <div style={styles.paddingContainer}>
      <div style={styles.noDataImageSize}>
        <Image src={noDataImage} alt="No Data" />
      </div>
      <Header as="h5" textAlign="center">
        {text.message || 'Nothing to display here'}
      </Header>
    </div>
  );
};
export default NoDataComponent;

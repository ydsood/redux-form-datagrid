//@flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise';
import { createStore, applyMiddleware } from 'redux';
import Datagrid, { PaginationHandler } from 'redux-form-datagrid';
import logo from './logo.svg';
import './App.css';
import columnModel from './__mocks__/columnDef';
import data from './__mocks__/columnData';
import NoDataComponent from './NoDataComponent';

type Props = any;


class App extends Component<Props> {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Datagrid columnModel={columnModel} data={data} name="sample" localStore pageSize={5} title="Sample Grid with pagination" />
        <br />
        <br />
        <Datagrid columnModel={columnModel} data={[]} name="sample" localStore pageSize={5} noDataComponent={NoDataComponent} title="Grid with no data" />
      </div>
    );
  }
}

export default App;

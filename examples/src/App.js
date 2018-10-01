//@flow
import React, { Component } from 'react';
import Datagrid from 'redux-form-datagrid';
import logo from './logo.svg';
import './App.css';
import columnModel from './__mocks__/columnDef';
import data from './__mocks__/columnData';

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
        <Datagrid columnModel={columnModel} data={data} name="sample" />
      </div>
    );
  }
}

export default App;

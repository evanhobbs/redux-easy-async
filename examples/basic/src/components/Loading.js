import logo from '../logo.svg';
import React from 'react';

export default () => (
  <div className="loading">
    <img src={logo} className="loading-image" alt="logo" />
    <h3>Loading</h3>
  </div>
);

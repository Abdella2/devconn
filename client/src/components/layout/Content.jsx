import React from 'react';
import { Outlet } from 'react-router-dom';

import Alert from './Alert';

const Content = () => {
  return (
    <div className="container">
      <Alert />
      <Outlet />
    </div>
  );
};

export default Content;

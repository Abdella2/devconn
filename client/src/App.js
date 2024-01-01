import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';

const App = () => (
  <Fragment>
    <Navbar />
    <Outlet />
  </Fragment>
);

export default App;

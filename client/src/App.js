import { Fragment } from 'react';
import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import store from './store';

const App = () => (
  <Provider store={store}>
    <Fragment>
      <Navbar />
      <Outlet />
    </Fragment>
  </Provider>
);

export default App;

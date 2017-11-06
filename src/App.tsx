import * as React from 'react';
import './App.css';
import { provideLoggedInUser } from 'stateProviders';

import Login from 'components/Login';

const enhance = provideLoggedInUser;

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }
}

export default enhance(App);

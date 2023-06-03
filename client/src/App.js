import React from "react";
import LOGIN from "./Components/Login/LOGIN";
import { Switch,Route, Redirect } from "react-router-dom";
import WELCOME from "./Components/Welcome/WELCOME";
import { Provider } from "react-redux";
import store from "./Components/Store/store";
const App = () => {
  return (
    <Provider store={store}>
        <Switch>
          <Route path="/" exact>
            <LOGIN/>
          </Route>
          <Route path="/WELCOME" exact>
            <WELCOME/>
          </Route>
          <Route path='*'>
            <Redirect to='/WELCOME'/>
          </Route>
        </Switch>
    </Provider>
  );
};

export default App;

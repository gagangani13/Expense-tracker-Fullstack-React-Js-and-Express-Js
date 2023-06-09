import React from "react";
import LOGIN from "./Components/Login/LOGIN";
import { Switch,Route, Redirect, useLocation } from "react-router-dom";
import WELCOME from "./Components/Welcome/WELCOME";
import { Provider } from "react-redux";
import store from "./Components/Store/store";
import ChangePassword from "./Components/Login/ChangePassword";
import { AnimatePresence } from "framer-motion";
const App = () => {
  const location=useLocation()
  return (
    <Provider store={store}>
      <AnimatePresence >
        <Switch  location={location} key={location.key}>
          <Route path="/" exact>
            <LOGIN/>
          </Route>
          <Route path="/WELCOME" exact>
            <WELCOME/>
          </Route>
          <Route path='/Password/:Id' exact>
            <ChangePassword/>
          </Route>
          <Route path='*'>
            <Redirect to='/WELCOME'/>
          </Route>
        </Switch>
        </AnimatePresence>
    </Provider>
  );
};

export default App;

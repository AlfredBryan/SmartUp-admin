import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { configureStore } from "redux-starter-kit";
import { Provider } from "react-redux";

import rootReducer from "./reducers/rootReducer";

import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(far, fas);

const store = configureStore({ reducer: rootReducer });

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();

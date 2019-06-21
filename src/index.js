import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";


import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { library }  from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(far, fas)

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);

serviceWorker.unregister();

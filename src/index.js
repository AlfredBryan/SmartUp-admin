import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

import Home from "components/Home/Home";
import UserAuth from "components/User/Login";
import Register from "components/User/Register";
import AddWard from "components/Ward/Ward";
import showCourse from "components/Courses/showCourse";
import Courses from "components/Courses/Courses";
import Institution from "components/Institution/Institution";
import AddInstitution from "components/Institution/AddInstitution";
import UpdateUser from "components/User/UpdateUser";
import Dashboard from "components/User/Dashboard";
import AuthRoute from "components/hoc/AuthRoute";
import showInstitution from "components/Institution/showInstitution";
import newCourse from "components/Courses/newCourse";
import AddTopic from "components/Topics/AddTopics";
import EditCourse from "components/Courses/EditCourse";
import EditInstitution from "components/Institution/EditInstitution";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={UserAuth} />
      <Route exact path="/register" component={Register} />
      <AuthRoute>
        <Route exact path="/family" component={AddWard} />
        <Route exact path="/courses" component={Courses} />
        <Route exact path="/new_course" component={newCourse} />
        <Route exact path="/new_topic/:slug" component={AddTopic} />
        <Route
          exact
          path="/institutions/:slug/new_course"
          component={newCourse}
        />
        <Route exact path="/institutions" component={Institution} />
        <Route exact path="/new_institution" component={AddInstitution} />
        <Route exact path="/institutions/:slug" component={showInstitution} />
        <Route
          exact
          path="/update_institution/:slug"
          component={EditInstitution}
        />
        <Route
          exact
          path="/institutions/:institution_slug/courses/:slug"
          component={showCourse}
        />
        <Route exact path="/update_course/:slug" component={EditCourse} />
        <Route exact path="/courses/:slug" component={showCourse} />
        <Route exact path="/profile" component={Dashboard} />
        <Route
          exact
          path="/update_profile"
          component={UpdateUser}
        />
      </AuthRoute>
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

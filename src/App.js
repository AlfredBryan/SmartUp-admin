import React, { Component } from "react";

import { Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";

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
import showTopic from "components/Topics/showTopic";
import EditTopic from "components/Topics/EditTopic";
import createQuestion from "components/Questions/createQuestion";
import Questions from "components/Questions/Questions";
import EditQuestion from "components/Questions/EditQuestion";
import Assessment from "components/Assessment/Assessment";
import EditOptions from "components/Questions/EditOptions";
import NewAssessment from "components/Assessment/NewAssessment";
import AddQuestion from "components/Assessment/AddQuestion";
import showAssessment from "components/Assessment/showAssessment";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={UserAuth} />
        <Route exact path="/register" component={Register} />
        <AuthRoute>
          <Route exact path="/family" component={AddWard} />
          <Route exact path="/courses" component={Courses} />
          <Route exact path="/new_course" component={newCourse} />
          <Route exact path="/new_topic/:slug" component={AddTopic} />
          <Route exact path="/questions" component={Questions} />
          <Route exact path="/new_question/:id" component={createQuestion} />
          <Route exact path="/edit_question/:id" component={EditQuestion} />
          <Route exact path="/edit_option/:question_id/:id"component={EditOptions}/>
          <Route exact path="/assessment" component={Assessment} />
          <Route exact path="/new_assessment/:id" component={NewAssessment} />
          <Route exact path="/edit_assessment/:id" component={AddQuestion} />
          <Route exact path="/assessment/:id" component={showAssessment} />
          <Route
            exact
            path="/courses/:course_slug/topics/:id"
            component={showTopic}
          />
          <Route
            exact
            path="/update_topic/:course_slug/topics/:id"
            component={EditTopic}
          />
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
          <Route exact path="/update_profile" component={UpdateUser} />
        </AuthRoute>
      </Switch>
    );
  }
}

export default App;
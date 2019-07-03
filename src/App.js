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
import createStudyGroup from "components/Group/createStudyGroup";
import StudyGroups from "components/Group/StudyGroups";
import Default from "components/Default";
import showGroup from "components/Group/showGroup";
import EditGroup from "components/Group/EditGroup";
import takeAssessment from "components/Assessment/takeAssessment";
import newAttendance from "components/Attendance/newAttendance";
import showAttendance from "components/Attendance/showAttendance";
import editAttendance from "components/Attendance/editAttendance";
import Admin from "components/Admin/Admin";
import ShowUser from "components/Admin/ShowUser";
import StudentAssessment from "components/Assessment/StudentAssessment";
import Answers from "components/Answers/Answers";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={UserAuth} />
        <Route exact path="/register" component={Register} />
        <AuthRoute>
          <Route exact path="/family" component={AddWard} />
          <Route exact path="/users" component={Admin} />
          <Route exact path="/assessment_answers" component={Answers} />
          <Route exact path="/display_user/:id" component={ShowUser} />
          <Route exact path="/courses" component={Courses} />
          <Route exact path="/new_course" component={newCourse} />
          <Route
            exact
            path="/student_assessment"
            component={StudentAssessment}
          />
          <Route exact path="/new_topic/:slug" component={AddTopic} />
          <Route exact path="/questions" component={Questions} />
          <Route exact path="/new_question/:id" component={createQuestion} />
          <Route exact path="/edit_question/:id" component={EditQuestion} />
          <Route
            exact
            path="/edit_option/:question_id/:id"
            component={EditOptions}
          />
          <Route exact path="/assessments" component={Assessment} />
          <Route exact path="/new_assessment/:id" component={NewAssessment} />
          <Route exact path="/edit_assessment/:id" component={AddQuestion} />
          <Route exact path="/assessment/:id" component={showAssessment} />
          <Route
            exact
            path="/assessments/:id/take_assessment"
            component={takeAssessment}
          />
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
          <Route exact path="/study_groups" component={StudyGroups} />
          <Route exact path="/update_group/:id" component={EditGroup} />
          <Route
            exact
            path="/create_study_group/:id"
            component={createStudyGroup}
          />
          <Route
            exact
            path="/study_groups/:id/new_attendance"
            component={newAttendance}
          />
          <Route
            exact
            path="/study_groups/:study_group_id/attendances/:id"
            component={showAttendance}
          />
          <Route
            exact
            path="/study_groups/:study_group_id/edit_attendance/:id"
            component={editAttendance}
          />
          <Route exact path="/show_group/:id" component={showGroup} />
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

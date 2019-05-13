import Dashboard from "./components/User/Dashboard";
import Institution from "./components/Institution/Institution";
import UpdateUser from "components/User/UpdateUser";
import AddWard from "components/Ward/Ward";
import Courses from "components/Courses/Courses";

const dashboardRoutes = [
  {
    path: "/profile",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    path: "/update_profile",
    name: "Settings",
    icon: "fa fa-gear",
    component: UpdateUser
  },
  {
    path: "/family",
    name: "Wards",
    icon: "fa fa-users",
    component: AddWard
  },
  {
    path: "/institution",
    name: "Institution",
    icon: "fa fa-university",
    component: Institution
  },
  {
    path: "/courses",
    name: "Courses",
    icon: "fa fa-graduation-cap",
    component: Courses
  }
];

export default dashboardRoutes;

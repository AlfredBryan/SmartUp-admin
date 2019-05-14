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
    icon: "pe-7s-config",
    component: UpdateUser
  },
  {
    path: "/family",
    name: "Wards",
    icon: "pe-7s-users",
    component: AddWard
  },
  {
    path: "/institution",
    name: "Institution",
    icon: "pe-7s-culture",
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

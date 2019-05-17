import Dashboard from "./components/User/Dashboard";
import Institution from "./components/Institution/Institution";
import UpdateUser from "components/User/UpdateUser";
import AddWard from "components/Ward/Ward";
import Courses from "components/Courses/Courses";

const user = JSON.parse(localStorage.getItem("user"));

let Ward_user;
// Checking User status before Display
if (user) {
  switch (user.status !== "educator") {
    case user.status === "guardian":
      Ward_user = "Wards";
      break;
    case user.status === "student":
      Ward_user = "Guardians";
      break;
    default:
      Ward_user = "null";
  }
}
const dashboardRoutes = [
  {
    path: `/profile/${user.first_name}`,
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    path: `/update_profile/${user.first_name}`,
    name: "Settings",
    icon: "pe-7s-config",
    component: UpdateUser
  },
  {
    path: `/family`,
    name: Ward_user,
    icon: "pe-7s-users",
    component: AddWard
  },
  {
    path: "/institutions",
    name: "Institutions",
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

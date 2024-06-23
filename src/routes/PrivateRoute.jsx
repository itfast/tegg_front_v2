import { Navigate, Outlet, useLocation } from "react-router-dom";
import isAuthenticated from "./auth";
import api from "../services/api";

// eslint-disable-next-line no-unused-vars
const PrivateRoute = function ({ ...props }) {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);

  const authenticated = isAuthenticated();

  const token = urlSearchParams.get("token");
  if (token && location.pathname === "/") {
    api.mySession.set(token);
  }

  if (authenticated) {
    return <Outlet />;
  }
  api.user.logout();
  return <Navigate to="/login" />;
};

export default PrivateRoute;

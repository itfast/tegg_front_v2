import { Navigate, Outlet } from "react-router-dom";
import isAuthenticated from "./auth";
import api from "../services/api";

// eslint-disable-next-line no-unused-vars
const TeggPrivateRoute = function ({ ...props }) {
	const authenticated = isAuthenticated();
	const isTeggUser = api.currentUser.AccessTypes[0] === "TEGG";

	if (authenticated && isTeggUser) {
		return <Outlet />;
	}
	api.user.logout();
	return <Navigate to="/login" />;
};

export default TeggPrivateRoute;

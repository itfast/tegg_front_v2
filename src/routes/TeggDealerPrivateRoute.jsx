import { Navigate, Outlet } from "react-router-dom";
import isAuthenticated from "./auth";
import api from "../services/api";

// eslint-disable-next-line no-unused-vars
const TeggDealerPrivateRoute = function ({ ...props }) {
	const authenticated = isAuthenticated();
	const isTeggUser = api.currentUser.AccessTypes[0] === "TEGG";
	const isDealerUser = api.currentUser.AccessTypes[0] === "DEALER";

	if (authenticated && (isTeggUser || isDealerUser)) {
		return <Outlet />;
	}
	api.user.logout();
	return <Navigate to="/login" />;
};

export default TeggDealerPrivateRoute;

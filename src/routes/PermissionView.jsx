/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import api from "../services/api";

function PermissionView({ role, children }) {
	const [permissions, setPermissions] = useState(false);

	useEffect(() => {
		async function loadRoles() {
			const roles = role.split(",");
			if (api.currentUser) {
				if (roles.includes(api.currentUser.AccessTypes[0])) {
					setPermissions(true);
				}
			}
		}

		loadRoles();
	}, [role]);
	return permissions && children;
}

export default PermissionView;

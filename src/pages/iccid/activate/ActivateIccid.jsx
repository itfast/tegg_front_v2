import { useEffect, useState } from "react";
import { PageLayout } from "../../../../globalStyles";
import { ActivateIccidData } from "./ActivateIccidData";
import { ActivateIccidDataLogged } from "./ActivateIccidDataLogged";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../services/api";

export const ActivateIccid = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(false);

	const [iccids, setIccids] = useState([]);

	useEffect(() => {
		// console.log(api.currentSession);
		if (location?.state?.iccids) {
			// console.log(location?.state?.iccids);
			setIccids(location?.state?.iccids);
		}
	}, []);

	const goBack = () => {
		if (api.currentSession === null) {
			navigate("/login");
		} else {
			if (api.currentUser.AccessTypes[0] === "TEGG") {
				navigate("/iccids");
			} else {
				navigate("/orders");
			}
		}
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				Informe o ICCID que deseja ativar
			</h2>
			{api.currentSession === null ? (
				<ActivateIccidData
					loading={loading}
					setLoading={setLoading}
					goBackStep={goBack}
					label={"ICCID"}
				/>
			) : (
				<ActivateIccidDataLogged
					list={iccids}
					loading={loading}
					setLoading={setLoading}
					goBackStep={goBack}
					label={"ICCID"}
				/>
			)}
		</PageLayout>
	);
};

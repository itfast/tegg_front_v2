import { useEffect, useState } from "react";
import { PageLayout } from "../../../../globalStyles";
import { RechargeData } from "./RechargeData";
import { useNavigate, useLocation } from "react-router-dom";

export const NewRecharge = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [plan, setPlan] = useState({});

	useEffect(() => {
		if (location?.state?.plan) {
			// console.log(location?.state?.plan);
			setPlan(location?.state?.plan);
		}
	}, []);

	const goBack = () => {
		navigate("/recharge");
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				Informe os dados da recarga
			</h2>
			<RechargeData plan={plan} goBackStep={goBack} label={"RECARGA"} />
		</PageLayout>
	);
};

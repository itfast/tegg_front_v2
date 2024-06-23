import { useEffect } from "react";
import { PageLayout } from "../../../../globalStyles";
import { EsimOrderData } from "./EsimOrderData";
import { useNavigate, useLocation } from "react-router-dom";

export const NewEsimOrder = () => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (location?.state?.order) {
			setOrder(location?.state?.order);
		}
	}, []);

	const goBack = () => {
		navigate("/orders");
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				Informe os dados do novo pedido de e-SIM
			</h2>
			<EsimOrderData goBackStep={goBack} label={"PEDIDO DE e-SIM"} />
		</PageLayout>
	);
};

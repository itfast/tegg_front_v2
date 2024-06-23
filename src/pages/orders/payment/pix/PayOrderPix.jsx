import { useEffect } from "react";
import { PageLayout } from "../../../../../globalStyles";
import { PayOrderPixData } from "./PayOrderPixData";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export const PayOrderPix = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// console.log(id);
		// setOrder(id);
	}, []);

	const goBack = () => {
		// navigate("/orders");
		navigate("/plans");
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				Pagamento de pedido
			</h2>
			<PayOrderPixData
				order={id}
				goBackStep={goBack}
				label={"REALIZAR PAGAMENTO"}
			/>
		</PageLayout>
	);
};

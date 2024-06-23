import { useEffect } from "react";
import { PageLayout } from "../../../../globalStyles";
import { PayOrderData } from "./PayOrderData";
import { useNavigate, useParams } from "react-router-dom";

export const PayOrder = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		// console.log(id);
		// setOrder(id);
	}, []);

	const goBack = () => {
		navigate("/orders");
		// navigate("/plans");
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				Pagamento de pedido
			</h2>
			<PayOrderData
				order={id}
				goBackStep={goBack}
				label={"ESCOLHER FORMA DE PAGAMENTO"}
			/>
		</PageLayout>
	);
};

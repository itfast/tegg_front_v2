/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { PageLayout } from "../../../../globalStyles";
import { OrderData } from "./OrderData";
import { useNavigate, useLocation } from "react-router-dom";
// import { OrderDataNew } from './OrderDataNew'

export const NewOrder = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const goBack = () => {
		navigate("/orders");
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				Informe os dados do novo pedido de chip físico
			</h2>
			<OrderData goBackStep={goBack} label={"PEDIDO DE CHIP FÍSICO"} />
			{/* <OrderDataNew /> */}
			
		</PageLayout>
	);
};

import { useEffect } from "react";
import { PageLayout } from "../../../../globalStyles";
import { PayRechargeData } from "./PayRechargeData";
import { useNavigate, useParams } from "react-router-dom";

export const PayRecharge = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	// const [order, setOrder] = useState("");

	useEffect(() => {
		// console.log(id);
		// setOrder(id);
	}, []);

	const goBack = () => {
		navigate("/lines");
		// navigate("/plans");
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				Pagamento de recarga
			</h2>
			<PayRechargeData
				order={id}
				goBackStep={goBack}
				label={"ESCOLHER FORMA DE PAGAMENTO"}
			/>
		</PageLayout>
	);
};

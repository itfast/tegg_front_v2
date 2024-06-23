import { useEffect } from "react";
import { PageLayout } from "../../../../../globalStyles";
import { PayRechargePixData } from "./PayRechargePixData";
import { useNavigate, useParams } from "react-router-dom";

export const PayRechargePix = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	// const [order, setOrder] = useState("");

	useEffect(() => {
		// console.log(id);
		// setOrder(id);
	}, []);

	const goBack = () => {
		// navigate("/orders");
		navigate("/lines");
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				Pagamento de recarga
			</h2>
			<PayRechargePixData
				order={id}
				goBackStep={goBack}
				label={"REALIZAR PAGAMENTO"}
			/>
		</PageLayout>
	);
};

import { useEffect, useState } from "react";
import { PageLayout, Button } from "../../../../globalStyles";
import { SubscriptionData } from "./SubscriptionData";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../services/api";
import { translateError } from "../../../services/util";
import { toast } from "react-toastify";

export const NewSubscription = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(false);

	const [client, setClient] = useState({});
	const [line, setLine] = useState({});
	const [plan, setPlan] = useState({});
	const [dueDate, setDueDate] = useState("");
	const [ccInfo, setCcInfo] = useState({
		HolderName: "",
		Number: "",
		Expiry: "",
		Ccv: "",
	});
	const [cchInfo, setCchInfo] = useState({
		Name: "",
		Email: "",
		Doc: "",
		PostalCode: "",
		Address: "",
		AddressNumber: "",
		AddressComplement: "",
		City: "",
		District: "",
		Uf: "",
		Phone: "",
		MobilePhone: "",
	});

	useEffect(() => {
		// console.log(api.currentUser);
	}, []);

	const handleNext = () => {
		setLoading(true);
		api.iccid
			.createSubscription(
				client.Id,
				plan.Amount,
				dueDate,
				ccInfo,
				cchInfo,
				plan.Products[0].Product.SurfId,
				line.Iccid
			)
			.then((res) => {
				toast.success(res.data.Message);
				navigate("/subscriptions");
			})
			.catch((err) => {
				translateError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const goBack = () => {
		navigate("/subscriptions");
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				Informe os dados da nova assinatura
			</h2>
			<SubscriptionData
				loading={loading}
				goStep={handleNext}
				goBackStep={goBack}
				client={client}
				setClient={setClient}
				line={line}
				setLine={setLine}
				plan={plan}
				setPlan={setPlan}
				dueDate={dueDate}
				setDueDate={setDueDate}
				ccInfo={ccInfo}
				setCcInfo={setCcInfo}
				cchInfo={cchInfo}
				setCchInfo={setCchInfo}
				label={"Assinatura"}
			/>
		</PageLayout>
	);
};

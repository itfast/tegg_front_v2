/* eslint-disable react/prop-types */
import { Button } from "../../../../globalStyles";
import {
	CardData,
	FooterButton,
	InputData,
} from "../../resales/Resales.styles";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { translateError } from "../../../services/util";

export const ActivateIccidData = ({
	label,
	loading,
	setLoading,
	goBackStep,
}) => {
	const [iccid, setIccid] = useState("");
	const [finalClient, setFinalClient] = useState("");
	const [plan, setPlan] = useState("");
	const [doc, setDoc] = useState("");
	const [ddd, setDdd] = useState("");

	const urlSearchParams = new URLSearchParams(window.location.search);

	const handleNext = () => {
		setLoading(true);
		if (iccid !== "") {
			if (iccid.length === 19) {
				api.iccid
					.activate(iccid, finalClient, plan, doc, ddd)
					.then((res) => {
						// console.log(res);
						toast.success(
							"Iccid ativado com sucesso, insira outro caso deseje ativar mais"
						);
					})
					.catch((err) => translateError(err))
					.finally(() => {
						setLoading(false);
					});
			} else {
				toast.error("Insira um ICCID válido");
				setLoading(false);
			}
		} else {
			toast.error("Iccid é obrigatório");
			setLoading(false);
		}
	};

	useEffect(() => {
		// console.log(api.currentSession);

		const clientId = urlSearchParams.get("FinalClientId");
		const planId = urlSearchParams.get("PlanId");
		const document = urlSearchParams.get("Document");
		const clientDdd = urlSearchParams.get("Ddd");

		// console.log(urlSearchParams.get("Teste"));

		setFinalClient(clientId);
		setPlan(planId);
		setDoc(document);
		setDdd(clientDdd);
	}, []);

	return (
		<CardData>
			<h3>{label}</h3>
			<div style={{ width: "100%", margin: "1rem", display: "flex" }}>
				<div style={{ width: "100%", marginRight: "1%" }}>
					<label>ICCID</label>
					<InputData
						type="text"
						placeholder="Iccid*"
						style={{ width: "100%" }}
						value={iccid}
						onChange={(e) => setIccid(e.target.value)}
					/>
				</div>
			</div>
			<FooterButton>
				<Button invert style={{ marginRight: 10 }} onClick={goBackStep}>
					VOLTAR
				</Button>
				<Button notHover onClick={handleNext}>
					{loading ? (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								height: 15,
							}}>
							<ReactLoading type={"bars"} color={"#fff"} />
						</div>
					) : (
						"ATIVAR"
					)}
				</Button>
			</FooterButton>
		</CardData>
	);
};

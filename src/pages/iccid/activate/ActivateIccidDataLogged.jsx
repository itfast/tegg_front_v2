/* eslint-disable react/prop-types */
import { Button } from "../../../../globalStyles";
import { CardData } from "../../resales/Resales.styles";
import ReactLoading from "react-loading";
import Select from "react-select";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { translateError } from "../../../services/util";
import { useNavigate } from "react-router-dom";

export const ActivateIccidDataLogged = ({
	list,
	goBackStep,
	label,
	loading,
	setLoading,
}) => {
	const navigate = useNavigate();
	const [iccids, setIccids] = useState([]);
	const [iccidToActivate, setIccidToActivate] = useState(-1);
	const [plan, setPlan] = useState("");
	const [doc, setDoc] = useState("");
	const [ddd, setDdd] = useState("");

	const urlSearchParams = new URLSearchParams(window.location.search);

	const treatIccids = () => {
		const array = [];
		// console.log(list);
		for (let i = 0; i < list.length; i++) {
			// console.log(list[i]);
			array.push({
				value: i,
				label: list[i],
			});
		}
		// console.log(array);
		setIccids(array);
	};

	const handleNext = () => {
		if (iccidToActivate !== -1) {
			// console.log(iccids[iccidToActivate - 1].label);
			console.log(iccids[iccidToActivate].label, plan, doc, ddd)
			setLoading(true);
			api.iccid
				.activate(iccids[iccidToActivate].label, plan, doc, ddd)
				.then((res) => {
					// console.log(res);
					let array = [...iccids];
					array.splice(iccidToActivate, 1);
					setIccids(array);
					setIccidToActivate(-1);
					toast.success("Iccid ativado com sucesso");
					if (api.currentUser.AccessTypes[0] === "TEGG") {
						navigate("/iccids");
					} else {
						navigate("/orders");
					}
				})
				.catch((err) => translateError(err))
				.finally(() => {
					setLoading(false);
				});
		} else {
			toast.error("Escolha ao menos um ICCID");
		}
	};

	useEffect(() => {
		const planId = urlSearchParams.get("PlanId");
		const document = urlSearchParams.get("Document");
		const clientDdd = urlSearchParams.get("Ddd");
		setPlan(planId);
		setDoc(document);
		setDdd(clientDdd);
	}, []);

	useEffect(() => {
		if (list.length !== 0) treatIccids();
	}, [list]);

	return (
		<CardData>
			<h3>{label}</h3>
			<div className="input_row_1">
				<div className="input mr">
					<label>ICCID</label>
					<Select
						// defaultValue={iccids[0]}
						key={iccidToActivate}
						options={iccids}
						placeholder="Selecione um ICCID"
						isClearable
						onChange={(e) => {
							// console.log(e);
							if (e === null) {
								setIccidToActivate(-1);
							} else {
								setIccidToActivate(e.value);
							}
						}}
					/>
				</div>
			</div>
			<div className="flex end btn_invert">
				<Button invert onClick={goBackStep}>
					VOLTAR
				</Button>
				<Button notHover onClick={handleNext}>
					{loading ? (
						<div className="loading">
							<ReactLoading type={"bars"} color={"#fff"} />
						</div>
					) : (
						"ATIVAR"
					)}
				</Button>
			</div>
		</CardData>
	);
};

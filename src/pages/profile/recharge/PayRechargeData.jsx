/* eslint-disable react/prop-types */
import { Button } from "../../../../globalStyles";
import { CardData, SelectUfs } from "../../resales/Resales.styles";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../services/api";

export const PayRechargeData = ({ order, goBackStep, label }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const [orderInfo, setOrderInfo] = useState({});
	// const [plans, setPlans] = useState([]);
	const [plansInfo, setPlansInfo] = useState([]);
	const [paymentMethod, setPaymentMethod] = useState("");
	const [totalValue, setTotalValue] = useState(0);
	const [clientName, setClientName] = useState("-");

	const translateValue = (value) => {
		let converted = new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(Number(value));
		return converted;
	};

	const getOrder = () => {
		// console.log(order);
		api.order
			.getInfo(order)
			.then((res) => {
				// console.log("Pedido", res.data[0]);
				setOrderInfo(res.data[0]);
				res.data[0].FinalClientId != null
					? setClientName(res.data[0].FinalClient.Name)
					: setClientName(res.data[0].DealerPayer.Name);
			})
			.catch((err) => console.log(err));
	};

	const getPlans = () => {
		// console.log("INFO", orderInfo);
		setPlansInfo(orderInfo.OrderItems);
		let newVal = 0;
		orderInfo?.OrderItems?.forEach((item) => {
			// console.log("ITEM", item);
			newVal += Number(item.Amount);
		});
		setTotalValue(newVal);
	};

	const handleNext = () => {
		if (paymentMethod !== "") {
			if (paymentMethod === "CREDITO") {
				navigate(`/recharge/pay/credit/${order}`);
			} else {
				navigate(`/recharge/pay/pix/${order}`);
			}
		} else {
			toast.error("Forma de pagamento é obrigatória");
		}
	};

	useEffect(() => {
		// console.log("Pedido", order);
		getOrder();
		// getPlans();
	}, []);

	useEffect(() => {
		if (Object.keys(orderInfo) !== 0) {
			getPlans();
		}
	}, [orderInfo]);

	return (
		<CardData>
			<h3>{label}</h3>
			<div className="input_row_3">
				<div className="input">
					<p>Pedido: {orderInfo != {} ? orderInfo.Id : "-"}</p>
				</div>
			</div>
			<div className="input_row_3">
				<div className="input">
					<p>Cliente: {clientName}</p>
				</div>
			</div>
			<div className="input_row_3">
				<div className="tb">
					<label>ITENS DO PEDIDO</label>
					<table>
						<tr>
							<th>Nome</th>
							<th>Preço</th>
						</tr>
						{plansInfo?.length == 0 && (
							<tr>
								<td>-</td>
								<td>-</td>
							</tr>
						)}
						{plansInfo?.map((m, i) => (
							<tr key={i}>
								<td>{`RECARGA ${m.Plan.Name}`}</td>
								<td>
									<div className="space_between">
										<p>{translateValue(Number(m.Amount))}</p>
									</div>
								</td>
							</tr>
						))}
					</table>
				</div>
			</div>
			<div className="input_row_3">
				<div className="input">
					<p>Valor total: {translateValue(Number(totalValue))}</p>
				</div>
			</div>
			<div className="input_row_3">
				<div className="input_3">
					<label>FORMA DE PAGAMENTO</label>
					<SelectUfs
						name="UF3"
						id="UF3"
						placeholder="FORMA DE PAGAMENTO*"
						value={paymentMethod}
						onChange={(e) => {
							setPaymentMethod(e.target.value);
						}}
						className="input"
						defaultValue={""}>
						<option disabled value={""}>
							FORMA DE PAGAMENTO*
						</option>
						<option value={"CREDITO"}>Cartão de crédito</option>
						<option value={"PIX"}>Pix</option>
					</SelectUfs>
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
						"REALIZAR PAGAMENTO"
					)}
				</Button>
			</div>
		</CardData>
	);
};

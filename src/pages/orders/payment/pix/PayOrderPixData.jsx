/* eslint-disable react/prop-types */
import { Button } from "../../../../../globalStyles";
import { CardData } from "../../../resales/Resales.styles";
import ReactLoading from "react-loading";
import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const PayOrderPixData = ({ order, goBackStep, label }) => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [plansInfo, setPlansInfo] = useState([]);
	const [totalValue, setTotalValue] = useState(0);

	const [orderInfo, setOrderInfo] = useState({});

	const [pixCode, setPixCode] = useState("");
	const [pixCopyPaste, setPixCopyPaste] = useState("");

	const [status, setStatus] = useState("");
	const [count, setCount] = useState(0);

	const translateValue = (value) => {
		let converted = new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(Number(value));
		return converted;
	};

	const getOrder = () => {
		api.order
			.getInfo(order)
			.then((res) => {
				// console.log("Pedido", res.data[0].FinalClient.Name);
				setOrderInfo(res.data[0]);
			})
			.catch((err) => console.log(err));
	};

	const getPlans = () => {
		// console.log(orderInfo);
		setPlansInfo(orderInfo.OrderItems);
		let newVal = 0;
		orderInfo.OrderItems.forEach((item) => {
			// console.log("ITEM", item);
			newVal += Number(item.Amount);
		});
		if (orderInfo.FreightAmount) {
			newVal += orderInfo.FreightAmount;
		}
		setTotalValue(newVal);
	};

	const getStatus = async () => {
		await new Promise((r) => setTimeout(r, 5000));
		let num = count;
		num++;
		if (num > 60) {
			toast.info(
				"Pagamento ainda não foi confirmado, por favor realize o pagamento para confirmar o seu pedido"
			);
			navigate("/orders");
		}
		api.order
			.getStatus(order)
			.then((res) => {
				setCount(num);
				if (res.data.Status === "CONFIRMED" || res.data.Status === "RECEIVED") {
					toast.success("Pagamento confirmado");
					navigate("/orders");
				} else {
					setStatus(`res.data.Status${num}`);
				}
			})
			.catch((err) => {
				getStatus();
			});
	};

	const handleNext = async () => {
		// setLoading(true);
		api.order
			.payPix(orderInfo.Id, totalValue)
			.then((res) => {
				let url = `data:image/png;base64,${res.data.QrCodePix.encodedImage}`;
				setPixCode(url);
				setPixCopyPaste(res.data.QrCodePix.payload);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		// console.log("Pedido", order);
		getOrder();
		// getPlans();
	}, []);

	useEffect(() => {
		// console.log("Pedido", order);
		// getOrder();
		if (Object.keys(orderInfo) != 0) {
			getPlans();
		}
	}, [orderInfo]);

	useEffect(() => {
		if (totalValue !== 0) {
			handleNext();
		}
	}, [totalValue]);

	useEffect(() => {
		if (pixCode !== "") {
			console.log("Getting status...");
			getStatus();
		}
	}, [pixCode]);

	useEffect(() => {
		if (status !== "") {
			console.log("Getting status...");
			getStatus();
		}
	}, [status]);

	return (
		<CardData>
			<h3>{label}</h3>
			<div className="input_row_1">
				<div className="input">
					<p>Pedido: {orderInfo != {} ? orderInfo.Id : "-"}</p>
				</div>
			</div>
			<div className="input_row_1">
				<div className="input">
					<p>Cliente: {orderInfo != {} ? orderInfo.FinalClient?.Name : "-"}</p>
				</div>
			</div>
			<div className="input_row_1">
				<div className="tb">
					<label>ITENS DO PEDIDO</label>
					<table>
						<tr>
							<th>Nome</th>
							<th>Preço</th>
						</tr>
						{plansInfo.length == 0 && (
							<tr>
								<td>-</td>
								<td>-</td>
							</tr>
						)}
						{plansInfo.map((m, i) => (
							<tr key={i}>
								<td>{m.Plan.Name}</td>
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
					<p>
						Frete:{" "}
						{orderInfo.HaveFreight
							? translateValue(orderInfo.FreightAmount)
							: translateValue(0)}
					</p>
				</div>
			</div>
			<div className="input_row_2">
				<div className="input">
					<p>Valor total: {translateValue(totalValue)}</p>
				</div>
			</div>
			{!loading ? (
				<>
					<div className="flex_center">
						<div>
							<img src={pixCode} alt="" />
						</div>
					</div>
					<div className="flex_center">
						<div>
							<p
								style={{
									fontSize: 20,
									fontWeight: "bold",
									textAlign: "center",
								}}>
								Pix copia e cola
							</p>
							<p style={{ marginTop: 20, fontSize: 20, textAlign: "center" }}>
								{pixCopyPaste}
							</p>
						</div>
					</div>
					<div style={{ width: "100%", margin: "1rem" }}></div>
					<br />
					<br />
					<br />
					<div className="flex_center">
						<div>
							<p
								style={{
									fontSize: 20,
									fontWeight: "bold",
									textAlign: "center",
								}}>
								Após confirmação do pagamento você receberá um e-mail com as
								informações do mesmo
							</p>
						</div>
					</div>
				</>
			) : (
				<div className="flex_center">
					<h2 style={{ textAlign: "center" }}>
						Aguarde enquanto as informações para o pagamento são coletadas
					</h2>
					<div className="loading">
						<ReactLoading type={"bars"} color={"#000"} />
					</div>
				</div>
			)}
			<br />
			<div className="flex end btn_invert">
				<Button invert onClick={goBackStep}>
					VOLTAR
				</Button>
			</div>
		</CardData>
	);
};

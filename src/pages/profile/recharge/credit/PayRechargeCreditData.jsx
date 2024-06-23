/* eslint-disable react/prop-types */
import { Button } from "../../../../../globalStyles";
import { CardData, InputData } from "../../../resales/Resales.styles";
import ReactLoading from "react-loading";
import Select from "react-select";
import Checkbox from "@mui/material/Checkbox";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../../services/api";
import {
	getCEP,
	translateError,
	cepFormat,
	phoneFormat,
} from "../../../../services/util";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

export const PayRechargeCreditData = ({ order, goBackStep, label }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const [orderInfo, setOrderInfo] = useState({});
	const [plansInfo, setPlansInfo] = useState([]);

	const [focus, setFocus] = useState("");
	const [holderName, setHolderName] = useState("");
	const [cardNumber, setCardNumber] = useState("");
	const [expiry, setExpiry] = useState("");
	const [ccv, setCcv] = useState("");

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [cpfCnpj, setCpfCnpj] = useState("");
	const [postalCode, setPostalCode] = useState("");
	const [uf, setUf] = useState("");
	const [city, setCity] = useState("");
	const [district, setDistrict] = useState("");
	const [address, setAddress] = useState("");
	const [addressNumber, setAddressNumber] = useState("");
	const [addressComplement, setAddressComplement] = useState("");
	const [phone, setPhone] = useState("");
	const [mobile, setMobile] = useState("");
	const [totalValue, setTotalValue] = useState(0);

	const [dueDate, setDueDate] = useState("");
	const [createSubscription, setCreateSubscription] = useState(false);

	const cardNameInput = document.getElementById("cardName");
	const cardNumberInput = document.getElementById("cardNumber");
	const expireInput = document.getElementById("expire");
	const cardCcvInput = document.getElementById("cardCcv");
	const ownerNameInput = document.getElementById("ownerName");
	const ownerEmailInput = document.getElementById("ownerEmail");
	const ownerDocInput = document.getElementById("ownerDoc");
	const ownerCepInput = document.getElementById("ownerCep");
	const ownerNumberInput = document.getElementById("ownerNumber");
	const ownerCelInput = document.getElementById("ownerCel");

	const translateValue = (value) => {
		let converted = new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(Number(value));
		return converted;
	};

	const returnDays = () => {
		const date = new Date();
		let month = date.getMonth() + 1;
		let year = date.getFullYear();
		if (month > 12) {
			month = 1;
			year++;
		}

		const array = [];
		const date2 = new Date(year, month, 0);
		for (let i = 1; i <= date2.getDate(); i++) {
			array.push({
				label: i,
				value: i.toString(),
			});
		}
		return array;
	};

	const getOrder = () => {
		api.order
			.getInfo(order)
			.then((res) => {
				console.log("Pedido", res.data[0]);
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
		setTotalValue(newVal);
	};

	const generateSubscription = async () => {
		api.iccid
			.createSubscription(
				orderInfo.FinalClientId,
				totalValue,
				dueDate,
				{
					HolderName: holderName,
					Number: cardNumber,
					Expiry: expiry,
					Ccv: ccv,
				},
				{
					Name: name,
					Email: email,
					Doc: cpfCnpj,
					PostalCode: postalCode,
					Address: address,
					AddressNumber: addressNumber,
					AddressComplement: addressComplement,
					City: city,
					District: district,
					UF: uf,
					Phone: phone,
					MobilePhone: mobile,
				},
				orderInfo.OrderItems[0].Plan.Products[0].Product.SurfId,
				orderInfo.OrderItems[0].ICCID[0].Iccid
			)
			.then((res) => {
				toast.success(res.data.Message);
			})
			.catch((err) => {
				console.log(err);
				translateError(err);
			});
	};

	const handleNext = async () => {
		if (holderName !== "") {
			cardNameInput?.style.removeProperty("border-color");
			if (cardNumber !== "") {
				if (cardNumber.length === 16) {
					cardNumberInput?.style.removeProperty("border-color");
					if (expiry !== "") {
						if (expiry.length === 7) {
							expireInput?.style.removeProperty("border-color");
							if (ccv !== "") {
								if (ccv.length === 3) {
									cardCcvInput?.style.removeProperty("border-color");
									if (name !== "") {
										ownerNameInput?.style.removeProperty("border-color");
										if (email !== "") {
											ownerEmailInput?.style.removeProperty("border-color");
											if (cpfCnpj !== "") {
												ownerDocInput?.style.removeProperty("border-color");
												if (postalCode !== "") {
													ownerCepInput?.style.removeProperty("border-color");
													if (addressNumber !== "") {
														ownerNumberInput?.style.removeProperty(
															"border-color"
														);
														if (mobile !== "") {
															ownerCelInput?.style.removeProperty(
																"border-color"
															);
															if (createSubscription) {
																if (dueDate !== "") {
																	setLoading(true);
																	await generateSubscription();
																	api.order
																		.payCredit(
																			orderInfo.Id,
																			totalValue,
																			holderName,
																			cardNumber,
																			expiry.slice(0, 2),
																			expiry.slice(3, 7),
																			ccv,
																			name,
																			email,
																			cpfCnpj.replace(/\D+/g, ""),
																			postalCode.replace(/\D+/g, ""),
																			addressNumber,
																			addressComplement,
																			phone.replace(/\D+/g, ""),
																			mobile.replace(/\D+/g, "")
																		)
																		.then((res) => {
																			// console.log(res);
																			toast.success(
																				"Pagamento efetuado com sucesso, aguarde o recebimento do pagamento com a confirmação"
																			);
																			navigate("/lines");
																		})
																		.catch((err) => {
																			console.log(err);
																			translateError(err);
																		})
																		.finally(() => setLoading(false));
																} else {
																	toast.error(
																		"Escolha um dia para o vencimento da assinatura"
																	);
																}
															} else {
																setLoading(true);
																api.order
																	.payCredit(
																		orderInfo.Id,
																		totalValue,
																		holderName,
																		cardNumber,
																		expiry.slice(0, 2),
																		expiry.slice(3, 7),
																		ccv,
																		name,
																		email,
																		cpfCnpj.replace(/\D+/g, ""),
																		postalCode.replace(/\D+/g, ""),
																		addressNumber,
																		addressComplement,
																		phone.replace(/\D+/g, ""),
																		mobile.replace(/\D+/g, "")
																	)
																	.then((res) => {
																		// console.log(res);
																		toast.success(
																			"Pagamento efetuado com sucesso, aguarde o recebimento do pagamento com a confirmação"
																		);
																		navigate("/lines");
																	})
																	.catch((err) => {
																		console.log(err);
																		translateError(err);
																	})
																	.finally(() => setLoading(false));
															}
														} else {
															toast.error("Celular é obrigatório");
															ownerCelInput.style.borderColor = "red";
														}
													} else {
														toast.error("Número do endereço é obrigatório");
														ownerNumberInput.style.borderColor = "red";
													}
												} else {
													toast.error("CEP é obrigatório");
													ownerCepInput.style.borderColor = "red";
												}
											} else {
												toast.error("CPF/CNPJ é obrigatório");
												ownerDocInput.style.borderColor = "red";
											}
										} else {
											toast.error("Email é obrigatório");
											ownerEmailInput.style.borderColor = "red";
										}
									} else {
										toast.error("Nome é obrigatório");
										ownerNameInput.style.borderColor = "red";
									}
								} else {
									toast.error("Insira um ccv válido");
									cardCcvInput.style.borderColor = "red";
								}
							} else {
								toast.error("Ccv é obrigatório");
								cardCcvInput.style.borderColor = "red";
							}
						} else {
							toast.error("Data de validade inválida, siga o padrão (MM/AAAA)");
							expireInput.style.borderColor = "red";
						}
					} else {
						toast.error("Data de validade é obrigatória");
						expireInput.style.borderColor = "red";
					}
				} else {
					toast.error("Insira um número de cartão válido");
					cardNumberInput.style.borderColor = "red";
				}
			} else {
				toast.error("Número do cartão é obrigatório");
				cardNumberInput.style.borderColor = "red";
			}
		} else {
			toast.error("Nome do dono é obrigatório");
			cardNameInput.style.borderColor = "red";
		}
	};

	const handleCpf = (e) => {
		// console.log(e)
		const data = e.target.value.replace(/\D/g, "");
		return data
			.replace(/\D/g, "")
			.replace(/(\d{3})(\d)/, "$1.$2") // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d{1,2})/, "$1-$2")
			.replace(/(-\d{2})(\d)/, "$1");
	};

	const handleCnpj = (e) => {
		const data = e.target.value.replace(/\D/g, "");
		return data
			.replace(/\D+/g, "") // não deixa ser digitado nenhuma letra
			.replace(/(\d{2})(\d)/, "$1.$2") // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1/$2") // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
			.replace(/(\d{4})(\d)/, "$1-$2")
			.replace(/(-\d{2})\d+?$/, "$1");
	};

	const handleCep = async (e) => {
		// console.log(e);
		setPostalCode(cepFormat(e.target.value));

		const res = await getCEP(e);
		if (res) {
			// console.log("Estado", res.uf);
			setUf(res.uf);
			setCity(res.localidade);
			setDistrict(res.bairro);
			setAddress(res.logradouro);
		}
	};

	const handleInputFocus = (e) => {
		setFocus(e.target.name);
	};

	const handleCardNumber = (string) => {
		const data = string.replace(/\D/g, "").replace(/(\d{16})\d+?$/, "$1");
		return data;
	};

	const handleExpiry = (string) => {
		const data = string
			.replace(/\D/g, "")
			.replace(/(\d{2})(\d)/, "$1/$2")
			.replace(/(\d{4})\d+?$/, "$1");
		return data;
	};

	const handleCvv = (string) => {
		const data = string.replace(/\D/g, "").replace(/(\d{3})\d+?$/, "$1");
		return data;
	};

	useEffect(() => {
		// console.log("Pedido", order);
		getOrder();
		// getPlans();
	}, []);

	useEffect(() => {
		if (Object.keys(orderInfo) != 0) {
			getPlans();
		}
	}, [orderInfo]);

	return (
		<CardData>
			<h3>{label}</h3>
			<br />
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
			<div className="input_row_2">
				<div className="input">
					<p>Valor: {translateValue(Number(totalValue))}</p>
				</div>
			</div>
			<br />
			<h4>Informações do cartão</h4>
			<br />
			<Cards
				focused={focus}
				cvc={ccv}
				expiry={expiry}
				name={holderName}
				number={cardNumber}
				placeholders={{ name: "SEU NOME AQUI" }}
				locale={{ valid: "VALIDADE" }}
			/>
			<br />
			<div className="input_row_2">
				<div className="input_2">
					<label>NOME DONO</label>
					<InputData
						id="cardName"
						name="name"
						placeholder="Nome dono *"
						style={{ width: "100%" }}
						value={holderName}
						onChange={(e) => setHolderName(e.target.value)}
						onFocus={handleInputFocus}
					/>
				</div>
				<div className="input_2">
					<label>NÚMERO CARTÃO</label>
					<InputData
						id="cardNumber"
						name="number"
						placeholder="Número cartão *"
						style={{ width: "100%" }}
						value={cardNumber}
						onChange={(e) => setCardNumber(handleCardNumber(e.target.value))}
						onFocus={handleInputFocus}
					/>
				</div>
			</div>
			<div className="input_row_2">
				<div className="input_2">
					<label>VALIDADE (MM/AAAA)</label>
					<InputData
						id="expire"
						name="expiry"
						placeholder="Validade *"
						style={{ width: "100%" }}
						value={expiry}
						onChange={(e) => setExpiry(handleExpiry(e.target.value))}
						onFocus={handleInputFocus}
					/>
				</div>
				<div className="input_2">
					<label>CCV</label>
					<InputData
						id="cardCcv"
						name="cvc"
						placeholder="Ccv *"
						style={{ width: "100%" }}
						value={ccv}
						onChange={(e) => setCcv(handleCvv(e.target.value))}
						onFocus={handleInputFocus}
					/>
				</div>
			</div>
			<br />
			<br />
			<h4>Informações do dono do cartão</h4>
			<div className="input_row_2">
				<div className="input_2">
					<label>NOME</label>
					<InputData
						id="ownerName"
						type="text"
						placeholder="Nome *"
						style={{ width: "100%" }}
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="input_2">
					<label>EMAIL</label>
					<InputData
						id="ownerEmail"
						type="text"
						placeholder="E-mail *"
						style={{ width: "100%" }}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
			</div>
			<div className="input_row_2">
				<div className="input_2">
					<label>CPF/CNPJ</label>
					<InputData
						id="ownerDoc"
						type="text"
						placeholder="CPF/CNPJ *"
						style={{ width: "100%" }}
						value={cpfCnpj}
						onChange={(e) => {
							if (e.target.value.replace(/\D+/g, "").length <= 11) {
								setCpfCnpj(handleCpf(e));
							} else {
								setCpfCnpj(handleCnpj(e));
							}
						}}
					/>
				</div>
				<div className="input_2">
					<label>CEP</label>
					<InputData
						id="ownerCep"
						type="text"
						placeholder="CEP *"
						style={{ width: "100%" }}
						value={postalCode}
						onChange={handleCep}
					/>
				</div>
			</div>
			<div className="input_row_2">
				<div className="input_2">
					<label>ESTADO</label>
					<InputData
						type="text"
						disabled={true}
						placeholder="Estado"
						style={{ width: "100%" }}
						value={uf}
					/>
				</div>
				<div className="input_2">
					<label>CIDADE</label>
					<InputData
						type="text"
						disabled={true}
						placeholder="Cidade"
						style={{ width: "100%" }}
						value={city}
					/>
				</div>
			</div>
			<div className="input_row_2">
				<div className="input_2">
					<label>BAIRRO</label>
					<InputData
						type="text"
						disabled={true}
						placeholder="Bairro"
						style={{ width: "100%" }}
						value={district}
					/>
				</div>
				<div className="input_2">
					<label>Endereço</label>
					<InputData
						type="text"
						disabled={true}
						placeholder="Endereço"
						style={{ width: "100%" }}
						value={address}
					/>
				</div>
			</div>
			<div className="input_row_2">
				<div className="input_2">
					<label>NÚMERO</label>
					<InputData
						id="ownerNumber"
						type="text"
						placeholder="Número *"
						style={{ width: "100%" }}
						value={addressNumber}
						onChange={(e) => setAddressNumber(e.target.value)}
					/>
				</div>
				<div className="input_2">
					<label>COMPLEMENTO</label>
					<InputData
						type="text"
						placeholder="Complemento"
						style={{ width: "100%" }}
						value={addressComplement}
						onChange={(e) => setAddressComplement(e.target.value)}
					/>
				</div>
			</div>
			<div className="input_row_2">
				<div className="input_2">
					<label>TELEFONE</label>
					<InputData
						type="text"
						placeholder="Telefone"
						style={{ width: "100%" }}
						value={phone}
						onChange={(e) => setPhone(phoneFormat(e.target.value))}
					/>
				</div>
				<div className="input_2">
					<label>CELULAR</label>
					<InputData
						id="ownerCel"
						type="text"
						placeholder="Celular *"
						style={{ width: "100%" }}
						value={mobile}
						onChange={(e) => setMobile(phoneFormat(e.target.value))}
					/>
				</div>
			</div>
			<br />
			<br />
			<h4>Criar assinatura para recarga?</h4>
			<h4>
				(As informações de cartão utilizadas para a criação da assinatura serão
				as informadas para esse pagamento)
			</h4>
			<div className="input_row_2">
				<Checkbox
					checked={createSubscription}
					onChange={(e) => {
						setCreateSubscription(e.target.checked);
					}}
				/>
				<div className="input">
					<label>DIA DO VENCIMENTO DA FATURA</label>
					<Select
						isSearchable={false}
						options={returnDays()}
						placeholder="Dia *"
						isDisabled={!createSubscription}
						menuPosition="fixed"
						onChange={(e) => {
							console.log(e);
							setDueDate(e.value);
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
						"FINALIZAR PAGAMENTO"
					)}
				</Button>
			</div>
		</CardData>
	);
};

/* eslint-disable react/prop-types */
import { FaUsers } from "react-icons/fa";
import { GiMoneyStack, GiTakeMyMoney } from "react-icons/gi";
import ReactLoading from "react-loading";

export const ComissionMetrics = ({
	totalClients,
	loadingClients,
	orderMetrics,
	loadingMetrics,
}) => {
	const translateValue = (value) => {
		let converted = new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(Number(value));
		return converted;
	};

	return (
		<>
			<div className="card_container">
				<div className="card">
					<div className="card_title">
						<h4>{`TOTAL DE CLIENTES`}</h4>
					</div>

					<div className="card_content_box">
						<div className="card_icon">
							<FaUsers size={50} color="#00D959" />
						</div>
						<hr />
						<div className="card_content">
							{!loadingClients ? (
								<h1>{totalClients}</h1>
							) : (
								<div className="loading">
									<ReactLoading type={"bars"} color={"#000"} />
								</div>
							)}

							<h5>{`Total clientes ativos`}</h5>
							{/* <hr style={{ width: '50%' }} /> */}
						</div>
					</div>
				</div>

				<div className="card">
					<div className="card_title">
						<h4>{`ENTRADAS`}</h4>
					</div>

					<div className="card_content_box">
						<div className="card_icon">
							<GiMoneyStack size={50} color="#00D959" />
						</div>
						<hr />
						<div className="card_content">
							{/* <hr style={{ width: '50%' }} /> */}
							<h1>
								{!loadingMetrics ? (
									translateValue(
										orderMetrics.Chips.Total.ConfirmedOrders +
											orderMetrics.Chips.Total.ReceivedOrders
									)
								) : (
									<div className="loading">
										<ReactLoading type={"bars"} color={"#000"} />
									</div>
								)}
							</h1>
							<h5>{`Total do faturamento`}</h5>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="card_title">
						<h4>{`COMISSÕES A PAGAR`}</h4>
					</div>

					<div className="card_content_box">
						<div className="card_icon">
							<GiTakeMyMoney size={50} color="#00D959" />
						</div>
						<hr />
						<div className="card_content">
							<h1>
								{new Intl.NumberFormat("pt-BR", {
									style: "currency",
									currency: "BRL",
								}).format(99)}
							</h1>
							<h5>{`Comissões a serem pagas neste mês`}</h5>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

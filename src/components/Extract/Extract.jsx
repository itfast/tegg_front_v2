/* eslint-disable react/prop-types */
import { ContainerTable } from "../../pages/resales/Resales.styles";
import { useEffect } from "react";
import ReactLoading from "react-loading";
import api from "../../services/api";

export const Extract = ({ orders, loadingOrders }) => {
	const translateValue = (value) => {
		let converted = new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
		return converted;
	};

	const getTotalValue = (order) => {
		let total = 0;
		if (order.Status === "RECEIVED" || order.Status === "CONFIRMED") {
			order.OrderItems.forEach((item) => {
				total += Number(item.Amount);
			});
		}
		return total;
	};

	const getDate = (date) => {
		let d = new Date(date);
		return d.toLocaleString().replace(",", " -");
	};

	// const formatPhone = (str) => {
	// 	if (str !== undefined) {
	// 		const fullNumber = str.toString();
	// 		const country = fullNumber.slice(0, 2);
	// 		const area = fullNumber.slice(2, 4);
	// 		const number1 = fullNumber.slice(4, 9);
	// 		const number2 = fullNumber.slice(9);
	// 		// console.log(fullNumber, country, area, number1, number2);
	// 		return `+${country} (${area}) ${number1}-${number2}`;
	// 	}
	// };

	useEffect(() => {
		// console.log(orders);
	}, []);

	return (
		<div className="card_container">
			<div className="card">
				<div className="card_title" style={{ borderRadius: "0 8px 0 0" }}>
					<h4>EXTRATO</h4>
				</div>
				<ContainerTable style={{ marginTop: 0, borderRadius: 0, padding: 0 }}>
					{!loadingOrders ? (
						<table id="customers">
							<thead>
								<tr>
									{api.currentUser.AccessTypes[0] !== "CLIENT" && (
										<th>Cliente</th>
									)}
									<th>Descrição</th>
									<th>Valor</th>
									<th>Data</th>
								</tr>
							</thead>
							{orders.map((o, ind) => (
								<tbody key={ind}>
									<tr>
										{api.currentUser.AccessTypes[0] !== "CLIENT" && (
											<td>
												{o.FinalClientId
													? o.FinalClient.Name
													: o.DealerPayer.CompanyName || o.DealerPayer.Name}
											</td>
										)}
										<td>
											{o.Type === 0 ? "Compra" : "Recarga de linha"}
										</td>
										<td>{translateValue(getTotalValue(o))}</td>
										<td>{getDate(o.CreatedAt)}</td>
									</tr>
								</tbody>
							))}
						</table>
					) : (
						<div className="loading">
							<ReactLoading type={"bars"} color={"#000"} />
						</div>
					)}
				</ContainerTable>
			</div>
		</div>
	);
};

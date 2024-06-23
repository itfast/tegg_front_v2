import { useEffect, useState } from "react";
import { PageLayout } from "../../../globalStyles";
import { ComissionsChart } from "../../components/charts/ComissionsChart";
import { ComissionMetrics } from "../../components/comissionMetrics/ComissionMetrics";
import api from "../../services/api";
import { translateError } from "../../services/util";
import { ContainerTable } from "../resales/Resales.styles";
import ReactLoading from "react-loading";

export const Comissions = () => {
	const [totalClients, setTotalClients] = useState(0);
	const [loadingClients, setLoadingClients] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [dealer, setDealer] = useState([]);
	const [loadingDealers, setLoadingDealers] = useState(true);

	const [orderMetrics, setOrderMetrics] = useState({
		Recharges: {
			Total: { ConfirmedOrders: 0, ReceivedOrders: 0 },
			Month: { ConfirmedOrders: 0, ReceivedOrders: 0 },
		},
		Chips: {
			Total: { ConfirmedOrders: 0, ReceivedOrders: 0 },
			Month: {
				ConfirmedOrders: 0,
				ReceivedOrders: 0,
			},
		},
	});
	const [loadingMetrics, setLoadingMetrics] = useState(true);

	const getMetrics = () => {
		api.order
			.getAllMetrics()
			.then((res) => {
				// console.log(res.data);
				setOrderMetrics(res.data);
			})
			.catch((err) => {
				translateError(err);
			})
			.finally(() => {
				setLoadingMetrics(false);
			});
	};

	const getDealers = () => {
		api.dealer
			.getAll(page, limit)
			.then((res) => {
				setDealer(res.data.dealers);
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoadingDealers(false);
			});
	};

	const getClients = () => {
		api.client
			.getTotals()
			.then((res) => {
				let total = 0;
				res.data?.TotalClients?.forEach((t) => {
					total += t._count?.Id;
				});
				// res.data?.TotalClientCreated?.forEach((t) => {
				//   total += t._count?.Id;
				// });
				// setMarkers(list);
				setTotalClients(total);
			})
			.catch((err) => {
				translateError(err);
			})
			.finally(() => {
				setLoadingClients(false);
			});
	};

	useEffect(() => {
		if (api.currentUser.AccessTypes[0] !== "TEGG") {
			api.user
				.logout()
				.then(() => {
					navigate("/login");
				})
				.catch((err) => {
					console.log(err);
				});
		}
		getDealers();
		getClients();
		getMetrics();
	}, []);

	return (
		<PageLayout>
			<ComissionMetrics
				totalClients={totalClients}
				loadingClients={loadingClients}
				orderMetrics={orderMetrics}
				loadingMetrics={loadingMetrics}
			/>
			<div style={{ margin: "1rem" }}>
				<ComissionsChart />
			</div>
			<ContainerTable>
				{/* <h2>Minhas revendas</h2> */}
				{!loadingDealers ? (
					dealer.length > 0 ? (
						<table id="customers">
							<thead>
								<tr>
									<th>Nome</th>
									<th>CNPJ/CPF</th>
									<th>Contato</th>
									<th>Valor</th>
								</tr>
							</thead>
							{dealer.map((d) => (
								<tbody key={d.Id}>
									<tr>
										<td>{d.CompanyName || d.Name}</td>
										<td>{d.Cnpj || d.Cpf}</td>
										<td>{d.Name}</td>
										<td>
											{new Intl.NumberFormat("pt-BR", {
												style: "currency",
												currency: "BRL",
											}).format(99)}
										</td>
									</tr>
								</tbody>
							))}
						</table>
					) : (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								height: 150,
							}}>
							<h2 style={{ color: "black", fontWeight: "bold" }}>
								Ainda não existem revendas cadastradas
							</h2>
						</div>
					)
				) : (
					<div className="loading">
						<ReactLoading type={"bars"} color={"#000"} />
					</div>
				)}
			</ContainerTable>
		</PageLayout>
	);
};

import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { ContainerMobile, ContainerWeb, PageLayout } from "../../../globalStyles";
import api from "../../services/api";
import { translateError } from "../../services/util";
import { ContainerTable } from "../resales/Resales.styles";
import { RechargeCard } from "./RechargeCard";
import { NewRechargeClient } from './newnew/NewRechargeClient'

export const Recharges = () => {
	const [loading, setLoading] = useState(true);

	const [plans, setPlans] = useState([]);

	const getPlans = () => {
		setLoading(true);
		api.plans
			.get()
			.then((res) => {
				// console.log(res.data);
				const pArray = res.data.filter(
					(plan) =>
						plan.Products.length === 1 && plan.Products[0].Product.SurfId
				);
				pArray.sort((a, b) => {
					return a.Products[0].Product.Amount - b.Products[0].Product.Amount;
				});
				setPlans(pArray);
			})
			.catch((err) => {
				// console.log(res);
				translateError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		getPlans();
	}, []);

	return (
		<>
		<ContainerWeb>
			{/* <PageLayout style={{padding: window.innerWidth < 768 && 0}}> */}
				{/* <ContainerTable> */}
					{/* <h2>Realizar recarga</h2> */}
					{loading ? (
						<div className="loading">
							<ReactLoading type={"bars"} color={"#000"} />
						</div>
					) : plans.length > 0 ? (
						// <div
						// 	style={{
						// 		marginTop: 40,
						// 		display: "flex",
						// 		flexWrap: "wrap",
						// 		justifyContent: "space-around",
						// 		gap: 10,
						// 	}}>
						// 	<RechargeCard
						// 		plan={plans[0]}
						// 		name={"Promo"}
						// 		size={"1 GB"}
						// 		internet={"1 GB (+ 3GB bônus)"}
						// 		extra={"0 GB"}
						// 		free={["Whatsapp"]}
						// 		price={"14,90"}
						// 	/>
						// 	<RechargeCard
						// 		plan={plans[1]}
						// 		name={"Basic"}
						// 		size={"7 GB"}
						// 		internet={"5 GB"}
						// 		extra={"1 GB"}
						// 		free={["Whatsapp", "Skeelo"]}
						// 		price={"44,90"}
						// 	/>
						// 	<RechargeCard
						// 		plan={plans[2]}
						// 		name={"Start"}
						// 		size={"13 GB"}
						// 		internet={"11 GB"}
						// 		extra={"1 GB"}
						// 		free={["Whatsapp", "Skeelo"]}
						// 		price={"54,90"}
						// 	/>
						// 	<RechargeCard
						// 		plan={plans[3]}
						// 		name={"Gold"}
						// 		size={"21 GB"}
						// 		internet={"19 GB"}
						// 		extra={"1 GB"}
						// 		free={["Whatsapp", "Skeelo"]}
						// 		price={"64,90"}
						// 	/>
						// 	<RechargeCard
						// 		plan={plans[4]}
						// 		name={"Plus"}
						// 		size={"44 GB"}
						// 		internet={"40 GB"}
						// 		extra={"2 GB"}
						// 		free={["Whatsapp", "Waze"]}
						// 		price={"84,90"}
						// 	/>
						// 	<RechargeCard
						// 		plan={plans[5]}
						// 		name={"Family"}
						// 		size={"80 GB"}
						// 		internet={"70 GB"}
						// 		extra={"5 GB"}
						// 		free={["Whatsapp", "Skeelo", "Waze"]}
						// 		price={"177,90"}
						// 	/>
						// 	<RechargeCard
						// 		plan={plans[6]}
						// 		name={"Ultra"}
						// 		size={"100 GB"}
						// 		internet={"80 GB"}
						// 		extra={"10 GB"}
						// 		free={["Whatsapp", "Skeelo", "Waze"]}
						// 		price={"217,90"}
						// 	/>
						// </div>
						<NewRechargeClient/>
					) : (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								height: 150,
							}}>
							<h2 style={{ color: "black", fontWeight: "bold" }}>
								Não existem planos cadastrados
							</h2>
						</div>
					)}
				{/* </ContainerTable> */}
			{/* </PageLayout> */}
			</ContainerWeb>
			<ContainerMobile>
				{/* <div id="banner" style={{height: "100%"}}> */}
					{/* <PageLayout> */}
						<NewRechargeClient/>
					{/* </PageLayout> */}
				{/* </div> */}
			</ContainerMobile>
		</>
	);
};

import { useEffect, useState } from "react";
import { PageLayout } from "../../../../globalStyles";
import { PlansData } from "./PlansData";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../services/api";
import { translateError } from "../../../services/util";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const NewPlans = () => {
	const { t } = useTranslation()
	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const [info, setInfo] = useState(false);

	const [plan, setPlan] = useState({
		Name: "",
		Amount: "",
		MinimumInvestment: "",
		MaximumInvestment: "",
		Performance: "",
		EarningsCeiling: null,
		Duration: "",
		PointsForCarrerPlan: "",
		Products: [],
		Type: 'BUY',
		DealerCanBuy: false,
		FinalClientCanBuy: false,
		Internet: '',
		Extra: '',
		ExtraPortIn: '',
		Free: '',
		Size: '',
		Comments: '',
		OnlyInFirstRecharge: false,
	});

	useEffect(() => {
		if (api.currentUser.AccessTypes[0] === "CLIENT") {
			api.user
				.logout()
				.then(() => {
					navigate("/login");
				})
				.catch((err) => {
					console.log(err);
				});
		}
		if (location?.state?.plan) {
			setPlan(location?.state?.plan);
		}
		if (location.pathname === "/plans/info") {
			setInfo(true);
		}
	}, []);

	const handleNext = (prodList) => {
		setLoading(true);
		if (location?.pathname === "/plans/edit") {
			api.plans
				.edit(plan.Id, plan, prodList)
				.then((res) => {
					toast.success(res.data.Message);
					navigate("/plans");
				})
				.catch((err) => translateError(err))
				.finally(() => setLoading(false));
		} else {
			api.plans
				.new(plan, prodList)
				.then((res) => {
					// console.log(res);
					toast.success(res.data.Message);
					navigate("/plans");
				})
				.catch((err) => {
					translateError(err);
				})
				.finally(() => setLoading(false));
		}
	};

	const goBack = () => {
		navigate("/plans");
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				{location?.pathname === "/plans/edit"
					? t('plans.modalPlan.updateLabel')
					: location?.pathname === "/plans/info"
					? t('plans.modalPlan.detailsLabel')
					: t('plans.modalPlan.newLabel')}
			</h2>
			<PlansData
				loading={loading}
				info={info}
				goStep={handleNext}
				goBackStep={goBack}
				plan={plan}
				setPlan={setPlan}
				label={t('plans.modalPlan.modalLabel')}
			/>
		</PageLayout>
	);
};

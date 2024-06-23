import { useEffect, useState } from "react";
import { PageLayout } from "../../../../globalStyles";
import { ActivateEsimData } from "./ActivateEsimData";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import { translateError } from "../../../services/util";

export const ActivateEsim = () => {
	const navigate = useNavigate();

	const { id } = useParams();

	const [loading, setLoading] = useState(true);

	const [line, setLine] = useState({});

	const getLine = () => {
		api.iccid
			.getSome(1, 1, id)
			.then((res) => {
				// console.log(res.data.iccids);
				setLine(res.data.iccids[0]);
			})
			.catch((err) => {
				console.log(err);
				translateError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		// console.log(api.currentSession);
		getLine();
	}, []);

	const goBack = () => {
		navigate("/lines");
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				Ativar e-Sim no celular
			</h2>
			<ActivateEsimData loading={loading} line={line} goBackStep={goBack} />
		</PageLayout>
	);
};

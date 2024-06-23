import { PageLayout } from "../../../../globalStyles";
import { EditIccidsData } from "./EditIccidsData";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import api from '../../../services/api';

export const EditIccids = () => {
	const navigate = useNavigate();

	const { id } = useParams();

	const goBack = () => {
		navigate("/orders");
	};

	useEffect(() => {
		// console.log(api.currentUser);
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
	}, []);

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				Editar ICCIDS do pedido
			</h2>
			<EditIccidsData
				order={id}
				goBackStep={goBack}
				label={"Esolha um novo ICCID para substituir algum já existente"}
			/>
		</PageLayout>
	);
};

import { useEffect, useState } from "react";
import { PageLayout } from "../../../../globalStyles";
import { PortRequestData } from "./PortRequestData";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { cleanNumber, translateError } from "../../../services/util";
import { toast } from "react-toastify";

export const NewPortRequest = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [client, setClient] = useState({});
	const [line, setLine] = useState({});
	const [newNumber, setNewNumber] = useState("");
	const [provider, setProvider] = useState("");

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
		// console.log(api.currentUser);
	}, []);

	const createPortRequest = (window) => {
		api.line
			.createPortRequest(
				api.currentUser.DealerId,
				client.Id,
				"PENDING",
				window,
				0,
				line.SurfMsisdn,
				newNumber,
				provider
			)
			.then((res) => {
				toast.success(res.data.Message);
				navigate("/portRequests");
			})
			.catch((err) => {
				console.log(err);
				translateError(err);
			});
	};

	const handleNext = () => {
		setLoading(true);
		api.line
			.portIn(
				Number(cleanNumber(line.SurfMsisdn)),
				Number(cleanNumber(newNumber)),
				provider,
				Number(cleanNumber(client.Cnpj)) || Number(cleanNumber(client.Cpf)),
				client.Name
			)
			.then((res) => {
				toast.success(res.data.Message);
				createPortRequest(res.data.Data.janelaPortabilidade.slice(0, 10));
			})
			.catch((err) => {
				console.log(err);
				translateError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const goBack = () => {
		navigate("/portRequests");
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				Informe os dados do novo pedido de portabilidade
			</h2>
			<PortRequestData
				loading={loading}
				goStep={handleNext}
				goBackStep={goBack}
				client={client}
				setClient={setClient}
				line={line}
				setLine={setLine}
				newNumber={newNumber}
				setNewNumber={setNewNumber}
				provider={provider}
				setProvider={setProvider}
				label={"Requisição"}
			/>
		</PageLayout>
	);
};

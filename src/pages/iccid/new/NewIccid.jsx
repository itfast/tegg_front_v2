import { useEffect, useState } from "react";
import { PageLayout } from "../../../../globalStyles";
import { IccidData } from "./IccidData";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../services/api";
import { translateError } from "../../../services/util";
import { toast } from "react-toastify";

export const NewIccid = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const [iccid, setIccid] = useState("");
	const [lpa, setLpa] = useState("");
	const [withSF, setWithSF] = useState(false);

	useEffect(() => {
		// console.log(location);
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
		if (location?.state?.iccid) {
			// console.log(location?.state?.iccid);
			setIccid(location?.state?.iccid);
		}
	}, []);

	const handleNext = () => {
		setLoading(true);
		if (location?.pathname === "/iccids/edit") {
		} else {
			// console.log(iccid);
			api.iccid
				.create(iccid, lpa, withSF)
				.then((res) => {
					// console.log(res);
					toast.success(res.data.Message);
					navigate("/iccids");
				})
				.catch((err) => {
					translateError(err);
					console.log(err);
				})
				.finally(() => setLoading(false));
		}
	};

	const goBack = () => {
		navigate("/iccids");
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				{location?.pathname === "/iccids/edit"
					? "Atualização de ICCID"
					: "Informe os dados do novo ICCID"}
			</h2>
			<IccidData
				loading={loading}
				goStep={handleNext}
				goBackStep={goBack}
				iccid={iccid}
				setIccid={setIccid}
				lpa={lpa}
				setLpa={setLpa}
				withSF={withSF}
				setWithSF={setWithSF}
				label={"ICCIDs"}
			/>
		</PageLayout>
	);
};

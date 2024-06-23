/* eslint-disable react/prop-types */
import { Button } from "../../../../globalStyles";
import { CardData, InputData } from "../../resales/Resales.styles";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { iccidFormat } from "../../../services/util";
import Checkbox from "@mui/material/Checkbox";

export const IccidData = ({
	goStep,
	goBackStep,
	iccid,
	setIccid,
	lpa,
	setLpa,
	withSF,
	setWithSF,
	label,
	loading,
}) => {
	const location = useLocation();

	const iccidInput = document.getElementById("iccid");

	const handleNext = () => {
		if (iccid !== "") {
			if (iccid.length == 19) {
				iccidInput?.style.removeProperty("border-color");
				goStep();
			} else {
				toast.error("Insira um Iccid válido");
				iccidInput.style.borderColor = "red";
			}
		} else {
			toast.error("Iccid é obrigatório");
			iccidInput.style.borderColor = "red";
		}
	};

	const handleLPA = (string) => {
		setLpa(string);
		if (string !== "") {
			if (withSF) {
				setWithSF(false);
			}
		}
	};

	const handleCheckbox = (bool) => {
		if (lpa !== "") {
			toast.error("Um e-SIM não pode estar no estoque da SpeedFlow");
		} else {
			setWithSF(bool);
		}
	};

	return (
		<CardData>
			<h3>{label}</h3>
			<div style={{ width: "100%", margin: "1rem", display: "flex" }}>
				<div style={{ width: "100%", marginRight: "1%" }}>
					<label>ICCID</label>
					<InputData
						id="iccid"
						placeholder="Iccid *"
						style={{ width: "100%" }}
						value={iccid}
						onChange={(e) => setIccid(iccidFormat(e.target.value))}
					/>
				</div>
			</div>
			<div style={{ width: "100%", margin: "1rem", display: "flex" }}>
				<div style={{ width: "100%", marginRight: "1%" }}>
					<label>
						Código de ativação de e-Sim (Deixe em branco caso seja um chip
						físico)
					</label>
					<InputData
						id="lpa"
						placeholder='Código de ativação ("LPA:*****************")'
						style={{ width: "100%" }}
						value={lpa}
						onChange={(e) => handleLPA(e.target.value)}
					/>
				</div>
			</div>
			<div className="input_row_2">
				<div className="checkbox">
					<Checkbox
						checked={withSF}
						disabled={lpa !== ""}
						onChange={(e) => handleCheckbox(e.target.checked)}
					/>
				</div>
				<div
					className="input"
					style={{ display: "flex", alignItems: "center" }}>
					<h4>
						ICCID está no estoque da SpeedFlow? (Deixe essa caixa desmarcada
						para indicar que o ICCID está no estoque físico da TEGG, marque-a
						para indicar que o ICCID está no estoque da SpeedFlow) (Caso o ICCID
						seja um e-SIM essa opção será desmarcada, uma vez que e-SIMs não são
						físicos e não podem ser enviados por frete)
					</h4>
				</div>
			</div>
			<div className="flex end">
				<div className="btn_container btn_invert">
					<Button invert onClick={goBackStep}>
						VOLTAR
					</Button>
					<Button
						//  notHover
						onClick={handleNext}>
						{loading ? (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: 15,
								}}>
								<ReactLoading type={"bars"} color={"#fff"} />
							</div>
						) : location.pathname === "/iccids/new" ? (
							"CADASTRAR"
						) : location.pathname === "/iccids/edit" ? (
							"ATUALIZAR"
						) : (
							"PRÓXIMO"
						)}
					</Button>
				</div>
			</div>
		</CardData>
	);
};

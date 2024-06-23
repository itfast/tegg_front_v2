/* eslint-disable react/prop-types */
import { Button } from "../../../../globalStyles";
import { CardData, FooterButton } from "../../resales/Resales.styles";
import ReactLoading from "react-loading";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";

export const ActivateEsimData = ({ loading, line, goBackStep }) => {
	useEffect(() => {
		// console.log(line);
	}, [line]);
	return (
		<CardData>
			{loading ? (
				<div className="loading">
					<ReactLoading type={"bars"} color={"#000"} />
				</div>
			) : Object.keys(line).length !== 0 ? (
				<div
					style={{
						width: "100%",
						margin: "1rem",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						gap: 40,
					}}>
					<h3>
						Escaneie o QR-Code abaixo ou insira o código de ativação completo
						nas configurações do seu celular
					</h3>
					<QRCodeSVG value={line.LPAUrl} size={250} />
					<p>
						<span style={{ fontWeight: "bold" }}>Código de ativação:</span>{" "}
						{line.LPAUrl}
					</p>
				</div>
			) : (
				<div
					style={{
						width: "100%",
						margin: "1rem",
						display: "flex",
						justifyContent: "center",
					}}>
					<h3>
						Não foi possível coletar as informações da linha, espere alguns
						momentos e tente novamente.
					</h3>
				</div>
			)}
			<FooterButton>
				<Button invert onClick={goBackStep}>
					VOLTAR
				</Button>
			</FooterButton>
		</CardData>
	);
};

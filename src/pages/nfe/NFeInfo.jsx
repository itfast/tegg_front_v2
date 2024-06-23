import ReactLoading from "react-loading";
import { Button } from "../../../globalStyles";
import { toast } from "react-toastify";
import { AiOutlineReload, AiOutlineFilePdf } from "react-icons/ai";
import { BsFiletypeXml } from "react-icons/bs";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { translateError } from "../../services/util";

export const NFeInfo = ({ nfe, search, pageNum, pageSize }) => {
	const [showResend, setShowResend] = useState(false);
	const [loadingResend, setLoadingResend] = useState(false);

	const resendNFe = () => {
		setLoadingResend(true);
		api.nfe
			.resend(nfe.Id)
			.then((res) => {
				toast.success(res.data.Message);
				search(pageNum, pageSize);
			})
			.catch((err) => {
				console.log(err);
				translateError(err);
			})
			.finally(() => {
				setLoadingResend(false);
			});
	};

	const translateDate = (string) => {
		if (string) {
			const date = new Date(string);
			return `${date.getDate().toString().padStart(2, "0")}/${(
				date.getMonth() + 1
			)
				.toString()
				.padStart(2, "0")}/${date.getFullYear()} - ${date
				.getHours()
				.toString()
				.padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
		} else {
			return "-";
		}
	};

	const translateStatus = (num) => {
		return num === 100 ? "Sucesso" : "Erro";
	};

	useEffect(() => {
		// console.log(api.currentUser);
		// console.log(nfe);
	}, []);

	return (
		<>
			<tbody>
				<tr>
					<td>{nfe.Number}</td>
					<td>{nfe.Group}</td>
					<td>{translateStatus(nfe.StatusCode)}</td>
					<td>{nfe.StatusDesc}</td>
					<td>{nfe.AccessKey}</td>
					<td>
						<div style={{ display: "flex", justifyContent: "center" }}>
							{nfe.Protocol || "-"}
						</div>
					</td>
					<td>{nfe.DigestValue}</td>
					<td>
						<div style={{ display: "flex", justifyContent: "center" }}>
							{nfe.StatusCode !== 100 ? (
								"-"
							) : (
								<a
									href={nfe.PDFLink}
									style={{ color: "inherit" }}
									target="_blank"
									rel="noopener noreferrer">
									<AiOutlineFilePdf size={25} style={{ cursor: "pointer" }} />
								</a>
							)}
						</div>
					</td>
					<td>
						<div style={{ display: "flex", justifyContent: "center" }}>
							{nfe.StatusCode !== 100 ? (
								"-"
							) : (
								<a
									href={nfe.XMLLink}
									style={{ color: "inherit" }}
									target="_blank"
									rel="noopener noreferrer">
									<BsFiletypeXml size={25} style={{ cursor: "pointer" }} />
								</a>
							)}
						</div>
					</td>
					<td>
						<div style={{ display: "flex", justifyContent: "center" }}>
							{translateDate(nfe.AuthTime)}
						</div>
					</td>
					{api.currentUser.AccessTypes[0] !== "CLIENT" && (
						<td>
							<div style={{ display: "flex", justifyContent: "center" }}>
								{nfe.StatusCode === 100 ||
								(nfe.StatusCode !== 100 &&
									nfe.Order?.DealerId !== api.currentUser?.DealerId) ? (
									"-"
								) : (
									<AiOutlineReload
										size={25}
										style={{ cursor: "pointer" }}
										onClick={() => {
											setShowResend(true);
										}}
									/>
								)}
							</div>
						</td>
					)}
				</tr>
			</tbody>
			<Dialog
				open={showResend}
				onClose={() => {
					setShowResend(false);
				}}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">Reemitir NF-e</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						<p>Atenção!</p>
						<p>
							Confira todas as informações referentes a NF-e antes de reemitir
							para evitar novos erros.
						</p>
						<p>
							Após confirmar todos os dados clique no botão abaixo para reemitir
							a nota.
						</p>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						invert
						onClick={() => {
							setShowResend(false);
						}}>
						FECHAR
					</Button>
					<Button
						onClick={() => {
							resendNFe();
						}}>
						{loadingResend ? (
							<div className="loading">
								<ReactLoading type={"bars"} color={"#000"} />
							</div>
						) : (
							"REEMITIR"
						)}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

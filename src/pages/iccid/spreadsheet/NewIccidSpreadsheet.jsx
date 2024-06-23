import { useState, useEffect } from "react";
import { PageLayout } from "../../../../globalStyles";
import { IccidDataSpreadsheet } from "./IccidDataSpreadsheet";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { translateError } from "../../../services/util";
import { toast } from "react-toastify";
// import { IoMdDownload } from "react-icons/io";
// import { Button } from "../../../../globalStyles";
// import xlsx from "node-xlsx";
// import fs from "fs";
// const path = require("path");

export const NewIccidSpreadsheet = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(null);

	const handleNext = async () => {
		setLoading(true);
		const formData = new FormData();
		formData.append("fileIccids", file);

		api.iccid
			.sendXls(formData)
			.then((res) => {
				// console.log(res);
				toast.success(res.data.Message);
				navigate("/iccids");
			})
			.catch((err) => {
				console.log(
					JSON.stringify(err, ["message", "arguments", "type", "name"])
				);
				// toast.error(err.message);
				translateError(err);
			})
			.finally(() => setLoading(false));
	};

	const goBack = () => {
		navigate("/iccids");
	};

	// const downloadExample = () => {
	// 	const sheetOptions = { "!cols": [{ wch: 20 }, { wch: 20 }, { wch: 10 }] };
	// 	var buffer = xlsx.build([
	// 		{
	// 			name: "Planilha de exemplo",
	// 			data: [
	// 				[
	// 					"8955170110318000369",
	// 					"",
	// 					"0",
	// 					"",
	// 					"",
	// 					"(Exemplo de ICCID físico no estoque da TEGG)",
	// 				],
	// 				[
	// 					"8955170110318000369",
	// 					"LPA:1$sm-v4-064-a-gtm.pr.go-esim.com$LpaDeExemplo",
	// 					"0",
	// 					,
	// 					"",
	// 					"",
	// 					"(Exemplo de e-SIM no estoque da TEGG)",
	// 				],
	// 				[
	// 					"8955170110318000369",
	// 					"",
	// 					"1",
	// 					"",
	// 					"",
	// 					"(Exemplo de ICCID físico no estoque da SpeedFlow)",
	// 				],
	// 			],
	// 			options: sheetOptions,
	// 		},
	// 	]);

	// 	fs.writeFile(`./Planilha_Exemplo.xlsx`, buffer, "utf8", (err) => {
	// 		if (err) {
	// 			console.log(JSON.stringify(err, null, 2));
	// 		}
	// 	});

	// 	// const blob = fs.openAsBlob(
	// 	// 	path.resolve(__dirname, "..", `../Planilha_Exemplo.xlsx`)
	// 	// );

	// 	var url = URL.createObjectURL(blob);
	// 	var a = document.createElement("a");
	// 	a.download = `Planilha_Exemplo.xlsx`;
	// 	a.href = url;
	// 	document.body.appendChild(a);
	// 	a.click();

	// 	// fs.unlinkSync(path.resolve(__dirname, "..", `../Planilha_Exemplo.xlsx`));
	// };

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
	}, []);

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				Adicionar planilha de ICCIDs
			</h2>
			<IccidDataSpreadsheet
				loading={loading}
				goStep={handleNext}
				goBackStep={goBack}
				file={file}
				setFile={setFile}
				label={"PLANILHA"}
			/>
			<div style={{ marginTop: 40, marginLeft: 40 }}>
				<h2 style={{ fontWeight: "bold", marginBottom: 20 }}>Instruções</h2>
				<ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
					<li>Para adicionar os ICCIDS envie um arquivo .xlsx</li>
					<li>
						As informações sobre os ICCIDs devem estar na página 1 do arquivo,
						qualquer ICCID em outra página será ignorado
					</li>
					<li>
						A primeira linha do arquivo é apenas um cabeçalho e será ignorada. Informe o ICCID da segunda linha em diante.
					</li>
					<li>
						Os ICCIDs devem estar em linhas consecutivas da tabela, caso haja
						uma linha em branco entre os ICCIDs, todos abaixo da linha em branco
						serão ignorados
					</li>
					<li>
						Os números dos ICCIDS devem estar na coluna de número 1 da planilha,
						qualquer ICCID em outra coluna será ignorado
					</li>
					<li>
						Os ICCIDS devem ter um tamanho de 19 caracteres e conter apenas
						números, qualquer ICCID com outra formatação será ignorado
					</li>
					<li>
						Caso o ICCID seja e-SIM, o código de ativação de e-SIM do mesmo deve
						estar na coluna de número 2 da planilha, qualquer código em outra
						coluna será ignorado
					</li>
					<li>
						A terceira coluna da tabela deve ser preenchida com a informação se
						o ICCID está no estoque local da TEGG ou com a SpeedFlow, caso seja
						do estoque local da TEGG informe um 0, caso esteja com a SpeeFlow
						informe um 1, qualquer ICCID que não tenha essa informação ou que
						tenha qualquer outra informação além de 1 e 0 nessa coluna será
						ignorado
					</li>
				</ul>
			</div>
			<br />
			{/* <Button
				//  nothover
				style={{ marginLeft: 20 }}
				onClick={downloadExample}>
				<div style={{ display: "flex", gap: 5 }}>
					<p>PLANILHA DE EXEMPLO</p>
					<IoMdDownload size={20} />
				</div>
			</Button> */}
		</PageLayout>
	);
};

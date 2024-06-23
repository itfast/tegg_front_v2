/* eslint-disable react/prop-types */
import { Button } from "../../../../globalStyles";
import { CardData, InputData, Select, SelectUfs } from "../Resales.styles";
import { banks } from "./banks";
import { toast } from "react-toastify";
import { cpfFormat, validateCpf, phoneFormat, cnpjFormat, validateCnpj } from "../../../services/util";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line no-unused-vars
export const BankAccount = ({ goStep, goBackStep, bank, setBank }) => {
	const {t} = useTranslation()
	// const pixTypeInput = document.getElementById("pixType");
	// const pixKeyInput = document.getElementById("pixKey");
	// const bankInput = document.getElementById("bankI");
	// const agencyInput = document.getElementById("agency");
	// const accountInput = document.getElementById("account");

	// const emailRegex = new RegExp(
	// 	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	// 	"gm"
	// );

	const handleBank = (e) => {
		const has = banks.find((b) => b.bank === e.target.value);
		if (!has && bank.bank !== "") {
			toast.error(t('Bank.selectBankList'));
			setBank({ ...bank, bankName: "" });
		}
	};

	const handleNext = () => {
		goStep();
		// if (bank.type !== "") {
		// 	if (bank.type === "PIX") {
		// 		if (bank.pixType !== "") {
		// 			pixTypeInput?.style.removeProperty("border-color");
		// 			if (bank.pixKey !== "") {
		// 				if (bank.pixType === "EMAIL" && emailRegex.test(bank.pixKey)) {
		// 					pixKeyInput?.style.removeProperty("border-color");
		// 					goStep();
		// 				} else if (bank.pixType === "CPF" && validateCpf(bank.pixKey)) {
		// 					pixKeyInput?.style.removeProperty("border-color");
		// 					goStep();
		// 				} else if (bank.pixType === "CNPJ" && validateCnpj(bank.pixKey)) {
		// 					pixKeyInput?.style.removeProperty("border-color");
		// 					goStep();
		// 				} 
						
		// 				else if (
		// 					bank.pixType === "TELEFONE" &&
		// 					(bank.pixKey.replace(/\D/g, "").length === 10 ||
		// 						bank.pixKey.replace(/\D/g, "").length === 11)
		// 				) {
		// 					pixKeyInput?.style.removeProperty("border-color");
		// 					goStep();
		// 				} else {
		// 					toast.error(t('Bank.informKeyPixValid'));
		// 					pixKeyInput.style.borderColor = "red";
		// 				}
		// 			} else {
		// 				toast.error(t('Bank.informKeyPix'));
		// 				pixKeyInput.style.borderColor = "red";
		// 			}
		// 		} else {
		// 			toast.error(t('Bank.informTypeKeyPix'));
		// 			pixTypeInput.style.borderColor = "red";
		// 		}
		// 	} else if (bank.type === "TRANSFER") {
		// 		if (bank.bank !== "") {
		// 			bankInput?.style.removeProperty("border-color");
		// 			if (bank.ag !== "") {
		// 				agencyInput?.style.removeProperty("border-color");
		// 				if (bank.account) {
		// 					accountInput?.style.removeProperty("border-color");
		// 					goStep();
		// 				} else {
		// 					toast.error(t('Bank.informAccount'));
		// 					accountInput.style.borderColor = "red";
		// 				}
		// 			} else {
		// 				toast.error(t('Bank.informAgency'));
		// 				agencyInput.style.borderColor = "red";
		// 			}
		// 		} else {
		// 			toast.error(t('Bank.selectBank'));
		// 			bankInput.style.borderColor = "red";
		// 		}
		// 	}
		// } else {
		// 	toast.error(t('Bank.typeWithdrawal'));
		// }
	};

	return (
		<CardData style={{maxWidth: '1000px', margin: 'auto'}}>
			<h5>{t('Bank.dataBankTitle')}</h5>
			<div className="input_row_1">
				<SelectUfs
					placeholder="Tipo de retirada"
					value={bank.type}
					onChange={(e) => setBank({ ...bank, type: e.target.value })}
					className="input_3"
					defaultValue={""}>
					<option disabled value={""}>
						{t('Bank.selectTypeWithdrawal')}
					</option>
					<option value={"PIX"}>PIX</option>
					<option value={"TRANSFER"}>{t('Bank.transfer')}</option>
				</SelectUfs>
			</div>
			{bank.type === "PIX" && (
				<div className="input_row_2">
					<SelectUfs
						placeholder="Tipo Chave PIX"
						id="pixType"
						value={bank.pixType}
						onChange={(e) =>
							setBank({ ...bank, pixType: e.target.value, pixKey: "" })
						}
						className="input_2"
						defaultValue={""}>
						<option disabled value={""}>
							{t('Bank.typeKeyPix')}
						</option>
						<option value={"CPF"}>{t('Bank.cpf')}</option>
						<option value={"CNPJ"}>{t('Bank.cnpj')}</option>
						<option value={"TELEFONE"}>{t('Bank.phone')}</option>
						<option value={"EMAIL"}>{t('Bank.email')}</option>
					</SelectUfs>
					<InputData
						type="text"
						id="pixKey"
						placeholder={t('Bank.key')}
						className="input_2"
						value={bank.pixKey}
						onChange={(e) => {
							if (bank.pixType === "CPF") {
								setBank({ ...bank, pixKey: cpfFormat(e) });
							} else if(bank.pixType === "CNPJ"){
								setBank({ ...bank, pixKey: cnpjFormat(e)})
							} else if (bank.pixType === "TELEFONE") {
								setBank({ ...bank, pixKey: phoneFormat(e.target.value) });
							} else {
								setBank({ ...bank, pixKey: e.target.value });
							}
						}}
					/>
				</div>
			)}
			{bank.type === "TRANSFER" && (
				<>
					<div className="input_row_3">
						<Select
							placeholder={t('Bank.bank')}
							id="bankI"
							onBlur={handleBank}
							className="input_3"
							list="bank"
							value={bank.bankName}
							onChange={(e) => setBank({ ...bank, bankName: e.target.value })}
						/>
						<datalist id="bank">
							{banks.map((b, i) => (
								<option key={i} value={b.bank}>
									{b.bank}
								</option>
							))}
						</datalist>
						<InputData
							type="text"
							id="agency"
							placeholder={t('Bank.agency')}
							className="input_3"
							value={bank.ag}
							onChange={(e) => setBank({ ...bank, ag: e.target.value })}
						/>
						<InputData
							type="text"
							placeholder={t('Bank.agencyDigit')}
							className="input_3"
							value={bank.agDigit}
							onChange={(e) => setBank({ ...bank, agDigit: e.target.value })}
						/>
					</div>
					<div className="input_row_3">
						<InputData
							type="text"
							id="account"
							placeholder={t('Bank.account')}
							className="input_3"
							value={bank.account}
							onChange={(e) => setBank({ ...bank, account: e.target.value })}
						/>
						<InputData
							type="text"
							placeholder={t('Bank.accountDigit')}
							className="input_3"
							value={bank.accountDigit}
							onChange={(e) =>
								setBank({ ...bank, accountDigit: e.target.value })
							}
						/>
						<InputData
							type="text"
							placeholder={t('Bank.operation')}
							className="input_3"
							value={bank.op}
							onChange={(e) => setBank({ ...bank, op: e.target.value })}
						/>
					</div>
				</>
			)}

			<div className="flex end btn_invert">
				<Button invert onClick={goBackStep}>
					{t('Bank.goback')}
				</Button>
				<Button notHover onClick={handleNext}>
					{t('Bank.next')}
				</Button>
			</div>
		</CardData>
	);
};

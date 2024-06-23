/* eslint-disable react/prop-types */
// import { Button } from "../../../../globalStyles";
import { InputData, Select, SelectUfs } from "../Resales.styles";
import { banks } from "./banks";
import { toast } from "react-toastify";
import { cpfFormat, phoneFormat, cnpjFormat } from "../../../services/util";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line no-unused-vars
export const BankAccountExtern = ({ goStep, goBackStep, bank, setBank }) => {
  const { t } = useTranslation();
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
      toast.error(t("ErrorMsgs.bankListError"));
      setBank({ ...bank, bankName: "" });
    }
  };

  // const handleNext = () => {
  // 	if (bank.type !== "") {
  // 		if (bank.type === "PIX") {
  // 			if (bank.pixType !== "") {
  // 				pixTypeInput?.style.removeProperty("border-color");
  // 				if (bank.pixKey !== "") {
  // 					if (bank.pixType === "EMAIL" && emailRegex.test(bank.pixKey)) {
  // 						pixKeyInput?.style.removeProperty("border-color");
  // 						goStep();
  // 					} else if (bank.pixType === "CPF" && validateCpf(bank.pixKey)) {
  // 						pixKeyInput?.style.removeProperty("border-color");
  // 						goStep();
  // 					} else if (bank.pixType === "CNPJ" && validateCnpj(bank.pixKey)) {
  // 						pixKeyInput?.style.removeProperty("border-color");
  // 						goStep();
  // 					}

  // 					else if (
  // 						bank.pixType === "TELEFONE" &&
  // 						(bank.pixKey.replace(/\D/g, "").length === 10 ||
  // 							bank.pixKey.replace(/\D/g, "").length === 11)
  // 					) {
  // 						pixKeyInput?.style.removeProperty("border-color");
  // 						goStep();
  // 					} else {
  // 						toast.error("Informe uma chave PIX válida.");
  // 						pixKeyInput.style.borderColor = "red";
  // 					}
  // 				} else {
  // 					toast.error("Informe o chave PIX.");
  // 					pixKeyInput.style.borderColor = "red";
  // 				}
  // 			} else {
  // 				toast.error("Informe o tipo de chave PIX.");
  // 				pixTypeInput.style.borderColor = "red";
  // 			}
  // 		} else if (bank.type === "TRANSFER") {
  // 			if (bank.bank !== "") {
  // 				bankInput?.style.removeProperty("border-color");
  // 				if (bank.ag !== "") {
  // 					agencyInput?.style.removeProperty("border-color");
  // 					if (bank.account) {
  // 						accountInput?.style.removeProperty("border-color");
  // 						goStep();
  // 					} else {
  // 						toast.error("Informe a conta");
  // 						accountInput.style.borderColor = "red";
  // 					}
  // 				} else {
  // 					toast.error("Informe a agência.");
  // 					agencyInput.style.borderColor = "red";
  // 				}
  // 			} else {
  // 				toast.error("Selecione o banco.");
  // 				bankInput.style.borderColor = "red";
  // 			}
  // 		}
  // 	} else {
  // 		toast.error("Informe o tipo de retirada.");
  // 	}
  // };

  return (
    <>
      {/* <h5>DADOS BANCÁRIOS</h5> */}
      <div className="input_row_1new">
        <div style={{ width: "100%" }}>
          <h5>Tipo</h5>

          <SelectUfs
            placeholder={t("Register.bank.withdrawalType")}
            value={bank.type}
            onChange={(e) => setBank({ ...bank, type: e.target.value })}
            className="input_3"
            defaultValue={""}
          >
            <option disabled value={""}>
              {t("Register.bank.withdrawalType")}
            </option>
            <option value={"PIX"}>PIX</option>
            <option value={"TRANSFER"}>TRANSFERÊNCIA</option>
          </SelectUfs>
        </div>
      </div>
      {bank.type === "PIX" && (
        <div className="input_row_2new">
          <div style={{ width: "100%" }}>
            <h5>Tipo de chave PIX</h5>
            <SelectUfs
              style={{ width: "100%" }}
              placeholder={t("Register.bank.typeKeyPix")}
              id="pixType"
              value={bank.pixType}
              onChange={(e) =>
                setBank({ ...bank, pixType: e.target.value, pixKey: "" })
              }
              className="input_2"
              defaultValue={""}
            >
              <option disabled value={""}>
                {t("Register.bank.typeKeyPixOpt")}
              </option>
              <option value={"CPF"}>{t("Register.bank.cpf")}</option>
              <option value={"CNPJ"}>{t("Register.bank.cnpj")}</option>
              <option value={"TELEFONE"}>{t("Register.bank.phone")}</option>
              <option value={"EMAIL"}>{t("Register.bank.email")}</option>
            </SelectUfs>
          </div>
          <div style={{ width: "100%" }}>
            <h5>Chave</h5>
            <InputData
              style={{ width: "100%" }}
              type="text"
              id="pixKey"
              placeholder={`${t("Register.bank.key")}*`}
              className="input_2"
              value={bank.pixKey}
              onChange={(e) => {
                if (bank.pixType === "CPF") {
                  setBank({ ...bank, pixKey: cpfFormat(e) });
                } else if (bank.pixType === "CNPJ") {
                  setBank({ ...bank, pixKey: cnpjFormat(e) });
                } else if (bank.pixType === "TELEFONE") {
                  setBank({ ...bank, pixKey: phoneFormat(e.target.value) });
                } else {
                  setBank({ ...bank, pixKey: e.target.value });
                }
              }}
            />
          </div>
        </div>
      )}
      {bank.type === "TRANSFER" && (
        <>
          <div className="input_row_3new">
            <div style={{ width: "100%" }}>
              <h5>Banco</h5>
              <Select
                style={{ width: "100%", height: "40px" }}
                placeholder={'Banco'}
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
            </div>
            <div style={{ width: "100%" }}>
              <h5>Agência</h5>
              <InputData
                style={{ width: "100%" }}
                type="text"
                id="agency"
                placeholder={'Agência'}
                className="input_3"
                value={bank.ag}
                onChange={(e) => setBank({ ...bank, ag: e.target.value })}
              />
            </div>
            <div style={{ width: "100%" }}>
              <h5>Dígito agência</h5>
              <InputData
                style={{ width: "100%" }}
                type="text"
                placeholder={'Dígito conta'}
                className="input_3"
                value={bank.agDigit}
                onChange={(e) => setBank({ ...bank, agDigit: e.target.value })}
              />
            </div>
          </div>
          <div className="input_row_3new">
            <div style={{ width: "100%" }}>
              <h5>Conta</h5>
              <InputData
                style={{ width: "100%" }}
                type="text"
                id="account"
                placeholder={'Conta'}
                className="input_3"
                value={bank.account}
                onChange={(e) => setBank({ ...bank, account: e.target.value })}
              />
            </div>
            <div style={{ width: "100%" }}>
              <h5>Dígito conta</h5>
              <InputData
                style={{ width: "100%" }}
                type="text"
                placeholder='Dígito conta'
                className="input_3"
                value={bank.accountDigit}
                onChange={(e) =>
                  setBank({ ...bank, accountDigit: e.target.value })
                }
              />
            </div>
            <div style={{ width: "100%" }}>
              <h5>OP</h5>
              <InputData
                style={{ width: "100%" }}
                type="text"
                placeholder={'Operação'}
                className="input_3"
                value={bank.op}
                onChange={(e) => setBank({ ...bank, op: e.target.value })}
              />
            </div>
          </div>
        </>
      )}

      {/* <div className="flex end btn_invert">
				<Button invert onClick={goBackStep}>
					VOLTAR
				</Button>
				<Button notHover onClick={handleNext}>
					PRÓXIMO
				</Button>
			</div> */}
    </>
  );
};

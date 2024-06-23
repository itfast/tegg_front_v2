/* eslint-disable react/prop-types */
import { Button } from "../../../../globalStyles";
import { CardData, InputData, SelectUfs } from "../Resales.styles";
import {
  UFS,
  cnpjFormat,
  getCEP,
  phoneFormat,
  cepFormat,
} from "../../../services/util";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const CompanyData = ({ goStep, goBackStep, company, setCompany }) => {
  const { t } = useTranslation();
  const nameInput = document.getElementById("name");
  const cnpjInput = document.getElementById("cnpj");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  // const cepInput = document.getElementById("cep");
  // const addressInput = document.getElementById("address");
  // const numberInput = document.getElementById("number");
  // const districtInput = document.getElementById("district");
  // const cityInput = document.getElementById("city");
  // const ufInput = document.getElementById("uf");

  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    "gm"
  );

  const handleNext = () => {
    // setStep(2);
    if (company.rz !== "" && company.rz.trim().length > 0) {
      nameInput?.style.removeProperty("border-color");
      if (
        company.cnpj !== "" &&
        company.cnpj.replaceAll(".", "").replace("-", "").replace("/", "")
          .length === 14
      ) {
        cnpjInput?.style.removeProperty("border-color");
        if (company.email !== "" && emailRegex.test(company.email)) {
          emailInput?.style.removeProperty("border-color");
          if (company.phone !== "") {
            phoneInput?.style.removeProperty("border-color");
            // if (
            //   company.cep !== "" &&
            //   company.cep.replace(".", "").replace("-", "").length === 8
            // ) {
            //   cepInput?.style.removeProperty("border-color");
            //   if (company.address !== "" && company.address.trim().length > 0) {
            //     addressInput?.style.removeProperty("border-color");
            //     if (company.number !== "" && Number(company.number) > 0) {
            //       numberInput?.style.removeProperty("border-color");
            //       if (
            //         company.district !== "" &&
            //         company.district.trim().length > 0
            //       ) {
            //         districtInput?.style.removeProperty("border-color");
            //         if (company.city !== "" && company.city.trim().length > 0) {
            //           cityInput?.style.removeProperty("border-color");
            //           if (company.uf !== "") {
            //             ufInput?.style.removeProperty("border-color");
                        goStep();
            //           } else {
            //             ufInput.style.borderColor = "red";
            //             toast.error(t("ErrorMsgs.required.uf"));
            //           }
            //         } else {
            //           cityInput.style.borderColor = "red";
            //           toast.error(t("ErrorMsgs.required.city"));
            //         }
            //       } else {
            //         districtInput.style.borderColor = "red";
            //         toast.error(t("ErrorMsgs.required.neighborhood"));
            //       }
            //     } else {
            //       numberInput.style.borderColor = "red";
            //       toast.error(t("ErrorMsgs.required.number"));
            //     }
            //   } else {
            //     addressInput.style.borderColor = "red";
            //     toast.error(t("ErrorMsgs.required.address"));
            //   }
            // } else {
            //   cepInput.style.borderColor = "red";
            //   toast.error(t("ErrorMsgs.required.cep"));
            // }
          } else {
            phoneInput.style.borderColor = "red";
            toast.error(t("ErrorMsgs.required.phone"));
          }
        } else {
          emailInput.style.borderColor = "red";
          toast.error(t("ErrorMsgs.invalid.email"));
        }
      } else {
        cnpjInput.style.borderColor = "red";
        toast.error(t("ErrorMsgs.invalid.cnpj"));
      }
    } else {
      nameInput.style.borderColor = "red";
      toast.error(t("ErrorMsgs.required.rz"));
    }
  };

  const handleCep = async (e) => {
    setCompany({ ...company, cep: cepFormat(e.target.value) });

    const res = await getCEP(e);
    // console.log(res);
    if (res) {
      setCompany({
        ...company,
        cep: cepFormat(e.target.value),
        uf: res.uf || "",
        district: res.bairro || "",
        city: res.localidade || "",
        address: res.logradouro || "",
      });
    }
  };

  return (
    <CardData style={{ maxWidth: "1000px", margin: "auto" }}>
      <h5>{t("Resales.new.titleCompany")}</h5>
      <div className="input_row_1">
        <InputData
          type="text"
          id="name"
          placeholder={t("Resales.new.rz")}
          style={{ width: "100%" }}
          value={company.rz}
          onChange={(e) => setCompany({ ...company, rz: e.target.value })}
        />
      </div>
      <div className="input_row_3">
        <InputData
          type="text"
          id="cnpj"
          placeholder={t("Register.cnpj")}
          className="input_3"
          value={company.cnpj}
          onChange={(e) => setCompany({ ...company, cnpj: cnpjFormat(e) })}
        />
        <InputData
          type="text"
          placeholder={t("Register.ie")}
          className="input_3"
          value={company.ie}
          onChange={(e) => setCompany({ ...company, ie: e.target.value })}
        />
        <InputData
          type="text"
          placeholder={t("Register.im")}
          className="input_3"
          value={company.im}
          onChange={(e) => setCompany({ ...company, im: e.target.value })}
        />
      </div>
      <div className="input_row_2">
        <InputData
          type="text"
          id="email"
          placeholder={t("Register.email").toUpperCase()}
          className="input_2"
          value={company.email}
          onChange={(e) => setCompany({ ...company, email: e.target.value })}
        />
        <InputData
          type="text"
          id="phone"
          placeholder={t("Register.phone").toUpperCase()}
          className="input_2"
          value={company.phone}
          onChange={(e) =>
            setCompany({ ...company, phone: phoneFormat(e.target.value) })
          }
        />
      </div>
      <div className="input_row_2">
        <InputData
          type="text"
          id="cep"
          placeholder={t("Register.cep").toUpperCase()}
          value={company.cep}
          onChange={handleCep}
          className="input_20"
        />
        <InputData
          type="text"
          id="address"
          placeholder={t("Register.address").toUpperCase()}
          value={company.address}
          onChange={(e) => setCompany({ ...company, address: e.target.value })}
          className="input_80"
        />
      </div>
      <div className="input_row_2">
        <InputData
          type="text"
          placeholder={t("Register.complement").toUpperCase()}
          value={company.complement}
          onChange={(e) =>
            setCompany({ ...company, complement: e.target.value })
          }
          className="input_80"
        />
        <InputData
          type="number"
          id="number"
          placeholder={t("Register.number").toUpperCase()}
          className="input_20"
          value={company.number}
          onChange={(e) => setCompany({ ...company, number: e.target.value })}
        />
      </div>
      <div className="input_row_3">
        <InputData
          type="text"
          id="district"
          placeholder={t("Register.neighborhood").toUpperCase()}
          value={company.district}
          onChange={(e) => setCompany({ ...company, district: e.target.value })}
          className="input_3"
        />
        <InputData
          type="text"
          id="city"
          placeholder={t("Register.city").toUpperCase()}
          value={company.city}
          onChange={(e) => setCompany({ ...company, city: e.target.value })}
          className="input_3"
        />
        <SelectUfs
          name="UF"
          id="uf"
          placeholder={t("Register.uf").toUpperCase()}
          value={company.uf}
          onChange={(e) => setCompany({ ...company, uf: e.target.value })}
          className="input_3"
          defaultValue={""}
        >
          <option disabled value={""}>
            UFs
          </option>
          {UFS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </SelectUfs>
      </div>
      <div className="flex end btn_invert">
        <Button onClick={goBackStep}>
          {t("Register.goback").toUpperCase()}
        </Button>
        <Button notHover onClick={handleNext}>
          {t("Register.next").toUpperCase()}
        </Button>
      </div>
    </CardData>
  );
};

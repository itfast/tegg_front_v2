/* eslint-disable react/prop-types */
import { Button } from "../../../../globalStyles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CardData, InputData, SelectUfs } from "../Resales.styles";
import { AsyncPaginate } from "react-select-async-paginate";

import {
  UFS,
  cpfFormat,
  getCEP,
  phoneFormat,
  validateCpf,
  cepFormat,
  validateEmail,
} from "../../../services/util";
import Checkbox from "@mui/material/Checkbox";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useTranslation } from "react-i18next";

export const UserData = ({
  type,
  goStep,
  goBackStep,
  user,
  setUser,
  label = "RESPONSÁVEL",
  userLegacy,
  setUserLegacy,
}) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [hasUser, setHasUser] = useState(userLegacy?.value ? true : false);

  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    "gm"
  );

  useEffect(() => {
    if (userLegacy?.value) {
      setHasUser(true);
    }
  }, [userLegacy]);

  const nameInput = document.getElementById("name");
  const cpfInput = document.getElementById("cpf");
  // const rgInput = document.getElementById("rg");
  const emailInput = document.getElementById("email");
  const companyEmailInput = document.getElementById("companyEmail");
  const phoneInput = document.getElementById("phone");
  // const cepInput = document.getElementById("cep");
  // const addressInput = document.getElementById("address");
  // const numberInput = document.getElementById("number");
  // const districtInput = document.getElementById("district");
  // const cityInput = document.getElementById("city");
  // const ufInput = document.getElementById("uf");

  const today = new Date();

  const loadLegacyClients = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const response = await api.userLegacy.get(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search
    );

    const hasMore = response.data.meta.total > vlr && response.data.meta.total > 10;
    const finalClients = await response.data.finalClients;
    const array = [];
    for (const f of finalClients) {
      array.push({
        value: f.Id,
        label: (
          <div>
            <h4>{f.nome}</h4>
            <h5>{f.cpf}</h5>
          </div>
        ),
      });
    }
    return {
      options: array,
      hasMore,
    };
  };

  console.log('PORRA DO DATE', user);

  const handleNext = () => {
    if (user.name !== "" && user.name.trim().length > 0) {
      nameInput?.style.removeProperty("border-color");
      if (user.cpf !== "") {
        if (validateCpf(user.cpf)) {
          cpfInput?.style.removeProperty("border-color");
          // if (user.rg !== "" && user.rg.trim().length > 0) {
          //   rgInput?.style.removeProperty("border-color");
            // if (user.date !== "") {
            //   const checkDate = new Date(user.date);
              // if (checkDate < today) {
                if (validateEmail(user.email)) {
                  emailInput?.style.removeProperty("border-color");
                  // console.log(user.companyEmail!== '')
                  // console.log(emailRegex.test(user.companyEmail));
                  if (
                    type === "EMPRESA" ||
                    (user.companyEmail !== "" &&
                      emailRegex.test(user.companyEmail))
                  ) {
                    if (user.phone !== "") {
                      phoneInput?.style.removeProperty("border-color");
                      // if (
                      //   user.cep !== "" &&
                      //   user.cep.replace("-", "").replace(".", "").length === 8
                      // ) {
                      //   cepInput?.style.removeProperty("border-color");
                      //   if (
                      //     user.address !== "" &&
                      //     user.address.trim().length > 0
                      //   ) {
                      //     addressInput?.style.removeProperty("border-color");
                      //     if (user.number !== "" && Number(user.number) > 0) {
                      //       numberInput?.style.removeProperty("border-color");
                      //       if (
                      //         user.district !== "" &&
                      //         user.district.trim().length > 0
                      //       ) {
                      //         districtInput?.style.removeProperty(
                      //           "border-color"
                      //         );
                      //         if (
                      //           user.city !== "" &&
                      //           user.city.trim().length > 0
                      //         ) {
                      //           cityInput?.style.removeProperty("border-color");
                      //           if (user.uf !== "") {
                      //             ufInput?.style.removeProperty("border-color");
                                  goStep();
                      //           } else {
                      //             toast.error(t("ErrorMsgs.required.uf"));
                      //             ufInput.style.borderColor = "red";
                      //           }
                      //         } else {
                      //           toast.error(t("ErrorMsgs.required.city"));
                      //           cityInput.style.borderColor = "red";
                      //         }
                      //       } else {
                      //         toast.error(t("ErrorMsgs.required.neighborhood"));
                      //         districtInput.style.borderColor = "red";
                      //       }
                      //     } else {
                      //       toast.error(t("ErrorMsgs.required.number"));
                      //       numberInput.style.borderColor = "red";
                      //     }
                      //   } else {
                      //     toast.error(t("ErrorMsgs.required.address"));
                      //     addressInput.style.borderColor = "red";
                      //   }
                      // } else {
                      //   toast.error(t("ErrorMsgs.required.cep"));
                      //   cepInput.style.borderColor = "red";
                      // }
                    } else {
                      toast.error(t("ErrorMsgs.required.phone"));
                      phoneInput.style.borderColor = "red";
                    }
                  } else {
                    toast.error(t("ErrorMsgs.required.emailResale"));
                    companyEmailInput.style.borderColor = "red";
                  }
                } else {
                  toast.error(t("Informe um email válido"));
                  emailInput.style.borderColor = "red";
                }
              // } else {
              //   toast.error(t("ErrorMsgs.invalid.date"));
              // }
            // } else {
            //   toast.error(t("ErrorMsgs.required.birthday"));
            // }
          // } else {
          //   toast.error(t("ErrorMsgs.required.rg"));
          //   rgInput.style.borderColor = "red";
          // }
        } else {
          toast.error(t("ErrorMsgs.invalid.cpf"));
          cpfInput.style.borderColor = "red";
        }
      } else {
        toast.error(t("ErrorMsgs.required.cpf"));
        cpfInput.style.borderColor = "red";
      }
    } else {
      toast.error(t("ErrorMsgs.required.name"));
      nameInput.style.borderColor = "red";
    }
  };

  const handleCep = async (e) => {
    setUser({ ...user, cep: cepFormat(e.target.value) });

    const res = await getCEP(e);
    if (res) {
      setUser({
        ...user,
        cep: cepFormat(e.target.value),
        uf: res.uf,
        district: res.bairro,
        city: res.localidade,
        address: res.logradouro,
      });
    }
  };

  const handleCheck = (e) => {
    setUser({ ...user, icmsContributor: e.target.checked });
  };

  return (
    <CardData style={{ maxWidth: "1000px", margin: "auto" }}>
      <h5>{label}</h5>
      <div className="input_row_1">
        <InputData
          type="text"
          id="name"
          placeholder={t("Register.name")}
          style={{ width: "100%" }}
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
      </div>
      <div className="input_row_3">
        <InputData
          type="text"
          id="cpf"
          placeholder={t("Register.cpf")}
          className="input_3"
          value={user.cpf}
          onChange={(e) => setUser({ ...user, cpf: cpfFormat(e) })}
        />
        <InputData
          type="text"
          id="rg"
          placeholder={t("Register.rg")}
          className="input_3"
          value={user.rg}
          onChange={(e) => setUser({ ...user, rg: e.target.value })}
        />
        <div className="input_3">
          <DatePicker
            underlineStyle={{ display: "none" }}
            maxDate={today}
            size={"small"}
            label={t("Register.birthday")}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "standard",
                sx: {
                  px: 2,
                  border: "1px solid #00D959",
                  borderRadius: "8px",
                  height: "50px",
                },
                InputLabelProps: {
                  shrink: true,
                  sx: {
                    margin: "4px",
                  },
                },
                InputProps: { disableUnderline: true },
              },
            }}
            value={user.date}
            onChange={(e) => setUser({ ...user, date: e })}
          />
        </div>
      </div>
      <div className="input_row_2">
        <InputData
          type="text"
          id="email"
          placeholder={
            type === "PESSOA FISICA"
              ? t("Register.emailResponsably").toUpperCase()
              : t("Register.email").toUpperCase()
          }
          className="input_2"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        {type === "PESSOA FISICA" && (
          <InputData
            type="text"
            id="companyEmail"
            placeholder={t("Register.emailResale").toUpperCase()}
            className="input_2"
            value={user.companyEmail}
            onChange={(e) => setUser({ ...user, companyEmail: e.target.value })}
          />
        )}
        <InputData
          type="text"
          id="phone"
          placeholder={t("Register.phone").toUpperCase()}
          className="input_2"
          value={user.phone}
          onChange={(e) =>
            setUser({ ...user, phone: phoneFormat(e.target.value) })
          }
        />
      </div>
      <div className="input_row_2">
        <InputData
          type="text"
          id="cep"
          placeholder={t("Register.cep").toUpperCase()}
          value={user.cep}
          onChange={handleCep}
          className="input_20"
        />
        <InputData
          type="text"
          id="address"
          placeholder={t("Register.address").toUpperCase()}
          value={user.address}
          onChange={(e) => setUser({ ...user, address: e.target.value })}
          className="input_80"
        />
      </div>
      <div className="input_row_2">
        <InputData
          type="text"
          placeholder={t("Register.complement").toUpperCase()}
          value={user.complement}
          onChange={(e) => setUser({ ...user, complement: e.target.value })}
          className="input_80"
        />
        <InputData
          type="number"
          id="number"
          placeholder={t("Register.number").toUpperCase()}
          className="input_20"
          value={user.number}
          onChange={(e) => setUser({ ...user, number: e.target.value })}
        />
      </div>
      <div className="input_row_3">
        <InputData
          type="text"
          id="district"
          placeholder={t("Register.neighborhood").toUpperCase()}
          value={user.district}
          onChange={(e) => setUser({ ...user, district: e.target.value })}
          className="input_3"
        />
        <InputData
          type="text"
          id="city"
          placeholder={t("Register.city").toUpperCase()}
          value={user.city}
          onChange={(e) => setUser({ ...user, city: e.target.value })}
          className="input_3"
        />
        <SelectUfs
          name="UF"
          id="uf"
          placeholder={t("Register.uf").toUpperCase()}
          value={user.uf}
          onChange={(e) => setUser({ ...user, uf: e.target.value })}
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
      <div
        // className='input_3'
        style={{
          display: "flex",
          flexDirection: screen.width < 768 && "column",
          alignItems: screen.width > 768 && "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Checkbox
            id="legado"
            checked={hasUser}
            onChange={(e) => {
              setHasUser(e.target.checked);
              setUserLegacy();
            }}
          />

          <label htmlFor="legado">{t("Register.haveLegacyUser")}</label>
        </div>
        {hasUser && (
          <div style={{ width: screen.width < 768 ? "100%" : "30%" }}>
            <AsyncPaginate
              defaultOptions
              placeholder={t("Register.haveLegacyUser")}
              isClearable
              // noOptionsMessage={() => 'SEM ICCIDS PARA VINCULAR'}
              value={userLegacy}
              loadOptions={loadLegacyClients}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPosition={"fixed"}
              onChange={(e) => {
                setUserLegacy(e);
              }}
            />
          </div>
        )}
      </div>
      {type === "EMPRESA" && (
        <div className="input_row_3">
          <div
            className="input_3"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Checkbox
              id="icms_contributor"
              checked={user.icmsContributor}
              onChange={(e) => {
                handleCheck(e);
              }}
            />
            <label htmlFor="icms_contributor">
              {t("Register.isIcmsContribuitor")}
            </label>
          </div>
        </div>
      )}
      <div className="flex end btn_invert">
        <Button invert onClick={goBackStep}>
          {t("Register.goback").toUpperCase()}
        </Button>
        <Button notHover onClick={handleNext}>
          {location.pathname === "/clients/new"
            ? t("Register.finally").toUpperCase()
            : location.pathname === "/clients/edit"
            ? t("Register.update").toUpperCase()
            : t("Register.next").toUpperCase()}
        </Button>
      </div>
    </CardData>
  );
};

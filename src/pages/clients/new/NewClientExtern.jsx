/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

import {
  UFS,
  cepFormat,
  cnpjFormat,
  cpfFormat,
  getCEP,
  phoneFormat,
  translateError,
  validateCnpj,
  validateCpf,
  validateEmail,
  validateName,
} from "../../../services/util";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
import { InputData } from "../../resales/Resales.styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ReactLoading from "react-loading";
import { InputPassSignUp, SelectUfs } from "./NewClient.styles";
import Radio from "@mui/joy/Radio";
import FormControl from "@mui/joy/FormControl";
import RadioGroup from "@mui/joy/RadioGroup";
import { Button } from "../../../../globalStyles";
import { toast } from "react-toastify";
import api from "../../../services/api";
import { BankAccountExtern } from "../../resales/new/BankAccountExtern";
import { useLocation } from "react-router-dom";
// import { Loading } from "../../../components/loading/Loading";
import { useTranslation } from "react-i18next";

export const NewClientExtern = ({ setSingUp, data, loading, setLoading }) => {
  const { t } = useTranslation();
  const cepInput = useRef(null);
  const companyCnpjInput = document.getElementById("companyCNPJ");
  const companyPhoneInput = document.getElementById("companyPhone");
  // const [loading, setLoading] = useState(true);
  const [loadingC, setLoadingC] = useState(false);
  const [type, setType] = useState("FINALCLIENT");
  const [selected, setSelected] = useState("PESSOA FISICA");
  const [updateId, setUpdateId] = useState();

  const [typePass, setTypePass] = useState("password");
  const [typePassConfirm, setTypePassConfirm] = useState("password");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  // const [loading, setLoading] = useState(false)

  const handleTypePass = () => {
    setTypePass(typePass === "password" ? "text" : "password");
  };

  const handleTypePassConfirm = () => {
    setTypePassConfirm(typePassConfirm === "password" ? "text" : "password");
  };

  const location = useLocation();

  const [bank, setBank] = useState({
    type: "",
    pixType: "",
    pixKey: "",
    bankName: "",
    ag: "",
    agDigit: "",
    account: "",
    accountDigit: "",
    op: "",
  });

  const [user, setUser] = useState({
    name: "",
    cpf: "",
    rg: "",
    date: null,
    email: "",
    secondEmail: "",
    phone: "",
    cep: "",
    address: "",
    complement: "",
    number: "",
    district: "",
    city: "",
    uf: "",
    cnpj: "",
    ie: "",
    whatsApp: "",
  });

  const [company, setCompany] = useState({
    name: "",
    date: null,
    email: "",
    phone: "",
    cep: "",
    address: "",
    complement: "",
    number: "",
    district: "",
    city: "",
    uf: "",
    cnpj: "",
    ie: "",
  });

  useEffect(() => {
    if (data) {
      setUser({
        name: data.Name,
        cpf: data.Cpf,
        rg: data.Rg,
        date: "",
        email: data.Email,
        secondEmail: data.SecondEmail,
        phone: data.Mobile,
        cep: data.PostalCode,
        address: data.StreetName,
        complement: data.Complement,
        number: data.Number,
        district: data.District,
        city: data.City,
        uf: data.State,
        cnpj: data.Cnpj,
        ie: data.Ie,
        whatsApp: data.Whatsapp,
      });

      setUpdateId(data.Id);
    }
  }, [data]);

  const cleanVariables = () => {
    setUser({
      name: "",
      cpf: "",
      rg: "",
      date: "",
      email: "",
      secondEmail: "",
      phone: "",
      cep: "",
      address: "",
      complement: "",
      number: "",
      district: "",
      city: "",
      uf: "",
      cnpj: "",
      ie: "",
      whatsApp: "",
    });
    setCompany({
      name: "",
      date: "",
      email: "",
      phone: "",
      cep: "",
      address: "",
      complement: "",
      number: "",
      district: "",
      city: "",
      uf: "",
      cnpj: "",
      ie: "",
    });
    setBank({
      type: "",
      pixType: "",
      pixKey: "",
      bankName: "",
      ag: "",
      agDigit: "",
      account: "",
      accountDigit: "",
      op: "",
    });
    setType("FINALCLIENT");
    setSelected("PESSOA FISICA");
  };

  const styleLabel = {
    my: {
      "&.MuiInputLabel-root": { margin: 20 },
    },
  };
  const handleCep = async (e) => {
    setUser({ ...user, cep: cepFormat(e.target.value) });

    const res = await getCEP(e);
    if (res) {
      setUser({
        ...user,
        cep: cepFormat(e.target.value),
        uf: res.uf || "",
        district: res.bairro || "",
        city: res.localidade || "",
        address: res.logradouro || "",
      });
    }
  };

  const handleCepCompany = async (e) => {
    setCompany({ ...company, cep: cepFormat(e.target.value) });

    const res = await getCEP(e);
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

  const handleRed = (name) => {
    const c = document.getElementsByName(name);
    if (c) {
      if (c.length > 0) {
        c.forEach((e) => {
          e.style.borderColor = "red";
        });
      }
    }
  };

  const handleCleanRed = (name) => {
    const c = document.getElementsByName(name);
    if (c) {
      if (c.length > 0) {
        c.forEach((e) => {
          e?.style.removeProperty("border-color");
        });
      }
    }
  };

  const pjValidate = () => {
    if (company.name !== "") {
      handleCleanRed("companyName");
      if (company.cnpj !== "") {
        if (validateCnpj(company.cnpj)) {
          companyCnpjInput?.style.removeProperty("border-color");
          handleCleanRed("companyCNPJ");
          if (validateEmail(company.email)) {
            handleCleanRed("companyEmail");
            if (company.phone?.length === 15) {
              handleCleanRed("companyPhone");
              return true;
            } else {
              toast.error(t("ErrorMsgs.required.phone"));
              companyPhoneInput.style.borderColor = "red";
            }
          } else {
            if (company.email === "") {
              toast.error(t("ErrorMsgs.required.email"));
              handleRed("companyEmail");
            } else {
              toast.error("Informe um e-mail válido");
              handleRed("companyEmail");
            }
            // clientEmailInput.style.borderColor = 'red';
          }
        } else {
          toast.error("Informe um CNPJ válido");
          handleRed("companyCNPJ");
        }
      } else {
        toast.error(t("ErrorMsgs.required.cnpj"));
        handleRed("companyCNPJ");
      }
    } else {
      toast.error(t("ErrorMsgs.required.companyName"));
      handleRed("companyName");
    }
  };

  const register = () => {
    if (user.name !== "") {
      handleCleanRed("clientName");
      if (validateName(user.name)) {
        if (
          (validateCpf(user.cpf) && selected === "PESSOA FISICA") ||
          ((validateCnpj(user.cnpj) || validateCnpj(company.cnpj)) &&
            selected === "PESSOA JURÍDICA")
        ) {
          if (
            selected === "PESSOA JURÍDICA"
              ? validateCnpj(user?.cnpj) || validateCnpj(company?.cnpj)
              : validateCpf(user.cpf)
          ) {
            handleCleanRed("clientCNPJ");
            handleCleanRed("clientCPF");
            if (validateEmail(user.email)) {
              if (user.email !== user.secondEmail) {
                handleCleanRed("clientEmail");
                handleCleanRed("clientSecondEmail");
                if (user.phone?.length === 15) {
                  handleCleanRed("clientPhone");
                  if (newPass) {
                    handleCleanRed("password");
                    if (confirmNewPass) {
                      handleCleanRed("secondpassword");
                      if (newPass === confirmNewPass) {
                        if (
                          type === "DEALER" &&
                          selected === "PESSOA JURÍDICA"
                        ) {
                          if (pjValidate()) {
                            if (updateId) {
                              setLoading(true);
                            } else {
                              setLoadingC(true);
                            }
                            api.client
                              .newPreregistration(
                                user,
                                company,
                                type,
                                bank,
                                updateId,
                                newPass
                              )
                              .then((res) => {
                                cleanVariables();
                                toast.success(res?.data?.Message);
                                setSingUp(true);
                                window.scrollTo(0, 0);
                              })
                              .catch((err) => translateError(err))
                              .finally(() => {
                                setLoading(false);
                                setLoadingC(false);
                              });
                          }
                        } else {
                          if (updateId) {
                            setLoading(true);
                          } else {
                            setLoadingC(true);
                          }
                          if (type === "DEALER") {
                            handleCleanRed("emailResale1");
                            if (validateEmail(company.email)) {
                              if (company.email !== user.email) {
                                api.client
                                  .newPreregistration(
                                    user,
                                    company,
                                    type,
                                    bank,
                                    updateId,
                                    newPass
                                  )
                                  .then((res) => {
                                    console.log(res);
                                    cleanVariables();
                                    toast.success(res?.data?.Message);
                                    setSingUp(true);
                                    window.scrollTo(0, 0);
                                  })
                                  .catch((err) => translateError(err))
                                  .finally(() => {
                                    setLoading(false);
                                    setLoadingC(false);
                                  });
                              } else {
                                setLoadingC(false);
                                toast.error(
                                  "E-mail e E-mail como embaixador devem ser diferentes"
                                );
                                handleRed("emailResale1");
                              }
                            } else {
                              setLoadingC(false);
                              if (company.email === "") {
                                toast.error(
                                  "Email de acesso como embaixador deve ser informado"
                                );
                                handleRed("emailResale1");
                              } else {
                                toast.error(
                                  "Email de acesso como embaixador deve ser um email válido"
                                );
                                handleRed("emailResale1");
                              }
                            }
                          } else {
                            api.client
                              .newPreregistration(
                                user,
                                company,
                                type,
                                bank,
                                updateId,
                                newPass
                              )
                              .then((res) => {
                                cleanVariables();
                                toast.success(res?.data?.Message);
                                setSingUp(true);
                                window.scrollTo(0, 0);
                              })
                              .catch((err) => translateError(err))
                              .finally(() => {
                                setLoading(false);
                                setLoadingC(false);
                              });
                          }
                        }
                      } else {
                        toast.error(t("ErrorMsgs.passwordNotMatch"));
                        handleRed("password");
                        handleRed("secondpassword");
                      }
                    } else {
                      toast.error(t("ErrorMsgs.passwordConfirm"));
                      handleRed("secondpassword");
                    }
                  } else {
                    toast.error(t("ErrorMsgs.required.password"));
                    handleRed("password");
                  }
                } else {
                  toast.error(t("ErrorMsgs.required.phone"));
                  handleRed("clientPhone");
                }
              } else {
                toast.error(t("ErrorMsgs.secondMailMatch"));
                handleRed("clientEmail");
                handleRed("clientSecondEmail");
              }
            } else {
              if (user.email === "") {
                toast.error(t("ErrorMsgs.required.email"));
                handleRed("clientEmail");
              } else {
                toast.error("Informe um email válido");
                handleRed("clientEmail");
              }
              // clientEmailInput.style.borderColor = 'red';
            }
          } else {
            if (selected === "PESSOA JURÍDICA") {
              toast.error("Informe um CNPJ válido");
              handleRed("clientCNPJ");
            } else {
              toast.error("Informe um CPF válido");
              handleRed("clientCPF");
            }
          }
        } else {
          if (selected === "PESSOA JURÍDICA") {
            toast.error(t("ErrorMsgs.required.cnpj"));
            handleRed("clientCNPJ");
            handleRed("companyCNPJ");
          } else {
            toast.error(t("ErrorMsgs.required.cpf"));
            handleRed("clientCPF");
            handleRed("companyCNPJ");
          }
        }
      } else {
        toast.error("Informe o nome completo");
        handleRed("clientName");
      }
    } else {
      toast.error(t("ErrorMsgs.required.name"));
      handleRed("clientName");
    }
  };

  return (
    <>
      {/* <Loading open={loading} msg={t("LoadingMsgs.endRegister")} /> */}
      <div style={{ maxWidth: "1000px", margin: "auto", padding: "1rem"}}>
        {!location.pathname.match("/register") && (
          <div
            style={{
              width: "100%",
              // display: screen.width < 768 ? "block" : "flex",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", color: "green" }}>
                <FormControl>
                  <RadioGroup
                    defaultValue="outlined"
                    name="radio-buttons-group"
                    orientation={screen.width < 768 ? "vertical" : "horizontal"}
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                  >
                    <Radio
                      color="success"
                      orientation="horizontal"
                      size="md"
                      variant="solid"
                      value="PESSOA FISICA"
                      label={t("Register.person")}
                    />
                    <Radio
                      color="success"
                      orientation="horizontal"
                      size="md"
                      variant="solid"
                      value="PESSOA JURÍDICA"
                      label={t("Register.company")}
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", color: "green" }}>
                <FormControl>
                  <RadioGroup
                    defaultValue="outlined"
                    name="radio-buttons-group"
                    orientation={screen.width < 768 ? "vertical" : "horizontal"}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <Radio
                      color="success"
                      orientation="horizontal"
                      size="md"
                      variant="solid"
                      value="FINALCLIENT"
                      label={t("Register.client")}
                    />
                    <Radio
                      color="success"
                      orientation="horizontal"
                      size="md"
                      variant="solid"
                      value="AGENT"
                      label={t("Register.agent")}
                    />
                    <Radio
                      color="success"
                      orientation="horizontal"
                      size="md"
                      variant="solid"
                      value="DEALER"
                      label={t("Register.embassador")}
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>
        )}

        {selected === "PESSOA JURÍDICA" && type === "DEALER" && (
          <>
            <div>
              <h5>{t("Register.companyData")}</h5>
            </div>
            <div
              className="input_row_1new"
              style={{ flexDirection: screen.width < 768 && "column" }}
            >
              <div style={{ width: "100%" }}>
                <h5>{t("Register.name")}</h5>
                <InputData
                  // id="companyName"
                  name="companyName"
                  type="text"
                  placeholder={t("Register.name")}
                  style={{ width: "100%" }}
                  value={company.name}
                  onChange={(e) =>
                    setCompany({ ...company, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="input_row_3new">
              <div style={{ width: "100%" }}>
                <h5>{t("Register.cnpj")}</h5>
                <InputData
                  style={{ width: "100%" }}
                  // id="companyCNPJ"
                  name="companyCNPJ"
                  type="text"
                  placeholder={t("Register.cnpj")}
                  className="input_3"
                  value={company.cnpj}
                  onChange={(e) =>
                    setCompany({ ...company, cnpj: cnpjFormat(e) })
                  }
                />
              </div>
              <div style={{ width: "100%" }}>
                <h5>{t("Register.ie")}</h5>
                <InputData
                  style={{ width: "100%" }}
                  // id="companyIE"
                  name="companyIE"
                  // type="number"
                  placeholder={t("Register.ie")}
                  className="input_3"
                  value={company.ie}
                  onChange={(e) =>
                    setCompany({ ...company, ie: e.target.value })
                  }
                />
              </div>
              <div className="input_3"  style={{ width: "100%" }}>
                <h5>Data de fundação</h5>
                <DatePicker
                  style={{ width: "100%" }}
                  className={styleLabel}
                  disableFuture
                  underlineStyle={{ display: "none" }}
                  size={"small"}
                  // label={t("Register.fundationDate")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "standard",
                      sx: {
                        px: 2,
                        // py: -4,
                        border: "1px solid #00D959",
                        borderRadius: "8px",
                        height: "40px",
                        // svg: { marginTop: "-15px" },
                      },
                      InputProps: { disableUnderline: true },
                      InputLabelProps: {
                        shrink: true,
                        sx: {
                          margin: "4px",
                        },
                      },
                    },
                    label: {
                      margin: "4px 3px",
                    },
                  }}
                  value={company.date}
                  onChange={(e) => {
                    setCompany({ ...company, date: e });
                  }}
                />
              </div>
            </div>
            <div className="input_row_2new">
              <div style={{ width: "100%" }}>
                <h5>{t("Register.email")}</h5>
                <InputData
                  style={{ width: "100%" }}
                  // id="companyEmail"
                  name="companyEmail"
                  type="text"
                  placeholder={t("Register.email")}
                  className="input_2"
                  value={company.email}
                  onChange={(e) =>
                    setCompany({ ...company, email: e.target.value })
                  }
                />
              </div>
              <div style={{ width: "100%" }}>
                <h5>{t("Register.phone")}</h5>
                <InputData
                  style={{ width: "100%" }}
                  // id="companyPhone"
                  name="companyPhone"
                  placeholder={t("Register.phone")}
                  className="input_2"
                  value={company.phone}
                  onChange={(e) =>
                    setCompany({
                      ...company,
                      phone: phoneFormat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <h5>{t("Register.addressLabel")}</h5>
            <div className="input_row_2new">
              <div style={{ width: window.innerWidth < 768 ?"100%" : "30%" }}>
                <h5>{t("Register.cep")}</h5>
                <InputData
                  style={{ width: "100%" }}
                  ref={cepInput}
                  type="text"
                  // id="companyCep"
                  name="companyCep"
                  placeholder={t("Register.cep")}
                  value={company.cep}
                  onChange={handleCepCompany}
                  className="input_20"
                />
              </div>
              <div style={{ width: "100%" }}>
                <h5>Endereço</h5>
                <InputData
                  style={{ width: "100%" }}
                  type="text"
                  // id="companyAddress"
                  name="companyAddress"
                  placeholder={'Endereço'}
                  value={company.address}
                  onChange={(e) =>
                    setCompany({ ...company, address: e.target.value })
                  }
                  className="input_80"
                />
              </div>
            </div>
            <div className="input_row_2new">
              <div style={{ width: "100%" }}>
                <h5>Complemento</h5>
                <InputData
                  style={{ width: "100%" }}
                  // id="companyComplement"
                  name="companyComplement"
                  type="text"
                  placeholder={'Complemento'}
                  value={company.complement}
                  onChange={(e) =>
                    setCompany({ ...company, complement: e.target.value })
                  }
                  className="input_80"
                />
              </div>
              <div style={{ width: window.innerWidth < 768 ?"100%" : "30%"}}>
                <h5>Número</h5>
                <InputData
                  style={{ width: "100%" }}
                  type="number"
                  // id="companyNumber"
                  name="companyNumber"
                  placeholder={'Número'}
                  className="input_20"
                  value={company.number}
                  onChange={(e) =>
                    setCompany({ ...company, number: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="input_row_3new">
              <div style={{ width: "100%" }}>
                <h5>Bairro</h5>
                <InputData
                  style={{ width: "100%" }}
                  type="text"
                  // id="companyDistrict"
                  name="companyDistrict"
                  placeholder={'Bairro'}
                  value={company.district}
                  onChange={(e) =>
                    setCompany({ ...company, district: e.target.value })
                  }
                  className="input_3"
                />
              </div>
              <div style={{ width: "100%" }}>
                <h5>Cidade</h5>
                <InputData
                  style={{ width: "100%" }}
                  type="text"
                  // id="companyCity"
                  name="companyCity"
                  placeholder={'Cidade'}
                  value={company.city}
                  onChange={(e) =>
                    setCompany({ ...company, city: e.target.value })
                  }
                  className="input_3"
                />
              </div>
              <div style={{ width: "100%" }}>
                <h5>{t("Register.uf")}</h5>
                <SelectUfs
                  style={{ height: "40px",  width: "100%"  }}
                  name="companyUf"
                  // id="companyUf"
                  placeholder={t("Register.uf")}
                  value={company.uf}
                  onChange={(e) =>
                    setCompany({ ...company, uf: e.target.value })
                  }
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
            </div>
          </>
        )}

        <div>
          <h5>{t("Register.personData")}</h5>
        </div>
        <div
          className="input_row_1new"
          style={{ flexDirection: screen.width < 768 && "column" }}
        >
          <div style={{ width: "100%" }}>
            <h5>Nome completo</h5>
            <InputData
              // id="clientName"
              name="clientName"
              type="text"
              placeholder={t("Register.name")}
              style={{ width: "100%" }}
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
        </div>
        <div className="input_row_3new">
          {selected === "PESSOA JURÍDICA" && type !== "DEALER" ? (
            <div style={{ width: "100%" }}>
              <h5>CNPJ</h5>
              <InputData
                style={{ width: "100%" }}
                // id="clientCNPJ"
                name="clientCNPJ"
                type="text"
                placeholder={t("Register.cnpj")}
                className="input_3"
                value={user.cnpj}
                onChange={(e) => setUser({ ...user, cnpj: cnpjFormat(e) })}
              />
            </div>
          ) : (
            <div style={{ width: "100%" }}>
              <h5>CPF</h5>
              <InputData
                style={{ width: "100%" }}
                // id="clientCPF"
                name="clientCPF"
                type="text"
                placeholder={t("Register.cpf")}
                className="input_3"
                value={user.cpf}
                onChange={(e) => setUser({ ...user, cpf: cpfFormat(e) })}
              />
            </div>
          )}
          {selected === "PESSOA JURÍDICA" && type !== "DEALER" ? (
            <div style={{ width: "100%" }}>
              <h5>IE</h5>
              <InputData
                style={{ width: "100%" }}
                // id="clientIE"
                name="clientIE"
                // type="number"
                placeholder={t("Register.ie")}
                className="input_3"
                value={user.ie}
                onChange={(e) => setUser({ ...user, ie: e.target.value })}
              />
            </div>
          ) : (
            <div style={{ width: "100%" }}>
              <h5>RG</h5>
              <InputData
                style={{ width: "100%" }}
                // id="clientRG"
                name="clientRG"
                type="text"
                placeholder={t("Register.rg")}
                className="input_3"
                value={user.rg}
                onChange={(e) => setUser({ ...user, rg: e.target.value })}
              />
            </div>
          )}
          <div className="input_3" style={{ width: "100%" }}>
            {/* <div style={{ width: "100%" }}> */}
            <h5>
              {selected === "PESSOA JURÍDICA" && type !== "DEALER"
                ? "Data de fundação"
                : "Data de nascimento"}
            </h5>
            <DatePicker
              style={{ width: "100%" }}
              className={styleLabel}
              disableFuture
              underlineStyle={{ display: "none" }}
              size={"small"}
              // label={
              //   selected === "PESSOA JURÍDICA" && type !== "DEALER"
              //     ? t("Register.fundationDate")
              //     : t("Register.birthday")
              // }
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "standard",
                  sx: {
                    px: 2,
                    // py: -4,
                    border: "1px solid #00D959",
                    borderRadius: "8px",
                    height: "40px",
                    // svg: { marginTop: "-15px" },
                  },
                  InputProps: { disableUnderline: true },
                  InputLabelProps: {
                    shrink: true,
                    // sx: {
                    //   margin: "4px",
                    // },
                  },
                },
                // label: {
                //   margin: "4px 3px",
                // },
              }}
              value={user.date}
              onChange={(e) => {
                setUser({ ...user, date: e });
              }}
            />
          </div>
        </div>
        <div className="input_row_2new">
          <div style={{ width: "100%" }}>
            <h5>E-mail</h5>
            <InputData
              style={{ width: "100%" }}
              // id="clientEmail"
              name="clientEmail"
              type="text"
              placeholder={t("Register.email")}
              className="input_2"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          {/* email de acesso para a revenda */}
          {selected !== "PESSOA JURÍDICA" && type === "DEALER" && (
            <div style={{ width: "100%" }}>
              <h5>{t("Register.emailResale1")}</h5>
              <InputData
                style={{ width: "100%" }}
                // id="emailResale1"
                name="emailResale1"
                type="text"
                placeholder={t("Register.emailResale1")}
                className="input_2"
                value={company.email}
                onChange={(e) =>
                  setCompany({ ...company, email: e.target.value })
                }
              />
            </div>
          )}
          <div style={{ width: "100%" }}>
            <h5>{t("Register.secondMail")}</h5>
            <InputData
              style={{ width: "100%" }}
              // id="clientSecondEmail"
              name="clientSecondEmail"
              type="text"
              placeholder={t("Register.secondMail")}
              className="input_2"
              value={user.secondEmail}
              onChange={(e) =>
                setUser({ ...user, secondEmail: e.target.value })
              }
            />
          </div>
        </div>
        <div className="input_row_2new">
          <div style={{ width: "100%" }}>
            <h5>{t("Register.phone")}</h5>
            <InputData
              style={{ width: "100%" }}
              // id="clientPhone"
              name="clientPhone"
              placeholder={t("Register.phone")}
              className="input_2"
              value={user.phone}
              onChange={(e) =>
                setUser({
                  ...user,
                  phone: phoneFormat(e.target.value),
                })
              }
            />
          </div>
          <div style={{ width: "100%" }}>
            <h5>{t("Register.whatsapp")}</h5>
            <InputData
              style={{ width: "100%" }}
              // id="clientWhatsapp"
              name="clientWhatsapp"
              placeholder={t("Register.whatsapp")}
              className="input_2"
              value={user.whatsApp}
              onChange={(e) =>
                setUser({
                  ...user,
                  whatsApp: phoneFormat(e.target.value),
                })
              }
            />
          </div>
        </div>
        <h5>{t("Register.addressLabel")}</h5>
        <div className="input_row_2new">
          <div style={{ width: window.innerWidth < 768 ?"100%" : "30%" }}>
            <h5>{t("Register.cep")}</h5>
            <InputData
              style={{ width: "100%" }}
              ref={cepInput}
              type="text"
              // id="cep"
              name="cep"
              placeholder={t("Register.cep")}
              value={user.cep}
              onChange={handleCep}
              className="input_20"
            />
          </div>
          <div style={{ width: "100%" }}>
            <h5>Endereço</h5>
            <InputData
              style={{ width: "100%" }}
              type="text"
              // id="address"
              name="address"
              placeholder={'Endereço'}
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              className="input_80"
            />
          </div>
        </div>
        <div className="input_row_2new">
          <div style={{ width: "100%" }}>
            <h5>Complemento</h5>
            <InputData
              style={{ width: "100%" }}
              type="text"
              placeholder={'Complemento'}
              value={user.complement}
              onChange={(e) => setUser({ ...user, complement: e.target.value })}
              className="input_80"
            />
          </div>
          <div style={{width: window.innerWidth < 768 ?"100%" : "30%" }}>
            <h5>Número</h5>
            <InputData
              style={{ width: "100%" }}
              type="number"
              // id="number"
              placeholder={t("Register.number")}
              className="input_20"
              value={user.number}
              onChange={(e) => setUser({ ...user, number: e.target.value })}
            />
          </div>
        </div>
        <div className="input_row_3new">
          <div style={{ width: "100%" }}>
            <h5>Bairro</h5>
            <InputData
              style={{ width: "100%" }}
              type="text"
              // id="district"
              placeholder={'Bairro'}
              value={user.district}
              onChange={(e) => setUser({ ...user, district: e.target.value })}
              className="input_3"
            />
          </div>
          <div style={{ width: "100%" }}>
            <h5>Cidade</h5>
            <InputData
              style={{ width: "100%" }}
              type="text"
              // id="city"
              placeholder={'Cidade'}
              value={user.city}
              onChange={(e) => setUser({ ...user, city: e.target.value })}
              className="input_3"
            />
          </div>
          <div style={{ width: "100%" }}>
            <h5>{t("Register.uf")}</h5>
            <SelectUfs
              style={{ height: "40px", width: "100%" }}
              name="UF"
              // id="uf"
              placeholder={t("Register.uf")}
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
        </div>
        {type === "DEALER" && (
          <>
            <h5>{t("Register.BankDataLabel")}</h5>
            <BankAccountExtern
              goBackStep={() => console.log("nada fazer")}
              goStep={() => console.log("proximo")}
              bank={bank}
              setBank={setBank}
            />
          </>
        )}
        <div className="input_row_2new">
          <div style={{ width: "100%" }}>
            <h5>{t("Register.password")}</h5>
            <InputPassSignUp>
              <input
                type={typePass}
                placeholder={t("Register.password")}
                value={newPass}
                // id="password"
                name="password"
                onChange={(e) => setNewPass(e.target.value)}
              />
              {newPass &&
                (typePass === "password" ? (
                  <LiaEyeSolid
                    className="eyes"
                    onClick={handleTypePass}
                    size={25}
                  />
                ) : (
                  <LiaEyeSlash
                    className="eyes"
                    onClick={handleTypePass}
                    size={25}
                  />
                ))}
            </InputPassSignUp>
          </div>
          {/* <br /> */}
          <div style={{ width: "100%" }}>
            <h5>{t("Register.repeatPassword")}</h5>
            <InputPassSignUp>
              <input
                type={typePassConfirm}
                placeholder={t("Register.repeatPassword")}
                value={confirmNewPass}
                // id="secondpassword"
                name="secondpassword"
                onChange={(e) => setConfirmNewPass(e.target.value)}
              />
              {confirmNewPass &&
                (typePassConfirm === "password" ? (
                  <LiaEyeSolid
                    className="eyes"
                    onClick={handleTypePassConfirm}
                    size={25}
                  />
                ) : (
                  <LiaEyeSlash
                    className="eyes"
                    onClick={handleTypePassConfirm}
                    size={25}
                  />
                ))}
            </InputPassSignUp>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
            // margin: "1rem",
            gap: 10,
          }}
        >
          {!location.pathname.match("/register") && (
            <Button
              onClick={() => {
                setSingUp(true);
                window.scrollTo(0, 0);
              }}
            >
              {t("Register.goback")}
            </Button>
          )}
          <Button onClick={register} notHover>
            {loadingC ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 15,
                }}
              >
                <ReactLoading type={"bars"} color={"#fff"} />
              </div>
            ) : location.pathname.match("/register") ? (
              t("Register.accept")
            ) : (
              t("Register.finally")
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

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
import { Loading } from "../../../components/loading/Loading";
import { useTranslation } from "react-i18next";

export const NewClientExtern = ({ setSingUp, data }) => {
  const { t } = useTranslation();
  const cepInput = useRef(null);
  const clientNameInput = document.getElementById("clientName");
  const clientCPFInput = document.getElementById("clientCPF");
  const clientCNPJInput = document.getElementById("clientCNPJ");
  const clientRGInput = document.getElementById("clientRG");
  const clientIEInput = document.getElementById("clientIE");

  const clientEmailInput = document.getElementById("clientEmail");
  const clientSecondEmailInput = document.getElementById("clientSecondEmail");
  const clientPhoneInput = document.getElementById("clientPhone");
  const clientCelInput = document.getElementById("clientWhatsapp");
  const addressInput = document.getElementById("address");
  const numberInput = document.getElementById("number");
  const districtInput = document.getElementById("district");
  const cityInput = document.getElementById("city");
  const ufInput = document.getElementById("uf");

  const companyNameInput = document.getElementById("companyName");
  const companyCnpjInput = document.getElementById("companyCNPJ");
  const companyIeInput = document.getElementById("companyIE");
  // const companyEmailInput = document.getElementById("companyEmail");
  const companyPhoneInput = document.getElementById("companyPhone");
  const companyAddressInput = document.getElementById("companyAddress");
  const companyNumberInput = document.getElementById("companyNumber");
  const companyDistrictInput = document.getElementById("companyDistrict");
  const companyCityInput = document.getElementById("companyCity");
  const companyUfInput = document.getElementById("companyUf");
  const [loading, setLoading] = useState(false);
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

  const [company, setCompany] = useState({
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

  useEffect(() => {
    console.log(data);
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

  const pjValidate = () => {
    if (company.name !== "") {
      companyNameInput?.style.removeProperty("border-color");
      if (company.cnpj !== "") {
        if (validateCnpj(company.cnpj)) {
          companyCnpjInput?.style.removeProperty("border-color");
          if (company.ie !== "") {
            companyIeInput?.style.removeProperty("border-color");
            if (company.date !== "") {
              if (company.email !== "") {
                if (company.phone !== "") {
                  companyPhoneInput?.style.removeProperty("border-color");
                  if (
                    company.cep !== "" &&
                    company.cep.replace(".", "").replace("-", "").length === 8
                  ) {
                    // cepInput?.style.removeProperty('border-color');
                    if (
                      company.address !== "" &&
                      company.address.trim().length > 0
                    ) {
                      companyAddressInput?.style.removeProperty("border-color");
                      if (company.number !== "" && Number(company.number) > 0) {
                        companyNumberInput?.style.removeProperty(
                          "border-color"
                        );
                        if (
                          company.district !== "" &&
                          company.district.trim().length > 0
                        ) {
                          companyDistrictInput?.style.removeProperty(
                            "border-color"
                          );
                          if (
                            company.city !== "" &&
                            company.city.trim().length > 0
                          ) {
                            companyCityInput?.style.removeProperty(
                              "border-color"
                            );
                            if (company.uf !== "") {
                              companyUfInput?.style.removeProperty(
                                "border-color"
                              );
                              return true;
                            } else {
                              companyUfInput.style.borderColor = "red";
                              toast.error(t("ErrorMsgs.required.uf"));
                            }
                          } else {
                            companyCityInput.style.borderColor = "red";
                            toast.error(t("ErrorMsgs.required.city"));
                          }
                        } else {
                          companyDistrictInput.style.borderColor = "red";
                          toast.error(t("ErrorMsgs.required.neighborhood"));
                        }
                      } else {
                        companyNumberInput.style.borderColor = "red";
                        toast.error(t("ErrorMsgs.required.number"));
                      }
                    } else {
                      companyAddressInput.style.borderColor = "red";
                      toast.error(t("ErrorMsgs.required.address"));
                    }
                  } else {
                    // cepInput.current.style.borderColor = "red";
                    // cepInput.style.borderColor = 'red';
                    toast.error(t("ErrorMsgs.invalid.cep"));
                  }
                } else {
                  toast.error(t("ErrorMsgs.required.phone"));
                  companyPhoneInput.style.borderColor = "red";
                }
              } else {
                toast.error(t("ErrorMsgs.required.email"));
                // clientEmailInput.style.borderColor = 'red';
              }
            } else {
              toast.error(t("ErrorMsgs.required.date"));
            }
          } else {
            toast.error(t("ErrorMsgs.required.ie"));
            companyIeInput.style.borderColor = "red";
          }
        } else {
          toast.error(t("ErrorMsgs.invalid.cnpj"));
          companyCnpjInput.style.borderColor = "red";
        }
      } else {
        toast.error(t("ErrorMsgs.required.cnpj"));
        companyCnpjInput.style.borderColor = "red";
      }
    } else {
      toast.error(t("ErrorMsgs.required.companyName"));
      companyNameInput.style.borderColor = "red";
    }
  };

  const register = () => {
    if (user.name !== "") {
      clientNameInput?.style.removeProperty("border-color");
      if (
        (user.cpf !== "" && selected === "PESSOA FISICA") ||
        ((user.cnpj !== "" || company.cnpj !== "") &&
          selected === "PESSOA JURÍDICA")
      ) {
        if (
          selected === "PESSOA JURÍDICA"
            ? user?.cnpj.length === 18 || company?.cnpj.length === 18
            : validateCpf(user.cpf)
        ) {
          clientCPFInput?.style.removeProperty("border-color");
          clientCNPJInput?.style.removeProperty("border-color");
          if (
            (user.rg !== "" && selected === "PESSOA FISICA") ||
            ((user.ie !== "" || company.ie !== "") &&
              selected === "PESSOA JURÍDICA")
          ) {
            clientRGInput?.style.removeProperty("border-color");
            clientIEInput?.style.removeProperty("border-color");
            if (user.date !== "") {
              if (user.email !== "") {
                if (user.email !== user.secondEmail) {
                  clientEmailInput?.style.removeProperty("border-color");
                  clientSecondEmailInput?.style.removeProperty("border-color");
                  if (user.phone !== "") {
                    clientPhoneInput?.style.removeProperty("border-color");
                    if (user.whatsApp !== "") {
                      clientCelInput?.style.removeProperty("border-color");
                      if (
                        user.cep !== "" &&
                        user.cep.replace(".", "").replace("-", "").length === 8
                      ) {
                        // cepInput?.style.removeProperty('border-color');
                        // cepInput.current.style.borderColor = "";
                        if (
                          user.address !== "" &&
                          user.address.trim().length > 0
                        ) {
                          addressInput?.style.removeProperty("border-color");
                          if (user.number !== "" && Number(user.number) > 0) {
                            numberInput?.style.removeProperty("border-color");
                            if (
                              user.district !== "" &&
                              user.district.trim().length > 0
                            ) {
                              districtInput?.style.removeProperty(
                                "border-color"
                              );
                              if (
                                user.city !== "" &&
                                user.city.trim().length > 0
                              ) {
                                cityInput?.style.removeProperty("border-color");
                                if (user.uf !== "") {
                                  ufInput?.style.removeProperty("border-color");
                                  // setLoading(true);
                                  if (newPass) {
                                    if (confirmNewPass) {
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
                                                toast.success(
                                                  res?.data?.Message
                                                );
                                                setSingUp(true);
                                              })
                                              .catch((err) =>
                                                translateError(err)
                                              )
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
                                            if (company.email !== "") {
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
                                                  toast.success(
                                                    res?.data?.Message
                                                  );
                                                  setSingUp(true);
                                                })
                                                .catch((err) =>
                                                  translateError(err)
                                                )
                                                .finally(() => {
                                                  setLoading(false);
                                                  setLoadingC(false);
                                                });
                                            } else {
                                              setLoadingC(false);
                                              toast.error(
                                                "Email de acesso como embaixador deve ser informado"
                                              );
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
                                                toast.success(
                                                  res?.data?.Message
                                                );
                                                setSingUp(true);
                                              })
                                              .catch((err) =>
                                                translateError(err)
                                              )
                                              .finally(() => {
                                                setLoading(false)
                                                setLoadingC(false)
                                              });
                                          }
                                        }
                                      } else {
                                        toast.error(
                                          t("ErrorMsgs.passwordNotMatch")
                                        );
                                      }
                                    } else {
                                      toast.error(
                                        t("ErrorMsgs.passwordConfirm")
                                      );
                                    }
                                  } else {
                                    toast.error(
                                      t("ErrorMsgs.required.password")
                                    );
                                  }
                                } else {
                                  ufInput.style.borderColor = "red";
                                  toast.error(t("ErrorMsgs.required.uf"));
                                }
                              } else {
                                cityInput.style.borderColor = "red";
                                toast.error(t("ErrorMsgs.required.city"));
                              }
                            } else {
                              districtInput.style.borderColor = "red";
                              toast.error(t("ErrorMsgs.required.neighborhood"));
                            }
                          } else {
                            numberInput.style.borderColor = "red";
                            toast.error(t("ErrorMsgs.required.number"));
                          }
                        } else {
                          addressInput.style.borderColor = "red";
                          toast.error(t("ErrorMsgs.required.address"));
                        }
                      } else {
                        cepInput.current.style.borderColor = "red";
                        // cepInput.style.borderColor = 'red';
                        toast.error(t("ErrorMsgs.invalid.cep"));
                      }
                    } else {
                      toast.error(t("ErrorMsgs.required.whatsapp"));
                      clientCelInput.style.borderColor = "red";
                    }
                  } else {
                    toast.error(t("ErrorMsgs.required.phone"));
                    clientPhoneInput.style.borderColor = "red";
                  }
                } else {
                  toast.error(t("ErrorMsgs.secondMailMatch"));
                  clientEmailInput.style.borderColor = "red";
                  clientSecondEmailInput.style.borderColor = "red";
                }
              } else {
                toast.error(t("ErrorMsgs.required.email"));
                // clientEmailInput.style.borderColor = 'red';
              }
            } else {
              toast.error(t("ErrorMsgs.required.birthday"));
            }
          } else {
            if (selected === "PESSOA JURÍDICA") {
              toast.error(t("ErrorMsgs.required.ie"));
              clientIEInput.style.borderColor = "red";
            } else {
              toast.error(t("ErrorMsgs.required.rg"));
              clientRGInput.style.borderColor = "red";
            }
          }
        } else {
          if (selected === "PESSOA JURÍDICA") {
            toast.error(t("ErrorMsgs.valid.cnpj"));
            clientCNPJInput.style.borderColor = "red";
          } else {
            toast.error(t("ErrorMsgs.validcpf"));
            clientCPFInput.style.borderColor = "red";
          }
        }
      } else {
        if (selected === "PESSOA JURÍDICA") {
          toast.error(t("ErrorMsgs.required.cnpj"));
          clientCNPJInput.style.borderColor = "red";
        } else {
          toast.error(t("ErrorMsgs.required.cpf"));
          clientCPFInput.style.borderColor = "red";
        }
      }
    } else {
      toast.error(t("ErrorMsgs.required.name"));
      clientNameInput.style.borderColor = "red";
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "1rem" }}>
      <Loading open={loading} msg={t("LoadingMsgs.endRegister")} />

      {!location.pathname.match("/register") && (
        <div
          style={{
            width: "100%",
            display: screen.width < 768 ? "block" : "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", color: "green" }}>
              <FormControl>
                <RadioGroup
                  defaultValue="outlined"
                  name="radio-buttons-group"
                  orientation="horizontal"
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
                  orientation="horizontal"
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
            className="input_row_1"
            style={{ flexDirection: screen.width < 768 && "column" }}
          >
            <InputData
              id="companyName"
              type="text"
              placeholder={t("Register.name")}
              style={{ width: "100%" }}
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
            />
          </div>
          <div className="input_row_3">
            <InputData
              id="companyCNPJ"
              type="text"
              placeholder={t("Register.cnpj")}
              className="input_3"
              value={company.cnpj}
              onChange={(e) => setCompany({ ...company, cnpj: cnpjFormat(e) })}
            />
            <InputData
              id="companyIE"
              // type="number"
              placeholder={t("Register.ie")}
              className="input_3"
              value={company.ie}
              onChange={(e) => setCompany({ ...company, ie: e.target.value })}
            />
            <div className="input_3">
              <DatePicker
                className={styleLabel}
                disableFuture
                underlineStyle={{ display: "none" }}
                size={"small"}
                label={t("Register.fundationDate")}
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
                      svg: { marginTop: "-15px" },
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
          <div className="input_row_2">
            <InputData
              id="companyEmail"
              type="text"
              placeholder={t("Register.email")}
              className="input_2"
              value={company.email}
              onChange={(e) =>
                setCompany({ ...company, email: e.target.value })
              }
            />
            <InputData
              id="companyPhone"
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
          <h5>{t("Register.addressLabel")}</h5>
          <div className="input_row_2">
            <InputData
              ref={cepInput}
              type="text"
              id="companyCep"
              name="cep"
              placeholder={t("Register.cep")}
              value={company.cep}
              onChange={handleCepCompany}
              className="input_20"
            />
            <InputData
              type="text"
              id="companyAddress"
              placeholder={t("Register.address")}
              value={company.address}
              onChange={(e) =>
                setCompany({ ...company, address: e.target.value })
              }
              className="input_80"
            />
          </div>
          <div className="input_row_2">
            <InputData
              ic="companyComplement"
              type="text"
              placeholder={t("Register.complement")}
              value={company.complement}
              onChange={(e) =>
                setCompany({ ...company, complement: e.target.value })
              }
              className="input_80"
            />
            <InputData
              type="number"
              id="companyNumber"
              placeholder={t("Register.number")}
              className="input_20"
              value={company.number}
              onChange={(e) =>
                setCompany({ ...company, number: e.target.value })
              }
            />
          </div>
          <div className="input_row_3">
            <InputData
              type="text"
              id="companyDistrict"
              placeholder={t("Register.neighborhood")}
              value={company.district}
              onChange={(e) =>
                setCompany({ ...company, district: e.target.value })
              }
              className="input_3"
            />
            <InputData
              type="text"
              id="companyCity"
              placeholder={t("Register.city")}
              value={company.city}
              onChange={(e) => setCompany({ ...company, city: e.target.value })}
              className="input_3"
            />
            <SelectUfs
              style={{ height: "40px" }}
              name="UF"
              id="companyUf"
              placeholder={t("Register.uf")}
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
        </>
      )}

      <div>
        <h5>{t("Register.personData")}</h5>
      </div>
      <div
        className="input_row_1"
        style={{ flexDirection: screen.width < 768 && "column" }}
      >
        <InputData
          id="clientName"
          type="text"
          placeholder={t("Register.name")}
          style={{ width: "100%" }}
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
      </div>
      <div className="input_row_3">
        {selected === "PESSOA JURÍDICA" && type !== "DEALER" ? (
          <InputData
            id="clientCNPJ"
            type="text"
            placeholder={t("Register.cnpj")}
            className="input_3"
            value={user.cnpj}
            onChange={(e) => setUser({ ...user, cnpj: cnpjFormat(e) })}
          />
        ) : (
          <InputData
            id="clientCPF"
            type="text"
            placeholder={t("Register.cpf")}
            className="input_3"
            value={user.cpf}
            onChange={(e) => setUser({ ...user, cpf: cpfFormat(e) })}
          />
        )}
        {selected === "PESSOA JURÍDICA" && type !== "DEALER" ? (
          <InputData
            id="clientIE"
            // type="number"
            placeholder={t("Register.ie")}
            className="input_3"
            value={user.ie}
            onChange={(e) => setUser({ ...user, ie: e.target.value })}
          />
        ) : (
          <InputData
            id="clientRG"
            type="text"
            placeholder={t("Register.rg")}
            className="input_3"
            value={user.rg}
            onChange={(e) => setUser({ ...user, rg: e.target.value })}
          />
        )}
        <div className="input_3">
          <DatePicker
            className={styleLabel}
            disableFuture
            underlineStyle={{ display: "none" }}
            size={"small"}
            label={
              selected === "PESSOA JURÍDICA" && type !== "DEALER"
                ? t("Register.fundationDate")
                : t("Register.birthday")
            }
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
                  svg: { marginTop: "-15px" },
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
            value={user.date}
            onChange={(e) => {
              setUser({ ...user, date: e });
            }}
          />
        </div>
      </div>
      <div className="input_row_2">
        <InputData
          id="clientEmail"
          type="text"
          placeholder={t("Register.email")}
          className="input_2"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        {/* email de acesso para a revenda */}
        {selected !== "PESSOA JURÍDICA" && type === "DEALER" && (
          <InputData
            id="clientSecondEmail"
            type="text"
            placeholder={t("Register.emailResale1")}
            className="input_2"
            value={company.email}
            onChange={(e) => setCompany({ ...company, email: e.target.value })}
          />
        )}
        <InputData
          id="clientSecondEmail"
          type="text"
          placeholder={t("Register.secondMail")}
          className="input_2"
          value={user.secondEmail}
          onChange={(e) => setUser({ ...user, secondEmail: e.target.value })}
        />
      </div>
      <div className="input_row_2">
        <InputData
          id="clientPhone"
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
        <InputData
          id="clientWhatsapp"
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
      <h5>{t("Register.addressLabel")}</h5>
      <div className="input_row_2">
        <InputData
          ref={cepInput}
          type="text"
          id="cep"
          name="cep"
          placeholder={t("Register.cep")}
          value={user.cep}
          onChange={handleCep}
          className="input_20"
        />
        <InputData
          type="text"
          id="address"
          placeholder={t("Register.address")}
          value={user.address}
          onChange={(e) => setUser({ ...user, address: e.target.value })}
          className="input_80"
        />
      </div>
      <div className="input_row_2">
        <InputData
          type="text"
          placeholder={t("Register.complement")}
          value={user.complement}
          onChange={(e) => setUser({ ...user, complement: e.target.value })}
          className="input_80"
        />
        <InputData
          type="number"
          id="number"
          placeholder={t("Register.number")}
          className="input_20"
          value={user.number}
          onChange={(e) => setUser({ ...user, number: e.target.value })}
        />
      </div>
      <div className="input_row_3">
        <InputData
          type="text"
          id="district"
          placeholder={t("Register.neighborhood")}
          value={user.district}
          onChange={(e) => setUser({ ...user, district: e.target.value })}
          className="input_3"
        />
        <InputData
          type="text"
          id="city"
          placeholder={t("Register.city")}
          value={user.city}
          onChange={(e) => setUser({ ...user, city: e.target.value })}
          className="input_3"
        />
        <SelectUfs
          style={{ height: "40px" }}
          name="UF"
          id="uf"
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
      <div className="input_row_2">
        <div style={{ width: "100%" }}>
          <h5>{t("Register.password")}</h5>
          <InputPassSignUp>
            <input
              type={typePass}
              placeholder={t("Register.password")}
              value={newPass}
              id="password"
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
              id="password"
              name="password"
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
          margin: "1rem",
          gap: 10,
        }}
      >
        {!location.pathname.match("/register") && (
          <Button onClick={() => setSingUp(true)}>
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
  );
};

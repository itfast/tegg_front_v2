import moment from "moment";
import { AiFillEdit } from "react-icons/ai";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ReactLoading from "react-loading";
import {
  UFS,
  cepFormat,
  cnpjFormat,
  cpfFormat,
  documentFormat,
  getCEP,
  phoneFormat,
  translateError,
  validateCpf,
} from "../../services/util";
import "./perfilSettings.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  CardData,
  InputData,
  SelectUfs,
} from "../../pages/resales/Resales.styles";
import { Button } from "../../../globalStyles";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

/* eslint-disable react/prop-types */
export const PerfilSettingsDealer = ({ data, search }) => {
  const cepInput = useRef(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // const location = useLocation();
  // const [hasUser, setHasUser] = useState(false);
  const [company, setCompany] = useState({
    name: data?.Name,
    cpf: data?.Cpf,
    rg: data?.Rg,
    date: data?.Birthday && new Date(data?.Birthday),
    email: data?.Email,
    secondEmail: data?.SecondEmail,
    phone: data?.Mobile,
    cep: "",
    address: "",
    complement: "",
    number: "",
    district: "",
    city: "",
    uf: "",
    cnpj: data?.Cnpj,
    ie: data?.Ie,
    whatsApp: data?.Whatsapp,
    IdLegacySystem: data?.IdLegacySystem,
    DealerId: data?.DealerId,
    ICMSContributor: data?.ICMSContributor,
    Type: data?.Type,
    Status: data?.Status,
  });
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

  useEffect(() => {
    setCompany({
      name: data?.Name,
      cpf: data?.Cpf,
      rg: data?.Rg,
      date: data?.Birthday && new Date(data?.Birthday),
      CompanyCity: data?.CompanyCity,
      CompanyDistrict: data?.CompanyDistrict,
      CompanyEmail: data?.CompanyEmail,
      CompanyMobile: data?.CompanyMobile,
      CompanyName: data?.CompanyName,
      CompanyNumber: data?.CompanyNumber,
      CompanyPostalCode: data?.CompanyPostalCode,
      CompanyState: data?.CompanyState,
      CompanyStreetName: data?.CompanyStreetName,
      CompanyComplement: data?.CompanyComplement,
      email: data?.Email,
      secondEmail: data?.SecondEmail,
      phone: data?.Mobile,
      cep: data?.PostalCode,
      address: data?.StreetName,
      complement: data?.Complement,
      number: data?.Number,
      district: data?.District,
      city: data?.City,
      uf: data?.State,
      cnpj: data?.Cnpj,
      ie: data?.Ie,
      whatsApp: data?.Whatsapp,
      IdLegacySystem: data?.IdLegacySystem,
      DealerId: data?.DealerId,
      ICMSContributor: data?.ICMSContributor,
      Type: data?.Type,
      Status: data?.Status,
    });
  }, [data]);

  const handleCep = async (e) => {
    setCompany({ ...company, cep: cepFormat(e.target.value) });

    const res = await getCEP(e);
    if (res) {
      if (data?.Cnpj) {
        setCompany({
          ...company,
          CompanyPostalCode: cepFormat(e.target.value),
          CompanyState: res.uf || "",
          CompanyDistrict: res.bairro || "",
          CompanyCity: res.localidade || "",
          CompanyStreetName: res.logradouro || "",
          CompanyNumber: "",
        });
      } else {
        setCompany({
          ...company,
          cep: cepFormat(e.target.value),
          uf: res.uf || "",
          district: res.bairro || "",
          city: res.localidade || "",
          address: res.logradouro || "",
          number: "",
        });
      }
    }
  };

  const updateAll = () => {
    if (
      company.cep !== "" &&
      company.cep.replace(".", "").replace("-", "").length === 8
    ) {
      // cepInput?.style.removeProperty('border-color');
      cepInput.current.style.borderColor = "";
      if (company.address !== "" && company.address.trim().length > 0) {
        addressInput?.style.removeProperty("border-color");
        if (company.number !== "" && Number(company.number) > 0) {
          numberInput?.style.removeProperty("border-color");
          if (company.district !== "" && company.district.trim().length > 0) {
            districtInput?.style.removeProperty("border-color");
            if (company.city !== "" && company.city.trim().length > 0) {
              cityInput?.style.removeProperty("border-color");
              if (company.uf !== "") {
                ufInput?.style.removeProperty("border-color");

                const myCompany = {
                  cnpj: company.cnpj,
                  ie: company.ie,
                  im: company.im,
                  rz: company.CompanyName,
                  email: company.CompanyEmail,
                  phone: company.CompanyMobile,
                  cep: company.CompanyPostalCode,
                  address: company.CompanyStreetName,
                  uf: company.CompanyState,
                  city: company.CompanyCity,
                  district: company.CompanyDistric,
                  number: company.CompanyNumber,
                  complement: company.CompanyComplement,
                };
                const myUser = {
                  icmsContributor: data?.ICMSContributor,
                  name: company.name,
                  cpf: company.cpf,
                  rg: company.rg,
                  date: company.date,
                  email: company.email,
                  secondEmail: data?.secondEmail,
                  phone: company.phone,
                  cep: company.cep,
                  address: company.address,
                  uf: company.uf,
                  city: company.city,
                  district: company.district,
                  number: company.number,
                  complement: company.complement,
                };
                const bank = {
                  pixType: data?.PixKeyType,
                  pixKey: data?.PixKey,
                  bankName: data?.Bank,
                  ag: data?.BranchNumber,
                  agDigit: data?.BranchVerifier,
                  account: data?.AcountNumber,
                  accountDigit: data?.AccountNumberVerifier,
                  op: data?.Operation,
                  IdLegacySystem: data?.IdLegacySystem
                    ? data?.IdLegacySystem
                    : null,
                  OperationCity:
                    data?.OperationCity,
                };
                const userLegacy = {
                  value: data?.IdLegacySystem,
                };
                setLoading(true);
                api.dealer
                  .update(
                    data?.Id,
                    myCompany,
                    myUser,
                    bank,
                    userLegacy,
                    data?.OperationCity
                  )
                  .then((res) => {
                    toast.success(res.data?.Message);
                    search();
                    setShow(false);
                  })
                  .catch((err) => {
                    translateError(err);
                  })
                  .finally(() => setLoading(false));
              } else {
                ufInput.style.borderColor = "red";
                toast.error("UF é obrigatório");
              }
            } else {
              cityInput.style.borderColor = "red";
              toast.error("Cidade é obrigatório");
            }
          } else {
            districtInput.style.borderColor = "red";
            toast.error("Bairro é obrigatório");
          }
        } else {
          numberInput.style.borderColor = "red";
          toast.error("Número é obrigatório");
        }
      } else {
        addressInput.style.borderColor = "red";
        toast.error("Endereço é obrigatório");
      }
    } else {
      console.log(cepInput.current.borderColor);
      cepInput.current.style.borderColor = "red";
      // cepInput.style.borderColor = 'red';
      toast.error("Insira um CEP válido");
    }
  };

  const updateData = () => {
    if (!data?.Cnpj) {
      if (company.name !== "") {
        clientNameInput?.style.removeProperty("border-color");
        if (company.cpf !== "") {
          if (validateCpf(company.cpf)) {
            clientCPFInput?.style.removeProperty("border-color");
            if (company.rg !== "") {
              clientRGInput?.style.removeProperty("border-color");
              if (company.date !== "") {
                if (company.email !== "") {
                  if (company.email !== "") {
                    clientEmailInput?.style.removeProperty("border-color");
                    clientSecondEmailInput?.style.removeProperty(
                      "border-color"
                    );
                    if (company.phone !== "") {
                      clientPhoneInput?.style.removeProperty("border-color");
                      if (company.phone !== "") {
                        clientCelInput?.style.removeProperty("border-color");
                        // goStep();
                        // setLoading(true);
                        updateAll();
                        // console.log('Atualizar');
                      } else {
                        toast.error("Telefone é obrigatório");
                        clientCelInput.style.borderColor = "red";
                      }
                    } else {
                      toast.error("Telefone é obrigatório");
                      clientPhoneInput.style.borderColor = "red";
                    }
                  } else {
                    toast.error("Email é obrigatório");
                    clientEmailInput.style.borderColor = "red";
                    clientSecondEmailInput.style.borderColor = "red";
                  }
                } else {
                  toast.error("Email é obrigatório");
                  // clientEmailInput.style.borderColor = 'red';
                }
              } else {
                toast.error("Data de nascimento é obrigatório");
              }
            } else {
              toast.error("RG é obrigatório");
              clientRGInput.style.borderColor = "red";
            }
          } else {
            toast.error("Informe um CPF válido");
            clientCPFInput.style.borderColor = "red";
          }
        } else {
          toast.error("CPF é obrigatório");
          clientCPFInput.style.borderColor = "red";
        }
      } else {
        toast.error("Nome é obrigatório");
        clientNameInput.style.borderColor = "red";
      }
    } else {
      if (company.CompanyName !== "") {
        clientNameInput?.style.removeProperty("border-color");
        if (company.cnpj !== "") {
          clientCNPJInput?.style.removeProperty("border-color");
          if (company.ie !== "") {
            clientIEInput?.style.removeProperty("border-color");
            if (company.date !== "") {
              if (company.CompanyEmail !== "") {
                if (company.CompanyEmail !== "") {
                  clientEmailInput?.style.removeProperty("border-color");
                  clientSecondEmailInput?.style.removeProperty("border-color");
                  if (company.phone !== "") {
                    clientPhoneInput?.style.removeProperty("border-color");
                    if (company.phone !== "") {
                      clientCelInput?.style.removeProperty("border-color");
                      updateAll();
                    } else {
                      toast.error("Telefone é obrigatório");
                      clientCelInput.style.borderColor = "red";
                    }
                  } else {
                    toast.error("Telefone é obrigatório");
                    clientPhoneInput.style.borderColor = "red";
                  }
                } else {
                  toast.error("Email é obrigatório");
                  clientEmailInput.style.borderColor = "red";
                  clientSecondEmailInput.style.borderColor = "red";
                }
              } else {
                toast.error("Email é obrigatório");
                clientEmailInput.style.borderColor = "red";
              }
            } else {
              toast.error("Data de fundação é obrigatório");
            }
          } else {
            toast.error("IE é obrigatório");
            clientIEInput.style.borderColor = "red";
          }
        } else {
          toast.error("CNPJ é obrigatório");
          clientCNPJInput.style.borderColor = "red";
        }
      } else {
        toast.error("Nome é obrigatório");
        clientNameInput.style.borderColor = "red";
      }
    }
  };

  return (
    <>
      <div className="header_container">
        <div className="column-100">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <p style={{ fontWeight: "bold" }}>DADOS</p>
            <AiFillEdit
              size={20}
              color="blue"
              style={{ cursor: "pointer" }}
              onClick={() => setShow(true)}
            />
          </div>
          <div className="header_content">
            <div>
              <label style={{ fontWeight: "bold" }}>NOME</label>
              <p>{data.Name}</p>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>
                {!data.Cnpj ? "RG" : "IE"}
              </label>
              <p style={{ wordWrap: "anywhere" }}>
                {!data.Cnpj ? data?.Rg : data?.Ie}
              </p>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>
                {data.Cnpj ? "CNPJ" : "CPF"}
              </label>
              <p style={{ wordWrap: "anywhere" }}>
                {/* {(data.Cnpj || data.Cpf) &&
                  documentFormat(data.Cnpj || data.Cpf)} */}
                {!data.Cnpj
                  ? data.Cpf && documentFormat(data.Cpf)
                  : data.Cnpj && documentFormat(data.Cnpj)}
              </p>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>DATA NASCIMENTO</label>
              <p>
                {data.Birthday && moment(data.Birthday).format("DD/MM/YYYY")}
              </p>
            </div>
          </div>
          <div className="header_content">
            <div>
              <label style={{ fontWeight: "bold" }}>TELEFONE</label>
              <p style={{ wordWrap: "anywhere" }}>
                {data.Mobile && phoneFormat(data?.Mobile)}
              </p>
            </div>
            {/* <div>
              <label style={{ fontWeight: 'bold' }}>WHATSAPP</label>
              <p>{data.Whatsapp && phoneFormat(data?.Whatsapp)}</p>
            </div> */}
            <div>
              <label style={{ fontWeight: "bold" }}>EMAIL</label>
              <p style={{ wordWrap: "anywhere" }}>{data.CompanyEmail || data.Email}</p>
            </div>
            {/* <div>
              <label style={{ fontWeight: 'bold' }}>EMAIL SECUNDÁRIO</label>
              <p>{data?.SecondEmail}</p>
            </div> */}
          </div>
          <br />
          <div>
            <p style={{ fontWeight: "bold" }}>ENDEREÇO</p>
          </div>
          <div className="header_content">
            <div>
              <label style={{ fontWeight: "bold" }}>LOGRADOURO</label>
              <p>{data?.StreetName || data?.CompanyStreetName}</p>
            </div>

            <div>
              <label style={{ fontWeight: "bold" }}>NÚMERO</label>
              <p>{data?.Number || data?.CompanyNumber}</p>
            </div>

            <div>
              <label style={{ fontWeight: "bold" }}>BAIRRO</label>
              <p>{data?.District || data?.CompanyDistrict}</p>
            </div>

            <div>
              <label style={{ fontWeight: "bold" }}>CIDADE</label>
              <p>{data?.City || data?.CompanyCity}</p>
            </div>
          </div>
          <div className="header_content">
            <div>
              <label style={{ fontWeight: "bold" }}>CEP</label>
              <p>{data?.PostalCode || data.CompanyPostalCode}</p>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>UF</label>
              <p>{data?.State || data?.CompanyState}</p>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>COMPLEMENTO</label>
              <p>{data?.Complement || data?.CompanyComplement}</p>
            </div>
          </div>
          <br />
          <div
            style={{ display: "flex", width: "100%", justifyContent: "end" }}
          >
            <div>
              <label style={{ fontWeight: "bold" }}>ÚLTIMA ATUALIZAÇÃO</label>
              <p>
                {data?.CreatedAt &&
                  moment(data?.UpdatedAt).format("DD/MM/YYYY")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={show}
        onClose={() => {
          setShow(false);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">Editar</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <CardData style={{ margin: "auto" }}>
              <h5>DADOS</h5>
              <div className="input_row_1">
                <InputData
                  id="clientName"
                  type="text"
                  placeholder="Nome *"
                  style={{ width: "100%" }}
                  value={company.name}
                  onChange={(e) => {
                    if (data?.CompanyName) {
                      setCompany({ ...company, CompanyName: e.target.value });
                    } else {
                      setCompany({ ...company, name: e.target.value });
                    }
                  }}
                />
              </div>
              <div className="input_row_3">
                {data?.Cnpj ? (
                  <InputData
                    id="clientCNPJ"
                    type="text"
                    placeholder="CNPJ *"
                    className="input_3"
                    value={company.cnpj}
                    onChange={(e) =>
                      setCompany({ ...company, cnpj: cnpjFormat(e) })
                    }
                  />
                ) : (
                  <InputData
                    id="clientCPF"
                    type="text"
                    placeholder="CPF *"
                    className="input_3"
                    value={company.cpf}
                    onChange={(e) =>
                      setCompany({ ...company, cpf: cpfFormat(e) })
                    }
                  />
                )}
                {data?.Cnpj ? (
                  <InputData
                    id="clientIE"
                    type="number"
                    placeholder="IE *"
                    className="input_3"
                    value={company.ie}
                    onChange={(e) =>
                      setCompany({ ...company, ie: e.target.value })
                    }
                  />
                ) : (
                  <InputData
                    id="clientRG"
                    type="text"
                    placeholder="RG *"
                    className="input_3"
                    value={company.rg}
                    onChange={(e) =>
                      setCompany({ ...company, rg: e.target.value })
                    }
                  />
                )}
                <div className="input_3">
                  <DatePicker
                    underlineStyle={{ display: "none" }}
                    size={"small"}
                    label={data?.Cnpj ? "DATA FUNDAÇÃO" : "DATA NASCIMENTO"}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "standard",
                        sx: {
                          px: 2,
                          border: "1px solid #00D959",
                          borderRadius: "8px",
                          height: "40px",
                          svg: { marginTop: "-15px" },
                        },
                        InputProps: { disableUnderline: true },
                      },
                    }}
                    value={company.date}
                    onChange={(e) => {
                      // console.log(e);
                      setCompany({ ...company, date: e });
                    }}
                  />
                </div>
              </div>
              <div className="input_row_2">
                <InputData
                  id="clientEmail"
                  disabled
                  type="text"
                  placeholder="E-mail *"
                  className="input_2"
                  value={company.CompanyEmail || company.email}
                  onChange={(e) => {
                    if (data?.Cnpj) {
                      setCompany({ ...company, CompanyEmail: e.target.value });
                    } else {
                      setCompany({ ...company, email: e.target.value });
                    }
                  }}
                />
                <InputData
                  id="clientPhone"
                  placeholder="Telefone *"
                  className="input_2"
                  value={data.Cnpj ? company.CompanyMobile : company.phone}
                  onChange={(e) => {
                    if (data?.Cnpj) {
                      setCompany({
                        ...company,
                        CompanyMobile: phoneFormat(e.target.value),
                      });
                    } else {
                      setCompany({
                        ...company,
                        phone: phoneFormat(e.target.value),
                      });
                    }
                  }}
                />
                {/* <InputData
                  id='clientSecondEmail'
                  type='text'
                  placeholder='E-mail secundário'
                  className='input_2'
                  value={user.secondEmail}
                  onChange={(e) =>
                    setUser({ ...user, secondEmail: e.target.value })
                  }
                /> */}
              </div>
              <div className="input_row_2">
                {/* <InputData
                  id="clientPhone"
                  placeholder="Telefone *"
                  className="input_2"
                  value={data.Cnpj ? company.CompanyMobile : company.phone}
                  onChange={(e) => {
                    if (data?.Cnpj) {
                      setCompany({
                        ...company,
                        CompanyMobile: phoneFormat(e.target.value),
                      });
                    } else {
                      setCompany({
                        ...company,
                        phone: phoneFormat(e.target.value),
                      });
                    }
                  }}
                /> */}
                {/* <InputData
                  id="clientWhatsapp"
                  placeholder="Whatsapp *"
                  className="input_2"
                  value={user.whatsApp}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      whatsApp: phoneFormat(e.target.value),
                    })
                  }
                /> */}
              </div>
            </CardData>
            <CardData>
              <h5>ENDEREÇO</h5>
              <div className="input_row_2">
                <InputData
                  ref={cepInput}
                  type="text"
                  id="cep"
                  name="cep"
                  placeholder="CEP*"
                  value={data?.Cnpj ? company?.CompanyPostalCode : company.cep}
                  onChange={handleCep}
                  className="input_20"
                />
                <InputData
                  type="text"
                  id="address"
                  placeholder="ENDEREÇO*"
                  value={
                    data?.Cnpj ? company.CompanyStreetName : company.address
                  }
                  onChange={(e) => {
                    if (data?.Cnpj) {
                      setCompany({
                        ...company,
                        CompanyStreetName: e.target.value,
                      });
                    } else {
                      setCompany({ ...company, address: e.target.value });
                    }
                  }}
                  className="input_80"
                />
              </div>
              <div className="input_row_2">
                <InputData
                  type="text"
                  placeholder="COMPLEMENTO"
                  value={
                    data?.Cnpj ? company?.CompanyComplement : company.complement
                  }
                  onChange={(e) => {
                    if (data?.Cnpj) {
                      setCompany({
                        ...company,
                        CompanyComplement: e.target.value,
                      });
                    } else {
                      setCompany({ ...company, complement: e.target.value });
                    }
                  }}
                  className="input_80"
                />
                <InputData
                  type="number"
                  id="number"
                  placeholder="NÚMERO*"
                  className="input_20"
                  value={data?.Cnpj ? company?.CompanyNumber : company.number}
                  onChange={(e) => {
                    if (data?.Cnpj) {
                      setCompany({ ...company, CompanyNumber: e.target.value });
                    } else {
                      setCompany({ ...company, number: e.target.value });
                    }
                  }}
                />
              </div>
              <div className="input_row_3">
                <InputData
                  type="text"
                  id="district"
                  placeholder="BAIRRO*"
                  value={
                    data?.Cnpj ? company?.CompanyDistric : company.district
                  }
                  onChange={(e) => {
                    if (data?.Cnpj) {
                      setCompany({
                        ...company,
                        CompanyDistric: e.target.value,
                      });
                    } else {
                      setCompany({ ...company, district: e.target.value });
                    }
                  }}
                  className="input_3"
                />
                <InputData
                  type="text"
                  id="city"
                  placeholder="CIDADE*"
                  value={data?.Cnpj ? company?.CompanyCity : company.city}
                  onChange={(e) => {
                    if (data?.Cnpj) {
                      setCompany({ ...company, CompanyCity: e.target.value });
                    } else {
                      setCompany({ ...company, city: e.target.value });
                    }
                  }}
                  className="input_3"
                />
                <SelectUfs
                  name="UF"
                  id="uf"
                  placeholder="UF*"
                  value={data?.Cnpj ? company?.CompanyState : company.uf}
                  onChange={(e) => {
                    if (data?.Cnpj) {
                      setCompany({ ...company, CompanyState: e.target.value });
                    } else {
                      setCompany({ ...company, uf: e.target.value });
                    }
                  }}
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
            </CardData>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShow(false);
            }}
          >
            CANCELAR
          </Button>
          <Button onClick={updateData}>
            {loading ? (
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
            ) : (
              "SALVAR"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

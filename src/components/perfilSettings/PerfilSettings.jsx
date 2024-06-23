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
  validateCnpj,
  validateCpf,
  validateName,
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
export const PerfilSettings = ({ data, search }) => {
  const cepInput = useRef(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // const location = useLocation();
  // const [hasUser, setHasUser] = useState(false);
  const [user, setUser] = useState({
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
    IsAgent: data?.User?.Type === "AGENT",
  });
  
  const handleRed = (componet) =>{
    const c = document.getElementById(componet)
    if(c){
      if(c.style){
        c.style.borderColor = "red";
      }
    }
  }

  const handleCleanRed = (componet) =>{
    const c = document.getElementById(componet)
    if(c){
      if(c.style){
        c.style.removeProperty("border-color")
      }
    }
   
  }

  useEffect(() => {
    setUser({
      name: data?.Name,
      cpf: data?.Cpf,
      rg: data?.Rg,
      date: data?.Birthday && new Date(data?.Birthday),
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
      IsAgent: data?.User?.Type === "AGENT",
    });
  }, [data]);

  const handleCep = async (e) => {
    setUser({ ...user, cep: cepFormat(e.target.value) });

    const res = await getCEP(e);
    // console.log(res);
    if (res) {
      setUser({
        ...user,
        cep: cepFormat(e.target.value),
        uf: res.uf || "",
        district: res.bairro || "",
        city: res.localidade || "",
        address: res.logradouro || "",
        number: "",
      });
    }
  };

  const updateAll = () => {
    if (
      user.cep !== "" &&
      user.cep.replace(".", "").replace("-", "").length === 8
    ) {
      handleCleanRed('cep')
      if (user.address !== "" && user.address.trim().length > 0) {
        handleCleanRed('address')
        if (user.number !== "" && Number(user.number) > 0) {
          handleCleanRed('number')
          if (user.district !== "" && user.district.trim().length > 0) {
            handleCleanRed('distric')
            if (user.city !== "" && user.city.trim().length > 0) {
              handleCleanRed('city')
              if (user.uf !== "") {
                handleCleanRed('uf')
                // goStep();
                setLoading(true);
                api.user
                  .update(user, data.Id)
                  .then((res) => {
                    toast.success(res.data?.Message);
                    search();
                    setShow(false);
                  })
                  .catch((err) => {
                    translateError(err);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              } else {
                handleRed('uf')
                toast.error("UF é obrigatório");
              }
            } else {
              handleRed('city')
              toast.error("Cidade é obrigatório");
            }
          } else {
            handleRed('district')
            toast.error("Bairro é obrigatório");
          }
        } else {
          handleRed('number')
          toast.error("Número é obrigatório");
        }
      } else {
        handleRed('address')
        toast.error("Endereço é obrigatório");
      }
    } else {
      handleRed('cep')
      // cepInput.style.borderColor = 'red';
      toast.error("Insira um CEP válido");
    }
  };

  const updateData = () => {
    if (!data?.Cnpj) {
      if (validateName(user.name)) {
        handleCleanRed('clientName')
        if (user.cpf !== "") {
          if (validateCpf(user.cpf)) {
            handleCleanRed('clientCPF')
            if (user.rg !== "") {
              handleCleanRed('clientRG')
              if (user.date !== "") {
                if (user.email !== "") {
                  if (user.email !== user.secondEmail) {
                    handleCleanRed('clientEmail')
                    handleCleanRed('clientSecondEmail')
                    if (user.phone !== "") {
                      handleCleanRed('clientPhone')
                      if (user.whatsApp !== "") {
                        handleCleanRed('clientWhatsapp')
                        // goStep();
                        // setLoading(true);
                        updateAll();
                        // console.log('Atualizar');
                      } else {
                        toast.error("WhatsApp é obrigatório");
                        handleRed('clientWhatsapp')
                      }
                    } else {
                      toast.error("Telefone é obrigatório");
                      handleRed('clientPhone')
                    }
                  } else {
                    toast.error(
                      "Email secundário deve ser diferente do email principal"
                    );
                    handleRed('clientEmail')
                    handleRed('clientSecondEmail')
                  }
                } else {
                  toast.error("Email é obrigatório");
                  handleRed('clientEmail')
                  // clientEmailInput.style.borderColor = 'red';
                }
              } else {
                toast.error("Data de nascimento é obrigatório");
              }
            } else {
              toast.error("RG é obrigatório");
              handleRed('clientRG')
            }
          } else {
            toast.error("Informe um CPF válido");
            handleRed('clientCPF')
          }
        } else {
          toast.error("CPF é obrigatório");
          handleRed('clientCPF')
        }
      } else {
        toast.error("Nome completo é obrigatório");
        handleRed('clientName')
      }
    } else {
      if (user.name !== "") {
        handleCleanRed('clientName')
        if (validateCnpj(user.cnpj)) {
          handleCleanRed('clientCNPJ')
          if (user.ie !== "") {
            handleCleanRed('clientIE')
            if (user.date !== "") {
              if (user.email !== "") {
                if (user.email !== user.secondEmail) {
                  handleCleanRed('clientEmail')
                  handleCleanRed('clientSecondEmail')
                  if (user.phone !== "") {
                    handleCleanRed('clientPhone')
                    if (user.whatsApp !== "") {
                      handleCleanRed('clientWhatsapp')
                      updateAll();
                    } else {
                      toast.error("WhatsApp é obrigatório");
                      handleRed('clientWhatsapp');
                    }
                  } else {
                    toast.error("Telefone é obrigatório");
                    handleRed('clientPhone')
                  }
                } else {
                  toast.error(
                    "Email secundário deve ser diferente do email principal"
                  );
                  handleRed('clientEmail')
                  handleRed('clientSecondEmail')
                }
              } else {
                toast.error("Email é obrigatório");
                handleRed('clientEmail')
              }
            } else {
              toast.error("Data de fundação é obrigatório");
            }
          } else {
            toast.error("IE é obrigatório");
            handleRed('clientIE')
          }
        } else {
          toast.error("CNPJ é obrigatório");
          handleRed('clientCNPJ')
        }
      } else {
        toast.error("Nome é obrigatório");
        handleRed('clientName')
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
              <p>{data?.Name}</p>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>
                {data?.Type === "PF" ? "RG" : "IE"}
              </label>
              <p style={{ wordWrap: "anywhere" }}>
                {data?.Type === "PF" ? data?.Rg : data?.Ie}
              </p>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>
                {data?.Type === "PJ" ? "CNPJ" : "CPF"}
              </label>
              <p style={{ wordWrap: "anywhere" }}>
                {/* {(data.Cnpj || data.Cpf) &&
                  documentFormat(data.Cnpj || data.Cpf)} */}
                {data?.Type === "PF"
                  ? data?.Cpf && documentFormat(data?.Cpf)
                  : data?.Cnpj && documentFormat(data?.Cnpj)}
              </p>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>DATA NASCIMENTO</label>
              <p>
                {data?.Birthday && moment(data?.Birthday).format("DD/MM/YYYY")}
              </p>
            </div>
          </div>
          <div className="header_content">
            <div>
              <label style={{ fontWeight: "bold" }}>TELEFONE</label>
              <p style={{ wordWrap: "anywhere" }}>
                {data?.Mobile && phoneFormat(data?.Mobile)}
              </p>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>WHATSAPP</label>
              <p>{data?.Whatsapp && phoneFormat(data?.Whatsapp)}</p>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>EMAIL</label>
              <p style={{ wordWrap: "anywhere" }}>{data?.Email}</p>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>EMAIL SECUNDÁRIO</label>
              <p>{data?.SecondEmail}</p>
            </div>
          </div>
          <br />
          <div>
            <p style={{ fontWeight: "bold" }}>ENDEREÇO</p>
          </div>
          <div className="header_content">
            <div>
              <label style={{ fontWeight: "bold" }}>LOGRADOURO</label>
              <p>{data?.StreetName}</p>
            </div>

            <div>
              <label style={{ fontWeight: "bold" }}>NÚMERO</label>
              <p>{data?.Number}</p>
            </div>

            <div>
              <label style={{ fontWeight: "bold" }}>BAIRRO</label>
              <p>{data?.District}</p>
            </div>

            <div>
              <label style={{ fontWeight: "bold" }}>CIDADE</label>
              <p>{data?.City}</p>
            </div>
          </div>
          <div className="header_content">
            <div>
              <label style={{ fontWeight: "bold" }}>CEP</label>
              <p>{data?.PostalCode}</p>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>UF</label>
              <p>{data?.State}</p>
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>COMPLEMENTO</label>
              <p>{data?.Complement}</p>
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
            <CardData
              style={{
                margin: "auto",
                boxShadow: window.innerWidth < 768 && "none",
                padding: window.innerWidth < 768 && 0,
              }}
            >
              <h5>DADOS</h5>
              <div>
                <h5>Nome completo</h5>
                <InputData
                  id="clientName"
                  type="text"
                  placeholder="Nome *"
                  style={{ width: "100%" }}
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: window.innerWidth < 768 && "column",
                  gap: window.innerWidth < 768 ? 5 : 10,
                  marginTop: 10,
                }}
              >
                {data?.Type === "PJ" ? (
                  <div style={{ width: "100%" }}>
                    <h5>CNPJ</h5>
                    <InputData
                      style={{ width: "100%" }}
                      id="clientCNPJ"
                      type="text"
                      placeholder="CNPJ *"
                      className="input_3"
                      value={user.cnpj}
                      onChange={(e) =>
                        setUser({ ...user, cnpj: cnpjFormat(e) })
                      }
                    />
                  </div>
                ) : (
                  <div style={{ width: "100%" }}>
                    <h5>CPF</h5>
                    <InputData
                      style={{ width: "100%" }}
                      id="clientCPF"
                      type="text"
                      placeholder="CPF *"
                      className="input_3"
                      value={user.cpf}
                      onChange={(e) => setUser({ ...user, cpf: cpfFormat(e) })}
                    />
                  </div>
                )}
                {data?.Type === "PJ" ? (
                  <div style={{ width: "100%" }}>
                    <h5>IE</h5>
                    <InputData
                      style={{ width: "100%" }}
                      id="clientIE"
                      type="number"
                      placeholder="IE *"
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
                      id="clientRG"
                      type="text"
                      placeholder="RG *"
                      className="input_3"
                      value={user.rg}
                      onChange={(e) => setUser({ ...user, rg: e.target.value })}
                    />
                  </div>
                )}
                <div className="input_3" style={{ width: "100%" }}>
                  <h5>{data?.Cnpj ? "DATA FUNDAÇÃO" : "DATA NASCIMENTO"}</h5>
                  <DatePicker
                    underlineStyle={{ display: "none" }}
                    size={"small"}
                    // label={data?.Cnpj ? "DATA FUNDAÇÃO" : "DATA NASCIMENTO"}
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
                    value={user.date}
                    onChange={(e) => {
                      // console.log(e);
                      setUser({ ...user, date: e });
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: window.innerWidth < 768 && "column",
                  gap: window.innerWidth < 768 ? 5 : 10,
                  marginTop: 10,
                }}
              >
                <div style={{ width: "100%" }}>
                  <h5>E-mail</h5>
                  <InputData
                    style={{ width: "100%" }}
                    id="clientEmail"
                    type="text"
                    placeholder="E-mail *"
                    className="input_2"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <h5>Email secundário</h5>
                  <InputData
                    style={{ width: "100%" }}
                    id="clientSecondEmail"
                    type="text"
                    placeholder="E-mail secundário"
                    className="input_2"
                    value={user.secondEmail}
                    onChange={(e) =>
                      setUser({ ...user, secondEmail: e.target.value })
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: window.innerWidth < 768 && "column",
                  gap: window.innerWidth < 768 ? 5 : 10,
                  marginTop: 10,
                }}
              >
                <div style={{ width: "100%" }}>
                  <h5>Telefone</h5>
                  <InputData
                    style={{ width: "100%" }}
                    id="clientPhone"
                    placeholder="Telefone *"
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
                  <h5>Whatsapp</h5>
                  <InputData
                    style={{ width: "100%" }}
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
                  />
                </div>
              </div>
            </CardData>
            <CardData
              style={{
                margin: "auto",
                boxShadow: window.innerWidth < 768 && "none",
                padding: window.innerWidth < 768 && 0,
                marginTop: window.innerWidth < 768 && "1rem",
              }}
            >
              <h5>ENDEREÇO</h5>
              <div
                style={{
                  display: "flex",
                  flexDirection: window.innerWidth < 768 && "column",
                  gap: window.innerWidth < 768 ? 5 : 10,
                  marginTop: 10,
                }}
              >
                <div style={{ width: "100%" }}>
                  <h5>CEP</h5>
                  <InputData
                    style={{ width: "100%" }}
                    ref={cepInput}
                    type="text"
                    id="cep"
                    name="cep"
                    placeholder="CEP*"
                    value={user.cep}
                    onChange={handleCep}
                    className="input_20"
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <h5>ENDEREÇO</h5>
                  <InputData
                    style={{ width: "100%" }}
                    type="text"
                    id="address"
                    placeholder="ENDEREÇO*"
                    value={user.address}
                    onChange={(e) =>
                      setUser({ ...user, address: e.target.value })
                    }
                    className="input_80"
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: window.innerWidth < 768 && "column",
                  gap: window.innerWidth < 768 ? 5 : 10,
                  marginTop: 10,
                }}
              >
                <div style={{ width: "100%" }}>
                  <h5>COMPLEMENTO</h5>
                  <InputData
                    style={{ width: "100%" }}
                    type="text"
                    placeholder="COMPLEMENTO"
                    value={user.complement}
                    onChange={(e) =>
                      setUser({ ...user, complement: e.target.value })
                    }
                    className="input_80"
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <h5>NÚMERO</h5>
                  <InputData
                    style={{ width: "100%" }}
                    type="number"
                    id="number"
                    placeholder="NÚMERO*"
                    className="input_20"
                    value={user.number}
                    onChange={(e) =>
                      setUser({ ...user, number: e.target.value })
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: window.innerWidth < 768 && "column",
                  gap: window.innerWidth < 768 ? 5 : 10,
                  marginTop: 10,
                }}
              >
                <div style={{ width: "100%" }}>
                  <h5>BAIRRO</h5>
                  <InputData
                    style={{ width: "100%" }}
                    type="text"
                    id="district"
                    placeholder="BAIRRO*"
                    value={user.district}
                    onChange={(e) =>
                      setUser({ ...user, district: e.target.value })
                    }
                    className="input_3"
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <h5>CIDADE</h5>
                  <InputData
                    style={{ width: "100%" }}
                    type="text"
                    id="city"
                    placeholder="CIDADE*"
                    value={user.city}
                    onChange={(e) => setUser({ ...user, city: e.target.value })}
                    className="input_3"
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <h5>UF</h5>
                  <SelectUfs
                    style={{ width: "100%" }}
                    name="UF"
                    id="uf"
                    placeholder="UF*"
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
          <Button notHover onClick={updateData}>
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

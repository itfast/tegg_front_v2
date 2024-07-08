import { useLocation, useNavigate } from "react-router-dom";
import { Button, PageLayout } from "../../../../globalStyles";
import { useEffect, useState } from "react";
import {
  cleanNumber,
  documentFormat,
  formatPhone,
  phoneFormat,
  translateError,
  translateStatus,
} from "../../../services/util";
import api from "../../../services/api";
import { IoWarningOutline } from "react-icons/io5";
import Select from "react-select";
import { InputData } from "../../resales/Resales.styles";
import { Loading } from "../../../components/loading/Loading";
import { toast } from "react-toastify";

export const PorInAction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [portRequests, setPortRequests] = useState();
  const [line, setLine] = useState();
  const [name, setName] = useState();
  const [cpf, setCpf] = useState();
  const [oldNumber, setOldNumber] = useState();
  const [operator, setOperator] = useState();
  const [loading, setLoading] = useState(false);

  const getRequests = () => {
    // setLoading(true);
    const myNumber = location.state.line?.IccidHistoric[0].SurfMsisdn?.substring(2, location.state.line?.IccidHistoric[0].SurfMsisdn?.length)
    console.log(1, 10, myNumber)
    api.line
      .getPortRequests(1, 10, 55+myNumber)
      .then((res) => {
        console.log(res)
        setPortRequests(res.data.portRequests);
        // setMaxPages(res.data.meta.totalPages || 1);
      })
      .catch((err) => {
        console.log(err);
        // translateError(err);
      });
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  useEffect(() => {
    console.log(location.state.line)
    if (location.state.line) {
      const { line } = location.state;
      setName(line?.FinalClient?.Name);
      setCpf(
        line?.FinalClient?.Cpf
          ? documentFormat(line?.FinalClient?.Cpf)
          : documentFormat(line?.FinalClient?.Cnpj)
      );
      setLine(line);
      setNumber(formatPhone(line?.IccidHistoric[0].SurfMsisdn));
      getRequests();
    }
  }, []);

  const createPortRequest = (window) => {
    api.line
      .createPortRequest(
        api.currentUser.DealerId,
        api.currentUser.MyFinalClientId,
        "PENDING",
        window,
        0,
        cleanNumber(oldNumber),
        line?.IccidHistoric[0]?.SurfMsisdn,
        operator.value,
        line?.FinalClient?.Cpf
        ? cleanNumber(line?.FinalClient?.Cpf)
        : cleanNumber(line?.FinalClient?.Cnpj)
      )
      .then((res) => {
        toast.success(res.data.Message);
        navigate("/actions");
      })
      .catch((err) => {
        console.log(err);
        translateError(err);
      })
      .finally(()=>{
        setLoading(false)
      })
  };

  useEffect(()=>{
    console.log(oldNumber)
  },[oldNumber])

  const handleNext = () => {
    if (name) {
      if (cpf) {
        if (oldNumber) {
          if (operator) {
            setLoading(true);
            api.line
              .portIn(
                Number(cleanNumber(line?.IccidHistoric[0]?.SurfMsisdn)),
                Number(cleanNumber(oldNumber)),
                operator.value,
                line?.FinalClient?.Cpf
                ? cleanNumber(line?.FinalClient?.Cpf)
                : cleanNumber(line?.FinalClient?.Cnpj),
                line?.FinalClient?.Name
              )
              .then(() => {
                // toast.success(res.data.Message);
                createPortRequest(
                  'res.data.Data.properties.janelaPortabilidade.slice(0, 10)'
                );
              })
              .catch((err) => {
                console.log(err);
                translateError(err);
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            toast.error("Operadora antiga deve ser informada");
          }
        } else {
          toast.error("Número a ser portado deve ser informado");
        }
      } else {
        toast.error("Documento deve ser informado");
      }
    } else {
      toast.error("Nome completo deve ser informado");
    }
  };

  return (
    <PageLayout>
      <Loading open={loading} msg={"Solicitando portabilidade..."} />
      <Button
        style={{ marginBottom: "1rem" }}
        onClick={() => navigate("/actions")}
      >
        Voltar
      </Button>
      <h4>Portabilidade</h4>
      <h4>Verifique o status ou realize um pedido de portabilidade</h4>
      <div style={{ maxWidth: 800, margin: "auto" }}>
        <div
          style={{
            width: "100%",
            marginTop: "1rem",
          }}
        >
          <h4 style={{ backgroundColor: "yellow" }}>
            {" "}
            <IoWarningOutline size={20} /> Status da portabilidade:{" "}
            {!portRequests || portRequests.length === 0
              ? "Não solicitada"
              : translateStatus(`PORTIN_${portRequests[0]?.Status}`)}
          </h4>
          <h4>Número atual: {number}</h4>
        </div>

        {(!portRequests || portRequests.length === 0) && (
          <>
            <div>
              <div
                style={{
                  display: window.innerWidth > 768 && "flex",
                  alignItems: "center",
                }}
              >
                <h5 style={{ marginRight: "0.2rem" }}>NOME COMPLETO</h5>
              </div>

              <div>
                <InputData
                  id="name"
                  type="text"
                  placeholder="Nome completo"
                  style={{ width: "100%" }}
                  // className="input_2"
                  // defaultValue={1}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  display: window.innerWidth > 768 && "flex",
                  alignItems: "center",
                }}
              >
                <h5 style={{ marginRight: "0.2rem" }}>CPF/CNPJ</h5>
              </div>

              <div>
                <InputData
                  id="document"
                  type="text"
                  placeholder="CPF/CNPJ"
                  style={{ width: "100%" }}
                  // className="input_2"
                  // defaultValue={1}
                  value={cpf}
                  onChange={(e) => setCpf(documentFormat(e.target.value))}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  // display: window.innerWidth > 768 && 'flex',
                  alignItems: "center",
                }}
              >
                <h5 style={{ marginRight: "0.2rem" }}>NÚMERO A SER PORTADO</h5>
              </div>
              <div>
                <InputData
                  id="phone"
                  placeholder="Número a ser portado"
                  style={{ width: "100%" }}
                  // className="input_2"
                  // defaultValue={1}
                  value={oldNumber}
                  onChange={(e) => setOldNumber(phoneFormat(e.target.value))}
                />
              </div>
            </div>
            <div
              style={{
                // display: window.innerWidth < 768 && 'flex',
                alignItems: "center",
              }}
            >
              <h5 style={{ marginRight: "0.2rem" }}>OPERADORA ANTIGA</h5>
              <div>
                <Select
                  options={[
                    { label: "Algar", value: "ALGAR" },
                    { label: "Claro", value: "CLARO" },
                    { label: "Oi", value: "OI" },
                    { label: "Sercomtel", value: "SERCOMTEL" },
                    { label: "Tim", value: "TIM" },
                    { label: "Vivo", value: "VIVO" },
                  ]}
                  // isMulti
                  isSearchable={false}
                  placeholder="Selecione..."
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPlacement="top"
                  value={operator}
                  onChange={setOperator}
                />
              </div>
            </div>
            <div
              style={{
                width: "100%",
                marginTop: "1rem",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Button onClick={handleNext}>Solicitar</Button>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

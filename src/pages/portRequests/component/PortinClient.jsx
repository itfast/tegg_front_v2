/* eslint-disable react/prop-types */
import api from "../../../services/api";
import Select from "react-select";
// import { InputData } from "../../resales/Resales.styles";

import { InputData } from "../../resales/Resales.styles";
import { useEffect } from "react";
import { documentFormat, phoneFormat } from "../../../services/util";
import { TypeContainer } from "../../orders/clientNew/NewOrder.styles";

export const PortInClient = ({
  setName,
  setCpf,
  setOldNumber,
  oldNumber,
  operator,
  setOperator,
  isEsim,
  setEsim,
}) => {
  useEffect(() => {
    if (api.currentUser) {
      console.log(api.currentUser);
      setName(api.currentUser?.Name);
      setCpf(documentFormat(api.currentUser.MyDocument));
    }
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <>
        <div>
          <h5 style={{ marginRight: "0.2rem" }}>PORTAR PARA</h5>
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TypeContainer
            style={{width: '6rem'}}
              selected={isEsim}
              onClick={() => {setEsim(true)}}
            >
              <h5>e-Sim</h5>
            </TypeContainer>
            <TypeContainer
            style={{width: '6rem'}}
              selected={!isEsim}
              onClick={() => {setEsim(false)}}
            >
              <h5>SimCard</h5>
            </TypeContainer>
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
        {/* <div
            style={{
              width: "100%",
              marginTop: "1rem",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button onClick={handleNext}>Solicitar</Button>
          </div> */}
      </>
    </div>
  );
};

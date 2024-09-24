import React, { useState } from "react";
import {
  ContainerBodyLogin,
  ContainerFormLogin,
  ContainerImageLogin,
  ContainerImageText,
  ContainerLogin,
  FormLogin,
  InputLogin,
  InputPassSignUp,
} from "../login/Login.styles";
import { Button, ContainerMobile, ContainerWeb } from "../../../globalStyles";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FaRegCreditCard, FaInfoCircle } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { RiBillFill, RiLogoutBoxLine } from "react-icons/ri";

interface HeaderBarProps {
  isTop?: boolean;
  isBottom?: boolean;
}
// Styled Components for reusability
export const InfoBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 300px;
  max-height: 300px;
  margin-bottom: 15px;
`;

export const MainInfo = styled.div`
  display: flex;
  justify-content: left;
  flex-direction: column
  padding: 10px;
  align-items: left;
  gap: 10px;
`;

export const BillInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  padding: 10px;
  gap: 15px;
`;

export const HeaderBar = styled.div<HeaderBarProps>`
  height: 70px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #2b2b2b;
  text-align: left;
  position: fixed;
  top: ${({ isTop }) => (isTop ? "0" : "auto")};
  bottom: ${({ isBottom }) => (isBottom ? "0" : "auto")};
  z-index: 1000;
`;

export const NavButton = styled(Button)`
  display: flex;
  width: 11rem;
  height: 3rem;
  justify-content: left;
  align-items: center;
  gap: 10px;
`;

export const EasyLoginInfo = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goExit = () => {
    api.user.logout();
    navigate("/easylogin");
  };

  return (
    <>
      <ContainerWeb>
        <div
          style={{
            height: "100vh",
            width: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#2B2B2B",
          }}
        >
          <img
            src={"/assets/tegg-branco.png"}
            alt="Logo Tegg"
            style={{ width: "200px", padding: "1rem", marginTop: "1.5rem" }}
          />
          <div style={{
            marginTop:"30rem",
            marginLeft:"7rem"
          }}>
            <Button
              style={{
                backgroundColor: "transparent",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
              onClick={goExit}
            >
              <RiLogoutBoxLine style={{ fontSize: "20px" }} />
              {t("Menu.exit")}
            </Button>
          </div>
        </div>
        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            paddingLeft: "2rem",
            paddingTop: "2rem",

            gap: "10px",
          }}
        >
          <div>
            <h3>Olá,</h3>
            <h2 style={{ fontWeight: "bold" }}>'nome'!</h2>
            <br />
            <h3>Faturas pendentes:</h3>
          </div>

          <InfoBox>
            <MainInfo>
              <BillInfo>
                <h3 style={{ fontWeight: "bold" }}>R$100,00</h3>
                {/*valor*/}
                <h4>Vencida</h4>
                {/*status*/}
                <h4>23/09/2024</h4>
                {/*data vencimento*/}
              </BillInfo>

              <div
                style={{
                  width: "50%",
                  padding: "1rem",
                }}
              >
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    backgroundColor: "red",
                  }}
                ></div>
              </div>
            </MainInfo>
            <Button
              style={{
                width: "100%",
                height: "1rem",
                padding: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaRegCreditCard style={{ fontSize: "20px" }} />
              <h4>Pagar no cartão</h4>
            </Button>
          </InfoBox>

          <h3>Seu plano:</h3>

          <InfoBox>
            <MainInfo style={{ flexDirection: "row" }}>
              <div
                style={{
                  width: "100%",
                  wordWrap: "break-word",
                  gap: "10px",
                }}
              >
                <h3>NomeDoPlanoNomeDoPlanoNomeDoPlano</h3>
                <div style={{ paddingTop: "4px" }}>
                  <h4 style={{ fontWeight: "bold" }}>Pagamento:</h4>
                  <h5>MasterCard final 0000</h5>
                  <h5>*Próxima cobrança em 30/10/2024.*</h5>
                  {/*cartao de pagamento do usuario*/}
                </div>
              </div>
            </MainInfo>
            <Button
              style={{
                width: "100%",
                height: "1rem",
                padding: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaInfoCircle style={{ fontSize: "15px" }} />
              <h4>Detalhes do plano</h4>
            </Button>
          </InfoBox>
        </div>
        <div style={{ padding: "3rem", marginRight: "80px" }}></div>
      </ContainerWeb>

      <ContainerMobile>
        <HeaderBar
          isTop
          style={{ justifyContent: "left", paddingLeft: "1rem" }}
        >
          <img
            src={"/assets/tegg-branco.png"}
            alt="Logo Tegg"
            style={{ width: "120px", padding: "1rem" }}
          />
          <div style={{ paddingLeft: "8rem" }}>
            <Button
              style={{
                backgroundColor: "transparent",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
              onClick={goExit}
            >
              <RiLogoutBoxLine style={{ fontSize: "20px" }} />
              {t("Menu.exit")}
            </Button>
          </div>
        </HeaderBar>

        <div
          style={{
            flexGrow: 1,
            backgroundColor: "#FFFFFF",
            paddingTop: "5rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          }}
        >
          <h3>Olá,</h3>
          <h2 style={{ fontWeight: "bold" }}>'nome'!</h2>
          <br />
          <h3>Faturas pendentes:</h3>
          <br />
          <div
            style={{
              alignItems: "center",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <InfoBox>
              <MainInfo>
                <BillInfo>
                  <h3 style={{ fontWeight: "bold" }}>R$100,00</h3>
                  {/*valor*/}
                  <h4>Vencida</h4>
                  {/*status*/}
                  <h4>23/09/2024</h4>
                  {/*data vencimento*/}
                </BillInfo>

                <div
                  style={{
                    width: "50%",
                    padding: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "90px",
                      height: "90px",
                      backgroundColor: "red",
                    }}
                  ></div>
                </div>
              </MainInfo>
              <Button
                style={{
                  width: "100%",
                  height: "1rem",
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaRegCreditCard style={{ fontSize: "20px" }} />
                <h4>Pagar no cartão</h4>
              </Button>
            </InfoBox>
          </div>

          <br />
          <h3>Seu plano:</h3>
          <br />
          <div
            style={{
              alignItems: "center",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <InfoBox>
              <MainInfo style={{ flexDirection: "row" }}>
                <div
                  style={{
                    width: "100%",
                    wordWrap: "break-word",
                    gap: "10px",
                  }}
                >
                  <h3>
                    NomeDoPlanoNomeDoPlanoNomeDoPlanoNomeDoPlanoNomeDoPlano
                  </h3>
                  <div style={{ paddingTop: "4px" }}>
                    <h4 style={{ fontWeight: "bold" }}>Pagamento:</h4>
                    <h5>MasterCard final 0000</h5>
                    <h5>*Próxima cobrança em 30/10/2024.*</h5>
                    {/*cartao de pagamento do usuario*/}
                  </div>
                </div>
              </MainInfo>
              <Button
                style={{
                  width: "100%",
                  height: "1rem",
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaInfoCircle style={{ fontSize: "15px" }} />
                <h4>Detalhes do plano</h4>
              </Button>
            </InfoBox>
          </div>
        </div>
        <HeaderBar isBottom />
      </ContainerMobile>
    </>
  );
};

import React, { useEffect, useState } from "react";
import { Button, ContainerMobile, ContainerWeb } from "../../../globalStyles";
import api from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FaRegCreditCard } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import { translateStatus, translateValue } from "../../services/util";
import moment from "moment";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const goExit = () => {
    api.user.logout();
    navigate("/minhasfaturas");
  };

  useEffect(() => {
    if(!location?.state?.clientName){
      navigate("/minhasfaturas");
    }
  }, []);
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
          <div
            style={{
              marginTop: "30rem",
              marginLeft: "7rem",
            }}
          >
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
            <h2 style={{ fontWeight: "bold" }}>{location?.state?.clientName}!</h2>
            <br />
            <h3>Faturas pendentes:</h3>
          </div>

          {location?.state?.invoices.lenght === 0 ? (
              <InfoBox>
                <h3 style={{ textAlign: "center" }}>
                  Você não possuí faturas pendentes
                </h3>
              </InfoBox>
            ) : (
              <div style={{display: 'flex', gap: 20, width: '100%', flexWrap: 'wrap'}}>
              {location?.state?.invoices.map((i) => (
                <InfoBox key={i.Id}>
                  <MainInfo>
                    <BillInfo style={{width: '100%', textAlign: 'center'}}>
                      <h3 style={{ fontWeight: "bold" }}>{translateValue(i.Amount)}</h3>
                      <h4>{translateStatus(i.Status)}</h4>
                      <h4>{i.DueDate && moment(i.DueDate).format('DD/MM/YYYY')}</h4>
                    </BillInfo>
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
                    onClick={() => window.open(i.InvoiceUrl, '_black') }
                  >
                    <FaRegCreditCard style={{ fontSize: "20px" }} />
                    <h4>Pagar</h4>
                  </Button>
                </InfoBox>
              ))}
              </div>
            )}
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
          <h3 style={{ fontWeight: "bold" }}>{location?.state?.clientName}!</h3>
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
            {location?.state?.invoices.lenght === 0 ? (
              <InfoBox>
                <h3 style={{ textAlign: "center" }}>
                  Você não possuí faturas pendentes
                </h3>
              </InfoBox>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column'}}>
              {location?.state?.invoices.map((i) => (
                <InfoBox key={i.Id}>
                  <MainInfo>
                    <BillInfo style={{width: '100%', textAlign: 'center'}}>
                      <h3 style={{ fontWeight: "bold" }}>{translateValue(i.Amount)}</h3>
                      <h4>{translateStatus(i.Status)}</h4>
                      <h4>{i.DueDate && moment(i.DueDate).format('DD/MM/YYYY')}</h4>
                    </BillInfo>
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
                    onClick={() => window.open(i.InvoiceUrl, '_black') }
                  >
                    <FaRegCreditCard style={{ fontSize: "20px" }} />
                    <h4>Pagar</h4>
                  </Button>
                </InfoBox>
              ))}
              </div>
            )}
          </div>
        </div>
        <HeaderBar isBottom />
      </ContainerMobile>
    </>
  );
};

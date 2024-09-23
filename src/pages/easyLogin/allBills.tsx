import React, { useEffect, useState } from "react";
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
import ReactLoading from "react-loading";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
import { Button, ContainerMobile, ContainerWeb } from "../../../globalStyles";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { translateError } from "../../services/util";
import { toast } from "react-toastify";
import { NewClientExtern } from "../clients/new/NewClientExtern";
import ReactCardFlip from "react-card-flip";
// import { Avatar, Menu, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Loading } from "../../components/loading/Loading";
import { he } from "date-fns/locale";
import { LayoutContainer } from "../../components/layouts/AdminStyles";
// import { Menu } from './Menus/Index';
import { SideBar } from "../../components/layouts/SideBar/Index";
import { Header } from "../../components/layouts/Headers";
import { SidebarContainer } from "../../components/layouts/SideBar/styles";
import styled from "styled-components";
import { FaRegCreditCard } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { RiBillFill } from "react-icons/ri";
import {
  InfoBox,
  HeaderBar,
  MainInfo,
  NavButton,
  BillInfo,
} from "./easyLoginInfo";
import { RiLogoutBoxLine } from "react-icons/ri";

export const AllBills = () => {
  const [open, setOpen] = useState(false);
  const [has, setHas] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const goExit = () => {
    api.user.logout();
    navigate("/login");
  };

  return (
    <>
      <Loading open={loading} msg="Buscando faturas..." />
      <ContainerWeb>
        {/* Sidebar Section */}
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
          <br />
          <NavButton onClick={() => navigate("/easylogininfo")}>
            <FaHouse style={{ fontSize: "20px" }} />
            Início
          </NavButton>
          <br />
          <NavButton>
            <RiBillFill style={{ fontSize: "20px" }} />
            Todas as faturas
          </NavButton>
        </div>

        {/* Main Content Section */}
        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "3rem",
            gap: "30px",
          }}
        >
          <h2 style={{ fontWeight: "bold" }}>Todas as faturas </h2>
          <h3>Faturas em aberto:</h3>

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
              <h4>Botão pagar fatura</h4>
            </Button>
          </InfoBox>

          <h3>Faturas pagas:</h3>

          <InfoBox>
            <MainInfo>
              <BillInfo>
                <h3 style={{ fontWeight: "bold" }}>R$200,00</h3>
                {/*valor*/}
                <h4>Paga em:</h4>
                {/*status*/}
                <h4>22/09/2024</h4>
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
              <h4>Botão pagar fatura</h4>
            </Button>
          </InfoBox>
        </div>

        {/* Footer Section */}
        <div style={{ padding: "3rem", marginRight: "80px" }}>
          <Button
            style={{
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
      </ContainerWeb>

      <ContainerMobile>
        {/* Header for Mobile */}
        <HeaderBar
          isTop
          style={{ justifyContent: "left", paddingLeft: "1rem" }}
        >
          <img
            src={"/assets/tegg-branco.png"}
            alt="Logo Tegg"
            style={{ width: "120px", padding: "1rem" }}
          />
        </HeaderBar>

        {/* Main Content for Mobile */}
        <div
          style={{
            flexGrow: 1,
            backgroundColor: "#FFFFFF",
            paddingTop: "5rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          }}
        >
          <h2 style={{ fontWeight: "bold" }}>Todas as faturas</h2>
          <br />
          <h3>Faturas em aberto:</h3>
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
                <h4>Botão pagar fatura</h4>
              </Button>
            </InfoBox>
          </div>
          <br />
          <h3>Faturas pagas:</h3>
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
                  <h3 style={{ fontWeight: "bold" }}>R$200,00</h3>
                  {/*valor*/}
                  <h4>Paga em:</h4>
                  {/*status*/}
                  <h4>22/09/2024</h4>
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
                <h4>Botão pagar fatura</h4>
              </Button>
            </InfoBox>
          </div>
        </div>

        {/* Footer for Mobile */}
        <HeaderBar isBottom>
          <NavButton
            style={{ width: "40%" }}
            onClick={() => navigate("/easylogininfo")}
          >
            <FaHouse style={{ fontSize: "20px" }} />
            Início
          </NavButton>
          <div style={{ marginLeft: "2rem" }}>
            {" "}
            {/* Espaço entre logo e formulário */}
          </div>
          <NavButton style={{ width: "40%" }}>
            <RiBillFill style={{ fontSize: "20px" }} />
            Todas as faturas
          </NavButton>
        </HeaderBar>
      </ContainerMobile>
    </>
  );
};

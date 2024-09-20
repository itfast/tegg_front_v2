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
import { InfoBox } from "./easyLoginInfo";
import { RiLogoutBoxLine } from "react-icons/ri";

export const AllBills = () => {
  const [open, setOpen] = useState(false);
  const [has, setHas] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const load = (() => {
    setLoading(false)
  })

  useEffect(() => {
    load()
  }, []);

  const goExit = () => {
    api.user.logout();
    navigate("/login");
  };

  return (
    <>
      <Loading open={loading} msg="Buscando faturas..." />
      <ContainerWeb>
        <div
          style={{
            height: "100vh",
            width: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "center",
            backgroundColor: "#2B2B2B",
          }}
        >
          <img
            src={"/assets/tegg-branco.png"}
            alt="Logo Tegg"
            style={{
              width: "200px",
              padding: "1rem",
              marginTop: "1.5rem",
            }}
          />
          <br />
          <Button
            style={{
              display: "flex",
              width: "11rem",
              height: "3rem",
              justifyContent: "left",
              alignItems: "center",
              gap: "10px",
            }}
            onClick={() => navigate("/easylogininfo")}
          >
            <FaHouse style={{ fontSize: "20px" }} />
            Início
          </Button>
          <br />
          <Button
            style={{
              display: "flex",
              width: "11rem",
              height: "3rem",
              justifyContent: "left",
              alignItems: "center",
              gap: "10px",
            }}
            onClick={() => navigate("/allbills")}
          >
            <RiBillFill style={{ fontSize: "20px" }} />
            Todas as faturas
          </Button>
        </div>

        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "left",
            padding: "3rem",
            gap: "30px",
          }}
        >
          <h2>
            <b style={{ fontWeight: "bold" }}>Todas as faturas</b>
          </h2>
          <h3>Faturas em aberto:</h3>

          <InfoBox>
            <h3>Fatura1</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
                backgroundColor: "blue",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <h2>oi</h2>
              <img
                src={"/assets/tegg-branco.png"}
                alt="Logo Tegg"
                style={{
                  width: "80px",
                  padding: "1rem",
                }}
              />
            </div>
            <Button
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaRegCreditCard
                style={{
                  fontSize: "20px",
                }}
              />
              <h4>Botão pagar fatura</h4>
            </Button>
          </InfoBox>
          <h3>Faturas pagas:</h3>

          <InfoBox>
            <h3>Fatura2</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
                backgroundColor: "blue",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <h2>oi</h2>
              <img
                src={"/assets/tegg-branco.png"}
                alt="Logo Tegg"
                style={{
                  width: "80px",
                  padding: "1rem",
                }}
              />
            </div>
            <Button
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaRegCreditCard
                style={{
                  fontSize: "20px",
                }}
              />
              <h4>Botão pagar fatura</h4>
            </Button>
          </InfoBox>
        </div>
        <div
          style={{
            padding: "3rem",
            marginRight: "80px",
          }}
        >
          <Button
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <RiLogoutBoxLine
              style={{
                fontSize: "20px",
              }}
            />
            <a href="#" onClick={goExit}>
              {t("Menu.exit")}
            </a>{" "}
          </Button>
        </div>
      </ContainerWeb>
    </>
  );
};

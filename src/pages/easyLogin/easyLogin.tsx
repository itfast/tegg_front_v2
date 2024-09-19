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

export const EasyLogin = () => {
  const { t } = useTranslation();
  const [hovering, setHovering] = useState(false);
  const [typePass, setTypePass] = useState("password");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingR, setLoadingR] = useState(false);
  const [user, setUser] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [singUp, setSingUp] = useState(false);
  const [flipped, setFlipped] = useState(true);
  const [language, setLanguage] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <ContainerWeb>
        <ContainerBodyLogin
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: "100vh",
              width: "120vh",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Contêiner que engloba o logo e o formulário lado a lado */}
            <img
              src={"/assets/tegg-branco.png"}
              alt="Logo Tegg"
              style={{
                width: "300px", // Tamanho ajustado do logo
              }}
            />
            {/* Logo à esquerda */}
            <div style={{ marginRight: "2rem" }}>
              {" "}
              {/* Espaço entre logo e formulário */}
            </div>

            {/* Formulário de login à direita */}
            <ContainerFormLogin style={{ width: "100%" }}>
              <h1
                style={{
                  textAlign: "left",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                Consulta fácil
              </h1>

              <p>Insira seu CPF:</p>
              <InputLogin
                type="text"
                placeholder="CPF"
                style={{
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  width: "100%",
                }}
              />
              <button
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                }}
              >
                Entrar
              </button>
            </ContainerFormLogin>
          </div>
          <h4
            className="copyright-text"
            style={{
              // margin: 10,
              textAlign: "center",
              color: "white",
              marginBottom:"0.2rem"
            }}
          >
            Copyright © 2024 TEGG TECHNOLOGY LTDA – CNPJ: 45.435.783/0001-74 |{" "}
            {t("Rights")}
          </h4>
        </ContainerBodyLogin>
      </ContainerWeb>
    </>
  );
};

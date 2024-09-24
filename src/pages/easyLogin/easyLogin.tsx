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
import { translateError, validateDocument, documentFormat } from "../../services/util";
import { toast } from "react-toastify";
import { NewClientExtern } from "../clients/new/NewClientExtern";
import ReactCardFlip from "react-card-flip";
// import { Avatar, Menu, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Loading } from "../../components/loading/Loading";
import { he } from "date-fns/locale";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const schema = yup
  .object({
    CpfCnpj: yup
      .string()
      .required("CPF ou CNPJ deve ser informado.")
      .test("test-invalid-document", "Documento inválido.", (CpfCnpj) =>
        validateDocument(CpfCnpj || "")
      ),
  })
  .required();

export const EasyLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);
  const [typePass, setTypePass] = useState("password");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingR, setLoadingR] = useState(false);
  const [cpf, setCpf] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [step, setStep] = useState(0);
  const [singUp, setSingUp] = useState(false);
  const [flipped, setFlipped] = useState(true);
  const [language, setLanguage] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }, // Para acessar os erros de validação
  } = useForm({
    resolver: yupResolver(schema), // Resolver usando Yup
  });

  const handleLoginCpf = async (data) => {
    try {
      setLoading(true); // Ativa o estado de carregamento
      await api.user.loginByCpf(data.CpfCnpj); // Faz a chamada de API para login com CPF/CNPJ
      navigate("/easylogininfo"); // Redireciona para a próxima página em caso de sucesso
    } catch (err) {
      console.log(err); // Exibe o erro no console
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  const vDocument = watch("CpfCnpj");

  useEffect(() => {
    if (vDocument) {
      setValue("CpfCnpj", documentFormat(vDocument) || "");
    }
  }, [vDocument]);

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

              <p>Insira o CPF ou CNPJ:</p>
              <form onSubmit={handleSubmit(handleLoginCpf)}>
                <InputLogin
                  type="text"
                  id="CpfCnpj"
                  placeholder="CPF/CNPJ"
                  {...register("CpfCnpj")}
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  style={{
                    marginBottom: "1rem",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    width: "100%",
                    borderColor: errors.CpfCnpj ? "red" : "",
                  }}
                />
                {errors.CpfCnpj && (
                  <span style={{ color: "red", marginBottom: "1rem", display:"block", textAlign:"center" }}>
                    {errors.CpfCnpj.message}
                  </span>
                )}

                <Button
                  className="login_button"
                  type="submit"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  disabled={loading}
                >
                  {loading ? "Carregando..." : "Entrar"}
                </Button>
              </form>
            </ContainerFormLogin>
          </div>
          <h4
            className="copyright-text"
            style={{
              // margin: 10,
              textAlign: "center",
              color: "white",
              marginBottom: "0.2rem",
            }}
          >
            Copyright © 2024 TEGG TECHNOLOGY LTDA – CNPJ: 45.435.783/0001-74 |{" "}
            {t("Rights")}
          </h4>
        </ContainerBodyLogin>
      </ContainerWeb>
      <ContainerMobile>
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
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={"/assets/tegg-branco.png"}
              alt="Logo Tegg"
              style={{
                width: "150px", // Tamanho ajustado do logo
              }}
            />
            {/* Logo à esquerda */}
            <div style={{ marginTop: "2rem" }}>
              {" "}
              {/* Espaço entre logo e formulário */}
            </div>
            <ContainerFormLogin style={{ width: "30%", height: "30%" }}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                Consulta fácil
              </h3>

              <p>Insira o CPF ou CNPJ:</p>
              <InputLogin
                type="text"
                placeholder="CPF/CNPJ"
                style={{
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  width: "100%",
                }}
              />
              <Button
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={() => navigate("/easylogininfo")}
              >
                Entrar
              </Button>
            </ContainerFormLogin>
          </div>
          <h5
            className="copyright-text"
            style={{
              // margin: 10,
              textAlign: "center",
              color: "white",
              marginBottom: "0.2rem",
            }}
          >
            Copyright © 2024 TEGG TECHNOLOGY LTDA – CNPJ: 45.435.783/0001-74 |{" "}
            {t("Rights")}
          </h5>
        </ContainerBodyLogin>
      </ContainerMobile>
    </>
  );
};

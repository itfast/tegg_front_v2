import React, { useEffect, useState } from "react";
import {
  ContainerBodyLogin,
  ContainerFormLogin,
  InputLogin,
} from "../login/Login.styles";
import { Button, ContainerMobile, ContainerWeb } from "../../../globalStyles";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  translateError,
  validateDocument,
  documentFormatV2,
} from "../../services/util";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import styled from "styled-components";

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
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const clearCpfCnpj = (value) => {
    return value.replace(/\D/g, ""); // remove . / -
  };

  const handleLoginCpf = async (data) => {
    setLoading(true);
    api.user
      .loginByCpf(clearCpfCnpj(data.CpfCnpj))
      .then((res) => {
        console.log(res);
        navigate("/easylogininfo", {
          state: {
            clientName: res?.data.user[0].Name,
            invoices: res?.data.payments,
          },
        });
      })
      .catch((err) => translateError(err))
      .finally(() => setLoading(false));
  };

  const vDocument = watch("CpfCnpj");

  useEffect(() => {
    if (vDocument) {
      setValue("CpfCnpj", documentFormatV2(vDocument) || "");
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
            <img
              src={"/assets/tegg-branco.png"}
              alt="Logo Tegg"
              style={{
                width: "300px",
              }}
            />
            <div style={{ marginRight: "2rem" }}> </div>

            <ContainerFormLogin style={{ width: "100%" }}>
              <h2
                style={{
                  textAlign: "left",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                Consulta fácil
              </h2>

              <p>Insira o CPF ou CNPJ:</p>
              <form onSubmit={handleSubmit(handleLoginCpf)} style={{width: '80%'}}>
                <InputLogin
                  type="input"
                  id="CpfCnpj"
                  placeholder="CPF/CNPJ"
                  {...register("CpfCnpj")}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setValue("CpfCnpj", documentFormatV2(inputValue));
                  }}
                  style={{
                    marginBottom: "1rem",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    width: "100%",
                    borderColor: errors.CpfCnpj ? "red" : "",
                  }}
                />
                {errors.CpfCnpj && (
                  <span
                    style={{
                      color: "red",
                      marginBottom: "1rem",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    {errors.CpfCnpj.message}
                  </span>
                )}

                <Button
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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={"/assets/tegg-branco.png"}
            alt="Logo Tegg"
            style={{
              width: "150px",
            }}
          />
          <div style={{ marginTop: "2rem" }}> </div>
          <ContainerFormLogin
            style={{ width: "90%", height: "30%", borderRadius: "4px" }}
          >
            <h3
              style={{
                marginBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Consulta fácil
            </h3>

            <p>Insira o CPF ou CNPJ:</p>
            <form
              onSubmit={handleSubmit(handleLoginCpf)}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <InputLogin
                type="text"
                id="CpfCnpj"
                placeholder="CPF/CNPJ"
                {...register("CpfCnpj")}
                style={{
                  marginBottom: "1rem",
                  borderColor: errors.CpfCnpj ? "red" : "",
                }}
              />
              {errors.CpfCnpj && (
                <span
                  style={{
                    color: "red",
                    marginBottom: "0.2rem",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  {errors.CpfCnpj.message}
                </span>
              )}
              <Button
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  // gap: "10px",
                }}
                disabled={loading}
              >
                {loading ? "Carregando..." : "Entrar"}
              </Button>
            </form>
          </ContainerFormLogin>
          {/* </div> */}
          {/* <h5
            className="copyright-text"
            style={{
              textAlign: "center",
              color: "white",
              marginBottom: "0.2rem",
            }}
          >
            Copyright © 2024 TEGG TECHNOLOGY LTDA – CNPJ: 45.435.783/0001-74 |{" "}
            {t("Rights")}
          </h5> */}
        </ContainerBodyLogin>
      </ContainerMobile>
    </>
  );
};

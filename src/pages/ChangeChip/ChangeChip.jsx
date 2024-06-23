import { useEffect, useState } from "react";
import { Button, PageLayout } from "../../../globalStyles";
import { Loading } from "../../components/loading/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import { InputData } from "../resales/Resales.styles";
import {
    cleanNumber,
  documentFormat,
  iccidFormat,
  phoneFormat,
  translateError,
  validateDocument,
  validateIccid,
} from "../../services/util";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import { toast } from "react-toastify";

const schema = yup
  .object({
    name: yup.string().required("Nome deve ser informado"),
    phone: yup.string().required("Telefone deve ser informado"),
    oldIccid: yup.string().required("ICCID antigo deve ser informado"),
    newIccid: yup
      .string()
      .test("test-invalid-iccid", "Iccid inválido", (newIccid) =>
        validateIccid(newIccid)
      )
      .required("Novo ICCID deve ser informado"),
    cpf: yup
      .string()
      .test("test-invalid-cpf", "CPF inválido", (cpf) => validateDocument(cpf))
      .required("CPF deve ser informado"),
  })
  .required();

export const ChangeChip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // defaultValues: addressData,
    resolver: yupResolver(schema),
  });

  const vIccid = watch("newIccid");

  useEffect(() => {
    if (vIccid) {
      setValue("newIccid", iccidFormat(vIccid));
    }
  }, [vIccid]);

  useEffect(() => {
    if (location?.state) {
      setValue("name", location?.state?.client);
      setValue(
        "cpf",
        documentFormat(
          location?.state?.line?.FinalClient?.Cpf ||
            location?.state?.line?.FinalClient?.Cnpj
        )
      );
      setValue(
        "phone",
        phoneFormat(location?.state?.line?.IccidHistoric[0]?.SurfMsisdn)
      );
      setValue("oldIccid", location?.state?.line?.IccidHistoric[0]?.IccidId);
    }
  }, [location]);

  const onSubmit = (data) => {
    setLoading(true);
    api.iccid
      .changeChip(data.oldIccid, data.newIccid, cleanNumber(data.cpf))
      .then((res) => {
        toast.success(res.data?.Message)
        navigate('/actions')
      })
      .catch((err) => {
        translateError(err)
      })
      .finally(() => setLoading(false));
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
      <h4>Troca de chip</h4>
      <h4>Solicite uma troca de chip.</h4>
      <form
        style={{
          width: "100%",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div style={{ maxWidth: 800, margin: "auto" }}>
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
                {...register("name")}
                id="name"
                type="text"
                disabled
                placeholder="Nome completo"
                style={{ width: "100%" }}
              />
              <h5 style={{ color: "red" }}>{errors.name?.message}</h5>
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
                {...register("cpf")}
                type="text"
                disabled
                placeholder="CPF/CNPJ"
                style={{ width: "100%" }}
              />
              <h5 style={{ color: "red" }}>{errors.cpf?.message}</h5>
            </div>
          </div>
          <div>
            <div
              style={{
                alignItems: "center",
              }}
            >
              <h5 style={{ marginRight: "0.2rem" }}>NÚMERO DE TELEFONE</h5>
            </div>
            <div>
              <InputData
                id="phone"
                placeholder="Número a ser portado"
                {...register("phone")}
                disabled
                style={{ width: "100%" }}
              />
              <h5 style={{ color: "red" }}>{errors.phone?.message}</h5>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: "100%" }}>
              <div
                style={{
                  alignItems: "center",
                }}
              >
                <h5 style={{ marginRight: "0.2rem" }}>ICCID ATUAL</h5>
              </div>
              <div>
                <InputData
                  {...register("oldIccid")}
                  id="oldIccid"
                  placeholder="ICCID atual"
                  disabled
                  style={{ width: "100%" }}
                />
                <h5 style={{ color: "red" }}>{errors.oldIccid?.message}</h5>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <div
                style={{
                  alignItems: "center",
                }}
              >
                <h5 style={{ marginRight: "0.2rem" }}>NOVO ICCID</h5>
              </div>
              <div>
                <InputData
                  id="newIccid"
                  {...register("newIccid")}
                  placeholder="Informe o novo ICCID"
                  style={{ width: "100%" }}
                />
                <h5 style={{ color: "red" }}>{errors.newIccid?.message}</h5>
              </div>
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
            <Button type="submit">Solicitar</Button>
          </div>
        </div>
      </form>
    </PageLayout>
  );
};

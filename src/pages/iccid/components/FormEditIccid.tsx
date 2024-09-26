import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
/*import {
  cepFormat,
  cleanNumber,
  colourStyles,
  documentFormat,
  getCEP,
  phoneFormat,
  translateError,
  UFS,
  validateNome,
  validateEmail,
  validateDocument,
  validateRgIe,
  validateTelefone,
  validateCep,
  validateEndereco,
  validateNumero,
} from "../../services/utils";*/
import { useForm, Controller } from "react-hook-form";
import { Input } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Loading } from "../../../components/loading/Loading";
import Select from "react-select";
import { toast } from "react-toastify";
import React from "react";

const schema = yup
  .object({
    Iccid: yup.string().optional(),
    Cliente: yup
      .object({
        value: yup.string().required(),
        label: yup.string().required(),
      })
      .required(),
    Vendedor: yup
      .object({
        value: yup.string().required(),
        label: yup.string().required(),
      })
      .required(),
    Tipo: yup
      .object({
        value: yup.string().required(),
        label: yup.string().required(),
      })
      .required("Tipo é obrigatório."),
    Lpa: yup.string().required(),
  })
  .required();

export type FormDataIccid = yup.InferType<typeof schema>;

interface FormEditIccidProps {
  btnSubmit: any;
  handleClose: () => void;
  edit?: boolean;
  iccid?: FormDataIccid;
}

interface clientOpt {
  value: string;
  label: string;
}

export const FormEditIccid = ({
  btnSubmit,
  handleClose,
  edit,
  iccid,
}: FormEditIccidProps) => {
  const [clientOpt, setClientOpt] = useState<Array<clientOpt>>([]);
  const [sellerOpt, setSellerOpt] = useState<Array<clientOpt>>([]);
  const [typeOpt, setTypeOpt] = useState<Array<clientOpt>>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    resetField,
    reset,
    formState: { errors },
  } = useForm<FormDataIccid>({
    defaultValues: iccid,
    resolver: yupResolver(schema),
  });

  const searchClients = () => {
    api.client
      .getAll({ pageNum: 1, pageSize: 100 })
      .then((res) => {
        const list: Array<clientOpt> = [];
        console.log("aaaaaaaaa", res.data.client);
        res.data?.client?.forEach((s: any) => {
          console.log(s);
          if (s?.Tipo_Usuario == "SOFTWAREHOUSE") {
            list.push({
              value: s.Id,
              label: s.Nome,
            });
          }
        });
        setClientOpt(list);
      })
      .catch((err) => {
        console.log(err); // editar para translateError dpss
      });
  };

  const iccidTypes = [
    { label: "SimCard", value: "SimCard" },
    { label: "e-Sim", value: "e-Sim" },
  ];

  const vType = watch("Tipo");

  useEffect(() => {
    if (iccid) {
      // Prepare the data to be in the correct format if necessary
      console.log(iccid)
      console.log(iccid.DealerId)
      reset({
        ...iccid,
        Cliente: { value: iccid?.FinalClientId || "", label: iccid?.FinalClientId || "" }, // assuming this is the format needed for the select
        Vendedor: { value: iccid?.Dealer?.Id, label: iccid.DealerId.Nome }, // format for vendedor
        Lpa: iccid.LPAUrl, // Pre-fill LPA field
      });
    }
  }, [iccid, reset]);

  const submit = (data: FormDataIccid) => {
    if (edit) {
      setMsg("Editando ICCID...");
      setLoading(true);
      /*api.iccid
        .edit({
          ...data,
          Cpf_Cnpj: cleanNumber(data.CpfCnpj),
          Rg_Ie: data.RgIe,
          Nome: data.Nome,
          Email_Principal: data.EmailPrincipal,
          Email_Secundario: data.EmailSecundario,
          Telefone: cleanNumber(data.Telefone),
          Cep: cleanNumber(data.Cep),
          Uf: data.Uf.value,
          Cidade: data.Cidade,
          Bairro: data.Bairro,
          Endereco: data.Endereco,
          Numero: data.Numero,
          Complemento: data.Complemento || "",
          UsuarioID: data.UsuarioId.value,
        })
        .then(() => {
          toast.success("Empresa editada com sucesso");
          if (searchSoftwareHouses) {
            searchSoftwareHouses();
          }
          handleClose();
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
        })
        .finally(() => setLoading(false));*/
      setLoading(false); //tirar este setLoading dps
    }
  };

  return (
    <>
      <Loading open={loading} msg={"Editando ICCID..."}></Loading>
      <div style={{ width: "500px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ width: "100%" }}>
            <h5>Cliente</h5>
            <Controller
              name="Cliente"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  menuPlacement="bottom"
                  isSearchable={false}
                  value={field.value}
                  placeholder=""
                  onChange={(e) => field.onChange(e)}
                  //options={iccidTypes}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              )}
            />
            {errors.Cliente && (
              <h5 style={{ color: "red" }}>{errors.Cliente.message}</h5>
            )}
          </div>

          <div style={{ width: "100%" }}>
            <h5>Vendedor</h5>
            <Controller
              name="Vendedor"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  menuPlacement="bottom"
                  isSearchable={false}
                  value={field.value}
                  placeholder=""
                  onChange={(e) => field.onChange(e)}
                  //options={iccidTypes}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              )}
            />{" "}
            {errors.Vendedor && (
              <h5 style={{ color: "red" }}>{errors.Vendedor.message}</h5>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "15px",
            gap: "15px",
          }}
        >
          <div style={{ width: "100%" }}>
            <h5>Tipo</h5>
            <Controller
              name="Tipo"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  menuPlacement="bottom"
                  isSearchable={false}
                  value={field.value}
                  placeholder=""
                  onChange={(e) => field.onChange(e)}
                  options={iccidTypes}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              )}
            />{" "}
            {errors.Tipo && (
              <h5 style={{ color: "red" }}>{errors.Tipo.message}</h5>
            )}
          </div>

          {vType?.value === "e-Sim" && (
            <div style={{ width: "100%" }}>
              <h5>LPA</h5>
              <Input style={{ width: "100%" }} {...register("Lpa")} />
              {errors.Lpa && (
                <h5 style={{ color: "red" }}>{errors.Lpa.message}</h5>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

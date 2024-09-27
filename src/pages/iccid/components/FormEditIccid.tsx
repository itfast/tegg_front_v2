/* eslint-disable react/prop-types */
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
import { Buyer } from "../../orders/new/Buyer";
import { AsyncPaginate } from "react-select-async-paginate";
import { useTranslation } from "react-i18next";

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
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [buyer, setBuyer] = useState();
  const [seller, setSeller] = useState();

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

  const iccidTypes = [
    { label: "SimCard", value: "SimCard" },
    { label: "e-Sim", value: "e-Sim" },
  ];

  const vType = watch("Tipo");

  useEffect(() => {
    console.log(iccid);
    if (iccid) {
      reset({
        ...iccid,
        Cliente: {
          value: iccid?.FinalClientId,
          label: iccid?.FinalClient?.Name,
        },
        Vendedor: { value: iccid?.DealerId, label: iccid?.Dealer?.Name },
        Tipo: {
          value: iccid?.LPAUrl ? "e-Sim" : "SimCard",
          label: iccid?.LPAUrl ? "e-Sim" : "SimCard",
        },
        Lpa: iccid?.LPAUrl,
      });

      setBuyer({
        value: iccid?.FinalClientId,
        label: iccid?.FinalClient?.Name,
      });
      
      setSeller({
        value: iccid?.DealerId,
        label: iccid?.Dealer?.Name,
      });
    }
  }, [iccid, reset]);

  const loadClients = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const list:any = [];
  
    const response = await api.client.getSome(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search
    );
  
    response?.data?.finalClients?.forEach((c) => {
      list.push({
        value: c.Id,
        label: c.Name,
        type: 'client',
      });
    });
  
    const hasMore = response?.data.meta.total > vlr && response?.data.meta.total > 10;
    return {
      options: list,
      hasMore,
    };
  };

  const loadDealers = async (search, prevOptions) => {
    const vlr = prevOptions.length;
  
    const response = await api.dealer.getSome(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search
    );
    console.log(response);
    const listD:any = [];
    response?.data?.dealers?.forEach((d) => {
      listD.push({
        value: d.Id,
        label: d.CompanyName || d.Name,
        type: 'dealer',
      });
    });
    const hasMoreD = response?.data.meta.total > vlr;
    return {
      options: listD,
      hasMoreD,
    };
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
                  <AsyncPaginate
                    placeholder={t("Order.new.buyer.placeHolder")}
                    noOptionsMessage={() => t("Order.new.buyer.notClients")}
                    value={buyer}
                    loadOptions={loadClients}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPosition={"fixed"}
                    onChange={(e) => {
                      setBuyer(e);
                    }}
                  />
              )}
            />{" "}
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
                <AsyncPaginate
                  placeholder={t("Order.new.buyer.placeHolder")}
                  noOptionsMessage={() => t("Order.new.buyer.notResales")}
                  value={seller}
                  loadOptions={loadDealers}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPosition={"fixed"}
                  onChange={(e) => {
                    setSeller(e);
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

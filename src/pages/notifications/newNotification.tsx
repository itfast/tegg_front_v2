import React, { useEffect, useState } from "react";
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from "../../../globalStyles";
import api from "../../services/api";
import { InputData, CardData } from "../resales/Resales.styles";
import { AsyncPaginate } from "react-select-async-paginate";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup
  .object({
    Clientes: yup
      .array(
        yup.object({
          value: yup.string().required(),
          label: yup.string().required(),
        })
      )
      .min(1, "Selecione ao menos uma opção")
      .required("Seleção obrigatória"),
    Vendedores: yup
      .array(
        yup.object({
          value: yup.string().required(),
          label: yup.string().required(),
        })
      )
      .min(1, "Selecione ao menos uma opção")
      .required("Seleção obrigatória"),
    Representantes: yup
      .array(
        yup.object({
          value: yup.string().required(),
          label: yup.string().required(),
        })
      )
      .min(1, "Selecione ao menos uma opção")
      .required("Seleção obrigatória"),
    Assunto: yup.string().required("Assunto é obrigatório"),
    Mensagem: yup.string().optional("Mensagem é obrigatória"),
  })
  .required();

export type FormDataNotification = yup.InferType<typeof schema>;

interface FormCreateNotificationProps {
  btnSubmit: any;
  notification?: FormDataNotification;
}

interface optProps {
  value: string;
  label: string;
}

export const NewNotification = ({
  btnSubmit,
  notification,
}: FormCreateNotificationProps) => {
  const [message, setMessage] = useState("");
  const [selectedClients, setSelectedClients] = useState<Array<optProps>>([]);
  const [selectedDealers, setSelectedDealers] = useState<Array<optProps>>([]);
  const [selectedAgents, setSelectedAgents] = useState<Array<optProps>>([]);

  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormDataNotification>({
    defaultValues: notification,
    resolver: yupResolver(schema),
  });

  const handleClientChange = (newValue) => {
    if (newValue.some((option) => option.value === "")) {
      setValue("Clientes", [{ value: "", label: "Nenhum" }]);
      setSelectedClients([{ value: "", label: "Nenhum" }]);
    } else {
      setValue("Clientes", newValue);
      setSelectedClients(newValue);
    }
  };

  const handleDealerChange = (newValue) => {
    if (newValue.some((option) => option.value === "")) {
      setValue("Vendedores", [{ value: "", label: "Nenhum" }]);
      setSelectedDealers([{ value: "", label: "Nenhum" }]);
    } else {
      setValue("Vendedores", newValue);
      setSelectedDealers(newValue);
    }
  };

  const handleAgentChange = (newValue) => {
    if (newValue.some((option) => option.value === "")) {
      setValue("Representantes", [{ value: "", label: "Nenhum" }]);
      setSelectedAgents([{ value: "", label: "Nenhum" }]);
    } else {
      setValue("Representantes", newValue);
      setSelectedAgents(newValue);
    }
  };

  const handleMsgChange = (value) => {
    console.log(value);
    setValue("Mensagem", value);
    console.log("ate aq");
  };

  const tools = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const loadClients = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const listC: any = [];

    const response = await api.client.getSome(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search
    );

    response?.data?.finalClients?.forEach((c) => {
      listC.push({
        value: c.Id,
        label: c.Name,
        type: "client",
      });
    });

    const nullOptExists = prevOptions.some((option) => option.value === "");

    const nullOpt =
      !nullOptExists && selectedClients.length === 0
        ? { value: "", label: "Nenhum" }
        : null;

    const options = nullOpt ? [nullOpt, ...listC] : listC;

    const hasMore =
      response?.data.meta.total > vlr && response?.data.meta.total > 10;

    return {
      options,
      hasMore,
    };
  };

  const loadDealers = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const listD: any = [];

    const response = await api.dealer.getSome(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search
    );
    response?.data?.dealers?.forEach((d) => {
      listD.push({
        value: d.Id,
        label: d.CompanyName || d.Name,
        type: "dealer",
      });
    });

    const nullOptExists = prevOptions.some((option) => option.value === "");

    const nullOpt =
      !nullOptExists && selectedDealers.length === 0
        ? { value: "", label: "Nenhum" }
        : null;

    const options = nullOpt ? [nullOpt, ...listD] : listD;

    const hasMore =
      response?.data.meta.total > vlr && response?.data.meta.total > 10;

    return {
      options,
      hasMore,
    };
  };

  const loadAgents = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const listA: any = [];

    const response = await api.client.getSomeAgent(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search
    );

    response?.data?.finalClients?.forEach((c) => {
      listA.push({
        value: c.Id,
        label: c.Name,
        type: "representative",
      });
    });

    const nullOptExists = prevOptions.some((option) => option.value === "");

    const nullOpt =
      !nullOptExists && selectedAgents.length === 0
        ? { value: "", label: "Nenhum" }
        : null;

    const options = nullOpt ? [nullOpt, ...listA] : listA;

    const hasMore =
      response?.data.meta.total > vlr && response?.data.meta.total > 10;

    return {
      options,
      hasMore,
    };
  };

  /*const vMsg = watch("Mensagem");

  useEffect(() => {
    if (vMsg) {
      setValue("Mensagem", vMsg || "");
    }
  }, [vMsg]);*/

  const submit = () => {
    console.log("subimitei");
  };

  return (
    <>
      <PageLayout>
        <h2 style={{ color: "#7c7c7c", textAlign: "center" }}>Nova mensagem</h2>
        <CardData>
          <h3>Criar mensagem</h3>
          <form onSubmit={handleSubmit(submit)}>
            <div
              style={{
                width: "100%",
                margin: "1rem",
                display: "flex",
              }}
            >
              <div style={{ width: "100%", marginRight: "1%" }}>
                <label>Destinatário(s)</label>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <div>
                    <Controller
                      name="Clientes"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <AsyncPaginate
                          value={field.value}
                          placeholder="Selecionar clientes..."
                          loadOptions={loadClients}
                          isMulti
                          onChange={(e) => {
                            field.onChange(e);
                            handleClientChange(e);
                            console.log(field);
                          }}
                          menuPortalTarget={document.body}
                          isOptionDisabled={() =>
                            selectedClients.some(
                              (option) => option.value === ""
                            )
                          }
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPosition={"fixed"}
                        />
                      )}
                    />
                    {errors.Clientes && (
                      <h5 style={{ color: "red" }}>
                        {errors.Clientes.message}
                      </h5>
                    )}
                  </div>
                  <div>
                    <Controller
                      name="Vendedores"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <AsyncPaginate
                          value={field.value}
                          placeholder="Selecionar vendedores..."
                          loadOptions={loadDealers}
                          isMulti
                          onChange={(e) => {
                            field.onChange(e);
                            handleDealerChange(e);
                            console.log(field);
                          }}
                          menuPortalTarget={document.body}
                          isOptionDisabled={() =>
                            selectedDealers.some(
                              (option) => option.value === ""
                            )
                          }
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPosition={"fixed"}
                        />
                      )}
                    />
                    {errors.Vendedores && (
                      <h5 style={{ color: "red" }}>
                        {errors.Vendedores.message}
                      </h5>
                    )}
                  </div>
                  <div>
                    <Controller
                      name="Representantes"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <AsyncPaginate
                          value={field.value}
                          placeholder="Selecionar representantes..."
                          loadOptions={loadAgents}
                          isMulti
                          onChange={(e) => {
                            field.onChange(e);
                            handleAgentChange(e);
                            console.log(field);
                          }}
                          menuPortalTarget={document.body}
                          isOptionDisabled={() =>
                            selectedAgents.some((option) => option.value === "")
                          }
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPosition={"fixed"}
                        />
                      )}
                    />
                    {errors.Representantes && (
                      <h5 style={{ color: "red" }}>
                        {errors.Representantes.message}
                      </h5>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                margin: "1rem",
                display: "flex",
              }}
            >
              <div style={{ width: "100%", marginRight: "1%" }}>
                <label>Assunto</label>
                <InputData
                  {...register("Assunto")}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    paddingLeft: "0.5rem",
                  }}
                />
                {errors.Assunto && (
                  <h5 style={{ color: "red" }}>{errors.Assunto.message}</h5>
                )}
              </div>
            </div>
            <div
              style={{
                width: "100%",
                margin: "1rem",
                display: "flex",
                height: "8rem",
              }}
            >
              <div
                style={{
                  width: "100%",
                  marginRight: "1%",
                  height: "100%",
                  backgroundColor: "",
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "1%",
                }}
              >
                <label>Mensagem</label>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Controller
                    name="Mensagem"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ReactQuill
                        value={field.value}
                        style={{ height: "100%" }}
                        theme="snow"
                        onChange={(e) => {
                          field.onChange(e);
                          handleMsgChange(e);
                          console.log(field);
                        }}
                        modules={tools}
                      />
                    )}
                  />
                </div>
                {errors.Mensagem && (
                  <h5 style={{ color: "red" }}>{errors.Mensagem.message}</h5>
                )}
              </div>
            </div>
            <Button type="submit">Salvei</Button>
            <button type="submit" ref={btnSubmit}>
              Salvarei 40
            </button>
          </form>
        </CardData>
      </PageLayout>
    </>
  );
};

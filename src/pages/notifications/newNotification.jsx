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

export const NewNotification = () => {
  const [message, setMessage] = useState("");
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedDealers, setSelectedDealers] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);

  const handleClientChange = (newValue) => {
    if (newValue.some((option) => option.value === ""))
      setSelectedClients([{ value: "", label: "Nenhum" }]);
    else setSelectedClients(newValue);
  };

  const handleDealerChange = (newValue) => {
    if (newValue.some((option) => option.value === ""))
      setSelectedDealers([{ value: "", label: "Nenhum" }]);
    else setSelectedDealers(newValue);
  };

  const handleAgentChange = (newValue) => {
    if (newValue.some((option) => option.value === ""))
      setSelectedAgents([{ value: "", label: "Nenhum" }]);
    else setSelectedAgents(newValue);
  };

  const handleChange = (value) => {
    setMessage(value);
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
    const list = [];

    const response = await api.client.getSome(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search
    );

    response?.data?.finalClients?.forEach((c) => {
      list.push({
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

    const options = nullOpt ? [nullOpt, ...list] : list;

    const hasMore =
      response?.data.meta.total > vlr && response?.data.meta.total > 10;

    return {
      options,
      hasMore,
    };
  };

  const loadDealers = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const listD = [];

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
    const listA = [];

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

  return (
    <>
      <PageLayout>
        <h2 style={{ color: "#7c7c7c", textAlign: "center" }}>Nova mensagem</h2>
        <CardData>
          <h3>Criar mensagem</h3>
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
                <AsyncPaginate
                  value={selectedClients}
                  placeholder="Selecionar clientes..."
                  loadOptions={loadClients}
                  isMulti
                  onChange={handleClientChange}
                  menuPortalTarget={document.body}
                  isOptionDisabled={() =>
                    selectedClients.some((selected) => selected.value === "")
                  }
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPosition={"fixed"}
                />
                <AsyncPaginate
                  value={selectedDealers}
                  placeholder="Selecionar vendedores..."
                  loadOptions={loadDealers}
                  isMulti
                  onChange={handleDealerChange}
                  menuPortalTarget={document.body}
                  isOptionDisabled={() =>
                    selectedDealers.some((option) => option.value === "")
                  }
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPosition={"fixed"}
                />
                <AsyncPaginate
                  value={selectedAgents}
                  placeholder="Selecionar representantes..."
                  loadOptions={loadAgents}
                  isMulti
                  onChange={handleAgentChange}
                  menuPortalTarget={document.body}
                  isOptionDisabled={() =>
                    selectedAgents.some((option) => option.value === "")
                  }
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPosition={"fixed"}
                />
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
                style={{
                  width: "100%",
                  textAlign: "left",
                  paddingLeft: "0.5rem",
                }}
              />
            </div>
          </div>
          <div
            style={{
              width: "100%",
              margin: "1rem",
              display: "flex",
            }}
          >
            <div
              style={{
                width: "100%",
                marginRight: "1%",
                height: "15rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label>Mensagem</label>
              <ReactQuill
                value={message}
                onChange={handleChange}
                modules={tools}
              />
            </div>
          </div>
        </CardData>
      </PageLayout>
    </>
  );
};

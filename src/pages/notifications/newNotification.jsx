import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from "../../../globalStyles";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { translateError } from "../../services/util";
import { InputData, CardData } from "../resales/Resales.styles";
// import { TableItens } from '../clients/clientNew/NewOrder.styles';
import Select from "react-select";
import { ModalMessage } from "../../components/ModalMessage/ModalMessage";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Loading } from "../../components/loading/Loading";
import { useTranslation } from "react-i18next";
import { PageTitles } from "../../components/PageTitle/PageTitle";
import { styled } from "styled-components";
import { AsyncPaginate } from "react-select-async-paginate";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export const NewNotification = () => {
  const [message, setMessage] = useState('');
  const [selectedClients, setSelectedClients] = useState([])
  const [selectedDealers, setSelectedDealers] = useState([])

  const handleClientChange = (newValue) => {
    if(newValue.some(option => option.value === ""))
      setSelectedClients([{value: "", label: "Nenhum"}])
    else
    setSelectedClients(newValue)
  }

  const handleDealerChange = (newValue) => {
    if(newValue.some(option => option.value === ""))
      setSelectedDealers([{value: "", label: "Nenhum"}])
    else
    setSelectedDealers(newValue)
  }

  const handleChange = (value) => {
    setMessage(value);
  };

  const tools = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ]
  };

  const formats = [
    'header', 'font', 'bold', 'italic', 'underline', 'list', 'bullet'
  ];

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const loadDealers = async (search, prevOptions) => {
    const vlr = prevOptions.length;

    const response = await api.dealer.getSome(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search
    );
    const listD = [];
    response?.data?.dealers?.forEach((d) => {
      listD.push({
        value: d.Id,
        label: d.CompanyName || d.Name,
        type: "dealer",
      });
    });

    const nullOpt = { value: "", label: "Nenhum" };

    const options = [nullOpt, ...listD];

    const hasMoreD = response?.data.meta.total > vlr;
    console.log(listD);
    return {
      options,
      hasMoreD,
    };
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

    const nullOpt = { value: '', label: "Nenhum" };

    const options = [nullOpt, ...list];

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
                    placeholder="Selecionar clientes..."
                    loadOptions={loadClients}
                    isMulti
                    onChange={handleClientChange}
                    menuPortalTarget={document.body}
                    isOptionDisabled={() => selectedClients.some(option => option.value === "")}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPosition={"fixed"}
                  />
                <AsyncPaginate
                  placeholder="Selecionar vendedores..."
                  loadOptions={loadDealers}
                  isMulti
                  onChange={handleDealerChange}
                  menuPortalTarget={document.body}
                  isOptionDisabled={() => selectedDealers.some(option => option.value === "")}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPosition={"fixed"}
                />
                <Select
                  isMulti
                  name="representatives"
                  options={options}
                  placeholder="Selecionar representantes..."
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
              <ReactQuill value={message} onChange={handleChange} modules={tools} formats={formats} />

            </div>
          </div>
        </CardData>
      </PageLayout>
    </>
  );
};

import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from "../../../globalStyles";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { translateError } from "../../services/util";
import { InputData } from "../resales/Resales.styles";
// import { TableItens } from '../clients/clientNew/NewOrder.styles';
import Select from "react-select";
import { ModalMessage } from "../../components/ModalMessage/ModalMessage";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Loading } from "../../components/loading/Loading";
import { useTranslation } from "react-i18next";
import { PageTitles } from "../../components/PageTitle/PageTitle";

/*export const NewNotification = () => {
  return(
    <>
      <form>
        <div>
          <h1>aaaa</h1>
        </div>

      </form>
    </>
  )
}*/

export const Notifications = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageLayout>
        <PageTitles title="notificações" />
        <div style={{ display: screen.width > 768 && "flex", gap: 15 }}>
          {api.currentUser.AccessTypes[0] === "TEGG" && (
            <Button
              style={{ width: screen.width < 768 && "100%" }}
              onClick={() => navigate("/notifications/new")}
            >
              + NOTIFICAÇÃO
            </Button>
          )}
        </div>
        <h1>aaaa</h1>
      </PageLayout>
    </>
  );
};

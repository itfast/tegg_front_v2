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
import Select from "react-select";
import { ModalMessage } from "../../components/ModalMessage/ModalMessage";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Loading } from "../../components/loading/Loading";
import { useTranslation } from "react-i18next";
import { PageTitles } from "../../components/PageTitle/PageTitle";
import { TableItens } from "../orders/clientNew/NewOrder.styles";
import { NotificationInfo } from "./NotificationInfo";

export const Notifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState("Buscando notificações");
  const [totalPages, setTotalPages] = useState(1);

  const getNotifications = () => {
    setLoading(true);
    api.notification
      .getAll(page, limit, search)
      .then((res) => {
        console.log(res.data);
        setTotalPages(res.data?.meta?.totalPages || 1);
        setNotifications(res.data.notifications)
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
        setLoadingDetails(false)
      });
  }

  useEffect(() => {
    if (api.currentUser.AccessTypes[0] !== "TEGG") {
      api.user
        .logout()
        .then(() => {
          navigate("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getNotifications()
  }, [page, limit, search]);

  return (
    <div style={{ display: screen.width > 768 && "flex", gap: 15 }}>
      {api.currentUser.AccessTypes[0] === "TEGG" && (
        <>
          <Loading open={loading} msg={msg} />
          <PageLayout>
            <PageTitles title="notificações" />
            <Button
              style={{ width: screen.width < 768 && "100%" }}
              onClick={() => navigate("/notifications/new")}
            >
              + NOTIFICAÇÃO
            </Button>

            <div style={{ marginTop: "1rem" }}>
              <div
                style={{
                  display: screen.width > 768 && "flex",
                  flexDirection: screen.width < 768 && "column",
                  alignItems: "center",
                  margin: "1rem 0",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: screen.width > 768 && "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <h3>Buscar notificação pelo assunto:</h3>
                  <InputData
                    id="notification"
                    type="text"
                    placeholder="Assunto"
                    style={{
                      width: screen.width < 768 ? "100%" : 250,
                      marginBottom: screen.width < 768 && "1rem",
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <ContainerWeb>
              <TableItens>
                <>
                  <tr>
                    <th>Assunto</th>
                    <th>Destinatários</th>
                    <th>Data de envio</th>
                  </tr>
                  {notifications.map((n) => (
                    <NotificationInfo
                    setLoading={setLoadingDetails}
                    setMsg={setMsg}
                    key={n.Id}
                    notification={n}
                    getNotification={getNotifications}
                    />
                  ))}
                </>
              </TableItens>
            </ContainerWeb>
          </PageLayout>
        </>
      )}
    </div>
  );
};

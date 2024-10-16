import React, { useEffect, useState } from "react";
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
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Loading } from "../../components/loading/Loading";
import { PageTitles } from "../../components/PageTitle/PageTitle";
import { TableItens } from "../orders/clientNew/NewOrder.styles";
import { NotificationInfo } from "./NotificationInfo";

export const Notifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [pageLimit, setPageLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState("Buscando notificações");
  const [maxPages, setMaxPages] = useState(1);

  const getNotifications = () => {
    setLoading(true);
    api.notification
      .getAll(page, pageLimit, search)
      .then((res) => {
        console.log(res?.data);
        setMaxPages(res?.data?.meta?.totalPages || 1);
        setNotifications(res?.data?.notifications)
      })
      .catch((err) => translateError(err))
      .finally(() => {
        setLoading(false);
        setLoadingDetails(false)
      });
  }

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageLimitChange = (e) => {
    setPageLimit(e.target.value);
  };

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
  }, [page, pageLimit, search]);

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
                    />
                  ))}
                </>
              </TableItens>
            </ContainerWeb>

            <br />
        {!loading && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Stack
              spacing={2}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Pagination
                count={maxPages}
                page={page}
                onChange={handlePageChange}
                variant='outlined'
                shape='rounded'
              />
              <div style={{ display: 'flex', gap: 5 }}>
                <p>Itens por página:</p>
                <select
                  name='pages'
                  id='page-select'
                  value={pageLimit}
                  onChange={(e) => {
                    handlePageLimitChange(e);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </Stack>
          </div>
        )}
          </PageLayout>
        </>
      )}
    </div>
  );
};

import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import {
  PageLayout,
  Button,
  ContainerWeb,
  ContainerMobile,
} from "../../../globalStyles";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import { SubscriptionInfo } from "./SubscriptionInfo";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

import { SubscriptionInfoMobile } from "./SubscriptionInfoMobile";
import { translateError } from "../../services/util";
import { TableItens } from "../orders/clientNew/NewOrder.styles";
import { Loading } from "../../components/loading/Loading";
import { PageTitles } from '../../components/PageTitle/PageTitle'

export const Subscriptions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const [subscriptions, setSubscriptions] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [planOpt, setPlanOpt] = useState([]);

  const [type, setType] = useState("phone");

  // const [personalRequests, setPersonalRequests] = useState(false);

  const getSubscriptions = () => {
    setLoading(true);
    api.iccid
      .getSubscriptions(pageNum, pageSize)
      .then((res) => {
        console.log(res.data.subscriptions)
        const list = []
        res.data?.subscriptions.forEach((r) =>{
          if(!r.PlayHubPlan){
            list.push(r)
          }
        })
        setSubscriptions(list);
        setMaxPages(res.data.meta.totalPages || 1);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    api.plans
      .getByRecharge()
      .then((res) => {
        res.data.sort((a, b) => {
          return a.Products[0].Product.Amount - b.Products[0].Product.Amount;
        });
        const filtered = res.data.filter((p) => !p?.OnlyInFirstRecharge);
        setPlanOpt(filtered);
      })
      .catch((err) => {
        translateError(err);
      });

    if (location?.state?.type) {
      setType(location?.state?.type);
    }
  }, []);

  const handlePageChange = (event, value) => {
    setPageNum(value);
    // getSubscriptions(value, pageSize);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNum(1);
    // getSubscriptions(1, e.target.value);
  };

  useEffect(() => {
    getSubscriptions();
  }, [pageNum, pageSize]);

  return (
    <>
      <ContainerWeb>
        <Loading open={loading} msg="Buscando assinaturas..." />
        <PageLayout>
          <PageTitles title={'Assinaturas'} />
          <div style={{ display: "flex", marginBottom: "1rem" }}>
            <Button
              invert={type === "tv"}
              notHover
              // disabled={type === 'tv'}
              style={{ borderRadius: 0, width: 100 }}
              onClick={() => setType("phone")}
            >
              Telefone
            </Button>
          </div>

          <>
            <div className="btn_container">
              <Button onClick={() => navigate("/subscriptions/new")}>
                + ASSINATURA
              </Button>
            </div>
            {subscriptions.length > 0 ? (
              <TableItens style={{ marginTop: "1rem" }}>
                <thead>
                  <tr>
                    {api.currentUser.AccessTypes[0] !== "CLIENT" &&
                      api.currentUser.AccessTypes[0] !== "AGENT" && (
                        <th>Cliente</th>
                      )}
                    <th>Status</th>
                    <th>Linha</th>
                    <th>Plano</th>
                    <th>Vencimento da próxima fatura</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                {subscriptions.map((subcription, index) => (
                  <SubscriptionInfo
                    key={index}
                    subscription={subcription}
                    getSubscriptions={getSubscriptions}
                    pageNum={pageNum}
                    pageSize={pageSize}
                  />
                ))}
              </TableItens>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 150,
                }}
              >
                <h2 style={{ color: "black", fontWeight: "bold" }}>
                  Ainda não existem assinaturas cadastradas
                </h2>
              </div>
            )}

            <br />
            {!loading && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Stack
                  spacing={2}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Pagination
                    count={maxPages}
                    page={pageNum}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                  />
                  <div style={{ display: "flex", gap: 5 }}>
                    <p>Itens por página:</p>
                    <select
                      name="pages"
                      id="page-select"
                      value={pageSize}
                      onChange={(e) => {
                        handlePageSizeChange(e);
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
          </>
        </PageLayout>
      </ContainerWeb>
      <ContainerMobile>
        <div id="banner">
          <PageLayout>
          <PageTitles title={'Assinaturas'} />
            <div style={{ display: "flex", marginBottom: "1rem" }}>
              <Button
                invert={type === "tv"}
                notHover
                // disabled={type === 'tv'}
                style={{ borderRadius: 0, width: "100%" }}
                onClick={() => setType("phone")}
              >
                Telefone
              </Button>
              {(api.currentUser?.Type === "CLIENT" ||
                api.currentUser?.Type === "AGENT") && (
                <Button
                  invert={type === "phone"}
                  notHover
                  // disabled={type === 'phone'}
                  style={{ borderRadius: 0, width: "100%" }}
                  onClick={() => setType("tv")}
                >
                  TV
                </Button>
              )}
            </div>
            <>
              <div className="btn_container">
                <Button
                  onClick={() => navigate("/subscriptions/new")}
                  style={{ width: "100%", marginBottom: "1rem" }}
                >
                  + ASSINATURA
                </Button>
              </div>
              {loading ? (
                <div className="loading">
                  <ReactLoading type={"bars"} color={"#00D959"} />
                </div>
              ) : subscriptions.length > 0 ? (
                // <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'hidden' }}>
                subscriptions.map((n) => (
                  <SubscriptionInfoMobile
                    key={n.Id}
                    n={n}
                    planOpt={planOpt}
                    reload={getSubscriptions}
                  />
                ))
              ) : (
                // </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: 300,
                    alignItems: "center",
                  }}
                >
                  <h4>VOCÊ AINDA NÃO POSSUI ASSINATURAS</h4>
                </div>
              )}
            </>

            <br />
            <br />
            {!loading && subscriptions.length > 0 && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Stack
                  spacing={2}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Pagination
                    count={maxPages}
                    page={pageNum}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                  />
                  <div style={{ display: "flex", gap: 5 }}>
                    <p>Itens por página:</p>
                    <select
                      name="pages"
                      id="page-select"
                      value={pageSize}
                      onChange={(e) => {
                        handlePageSizeChange(e);
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
        </div>
      </ContainerMobile>
    </>
  );
};

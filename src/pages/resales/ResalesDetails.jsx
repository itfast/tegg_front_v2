import { useLocation, useNavigate } from "react-router-dom";
import { Button, PageLayout } from "../../../globalStyles";
import { ContainerDetails, ContainerTable } from "./Resales.styles";
import { HeaderDetails } from "../../components/HeaderDetails/HeaderDetails";
import { ResalesMetrics } from "../../components/ResalesMetrics/ResalesMetrics";
import { BsInfoCircleFill } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  cnpjBancFormat,
  cpfBancFormat,
  phoneFormat,
  translateError,
} from "../../services/util";
import moment from "moment";
import api from "../../services/api";
import { TeggMetrics } from "../../components/TeggMetrics/TeggMetrics";
import { MapsData } from "../../components/myMaps/MapsData";
// import { NewActiveChart } from "../../components/charts/NewActiveChart";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
// import ReactLoading from "react-loading";

const UFS = [
  { lati: "-13.071338", longi: "-55.510218", uf: "MT", qtd: "10" },
  { lati: "-8.868393", longi: "-70.254592", uf: "AC", qtd: "10" },
  { lati: "-11.306805", longi: "-62.739058", uf: "RD", qtd: "10" },
  { lati: "-3.302104", longi: "-60.001671", uf: "AM", qtd: "1890" },
  { lati: "-5.943022", longi: "-52.039757", uf: "PA", qtd: "10" },
  { lati: "1.765883", longi: "-61.070386", uf: "RO", qtd: "10" },
  { lati: "1.404107", longi: "-51.864148", uf: "AMAPA", qtd: "10" },
  { lati: "-5.311649", longi: "-45.222359", uf: "MARANHÃO", qtd: "10" },
  { lati: "-7.584118", longi: "-42.610574", uf: "PI", qtd: "10" },
  { lati: "-5.134837", longi: "-39.425929", uf: "CE", qtd: "10" },
  { lati: "-5.731107", longi: "-36.370468", uf: "RN", qtd: "10" },
  { lati: "-7.361012", longi: "-36.673113", uf: "PARAIBA", qtd: "10" },
  { lati: "-8.496896", longi: "-37.835910", uf: "PE", qtd: "10" },
  { lati: "-9.817825", longi: "-36.386397", uf: "AL", qtd: "10" },
  { lati: "-10.632955", longi: "-37.246547", uf: "SE", qtd: "10" },
  { lati: "-11.913880", longi: "-41.579159", uf: "BH", qtd: "10" },
  { lati: "-15.955032", longi: "-49.375855", uf: "GO", qtd: "10" },
  { lati: "-20.422825", longi: "-54.457796", uf: "MTS", qtd: "10" },
  { lati: "-18.538759", longi: "-43.994343", uf: "MG", qtd: "100" },
  { lati: "-19.567284", longi: "-40.520323", uf: "ES", qtd: "10" },
  { lati: "-22.930489", longi: "-43.452862", uf: "RJ", qtd: "10" },
  { lati: "-22.323859", longi: "-48.551700", uf: "SP", qtd: "10" },
  { lati: "-24.580989", longi: "-51.388213", uf: "PR", qtd: "980" },
  { lati: "-27.244599", longi: "-50.385818", uf: "SC", qtd: "10" },
  { lati: "-29.810349", longi: "-53.244774", uf: "RS", qtd: "10" },
];

export const ResalesDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [dealer, setDealer] = useState({});
  const [clients, setClients] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [maxPages, setMaxPages] = useState(1);

  const [lines, setLines] = useState(0);
  const [loadingLines, setLoadingLines] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [totalClients, setTotalClients] = useState(0);
  const [totalCreated, setTotalCreated] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [orderMetrics, setOrdermetrics] = useState({
    Recharges: {
      Total: { ConfirmedOrders: 0, ReceivedOrders: 0 },
      Month: { ConfirmedOrders: 0, ReceivedOrders: 0 },
    },
    Chips: {
      Total: { ConfirmedOrders: 0, ReceivedOrders: 0 },
      Month: {
        ConfirmedOrders: 0,
        ReceivedOrders: 0,
      },
    },
  });

  const [iccidInfo, setIccidInfo] = useState({
    Active: 0,
    Available: 0,
  });
  const [iccidLoading, setIccidLoading] = useState(true);

  // console.log(location?.state?.dealer);
  // console.log(api.currentUser);

  const getClients = (pageNum, pageSize) => {
    setLoading(true);
    if (api.currentUser.AccessTypes[0] === "TEGG") {
      api.client
        .getByDealer(location?.state?.dealer?.Id, pageNum, pageSize)
        .then((res) => {
          // console.log(res.data);
          setClients(res.data.finalClients);
          setMaxPages(res.data.meta.totalPages || 1);
        })
        .catch((err) => translateError(err))
        .finally(() => {
          setLoading(false);
        });
    } else {
      api.client
        .getAll(pageNum, pageSize, "")
        .then((res) => {
          // console.log(res.data);
          setClients(res.data.finalClients);
        })
        .catch((err) => translateError(err))
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handlePageChange = (event, value) => {
    setPageNum(value);
    getClients(value, pageSize);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNum(1);
    getClients(1, e.target.value);
  };

  const getDealer = () => {
    api.dealer
      .getById(api.currentUser.DealerId)
      .then((res) => {
        // console.log(res.data);
        setDealer(res.data);
      })
      .catch((err) => translateError(err));
  };

  const getIccids = () => {
    if (api.currentUser.AccessTypes[0] === "TEGG") {
      api.iccid
        .getDealerTotals(location?.state?.dealer?.Id)
        .then((res) => {
          // console.log(res.data);
          setIccidInfo(res.data);
        })
        .catch((err) => translateError(err))
        .finally(() => {
          setIccidLoading(false);
        });
    } else {
      api.iccid
        .getDealerTotals(api.currentUser.DealerId)
        .then((res) => {
          // console.log(res.data);
          setIccidInfo(res.data);
        })
        .catch((err) => translateError(err))
        .finally(() => {
          setIccidLoading(false);
        });
    }
  };

  const getMetrics = () => {
    if (api.currentUser.AccessTypes[0] === "TEGG") {
      api.order
        .getDealerMetrics(location?.state?.dealer?.Id)
        .then((res) => {
          // console.log(res.data);
          setOrdermetrics(res.data);
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {
          setLoadingMetrics(false);
        });
    } else {
      api.order
        .getDealerMetrics(api.currentUser.DealerId)
        .then((res) => {
          // console.log(res.data);
          setOrdermetrics(res.data);
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {
          setLoadingMetrics(false);
        });
    }
  };

  const getClientsTotals = () => {
    if (api.currentUser.AccessTypes[0] === "TEGG") {
      api.client
        .getTotalsDealer(location?.state?.dealer?.Id)
        .then((res) => {
          let total = 0;
          let created = 0;
          let active = 0;
          const list = [];
          res.data?.TotalClients?.forEach((t) => {
            total += t._count?.Id;
            const find = UFS.find((uf) => uf.uf === t.State);
            if (find) {
              list.push(...list, {
                lati: find.lati,
                longi: find.longi,
                uf: find.uf,
                qtd: t._count?.Id?.toString(),
              });
            }
          });
          res.data?.TotalClientCreated?.forEach((t) => {
            created += t._count?.Id;
          });
          res.data?.TotalClientsActived?.forEach((t) => {
            active += t._count?.Id;
          });
          setMarkers(list);
          setTotalClients(total);
          setTotalCreated(created);
          setTotalActive(active);
        })
        .catch((err) => translateError(err))
        .finally(() => {
          setLoadingClients(false);
        });
    } else {
      api.client
        .getTotals()
        .then((res) => {
          let total = 0;
          let created = 0;
          let active = 0;
          const list = [];
          res.data?.TotalClients?.forEach((t) => {
            total += t._count?.Id;
            const find = UFS.find((uf) => uf.uf === t.State);
            if (find) {
              list.push(...list, {
                lati: find.lati,
                longi: find.longi,
                uf: find.uf,
                qtd: t._count?.Id?.toString(),
              });
            }
          });
          res.data?.TotalClientCreated?.forEach((t) => {
            created += t._count?.Id;
          });
          res.data?.TotalClientsActived?.forEach((t) => {
            active += t._count?.Id;
          });
          setMarkers(list);
          setTotalClients(total);
          setTotalCreated(created);
          setTotalActive(active);
        })
        .catch((err) => translateError(err))
        .finally(() => {
          setLoadingClients(false);
        });
    }
  };

  const getLines = () => {
    api.line
      .getLines(1, 1, location?.state?.dealer?.Id || "", "")
      .then((res) => {
        // console.log(res.data.meta.total);
        setLines(res.data.meta.total);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoadingLines(false);
      });
  };

  useEffect(() => {
    if (api.currentUser.AccessTypes[0] === "CLIENT") {
      api.user
        .logout()
        .then(() => {
          navigate("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getClients(pageNum, pageSize);
    getIccids();
    if (api.currentUser.AccessTypes[0] === "DEALER") {
      getDealer();
    }
    getMetrics();
    getClientsTotals();
    getLines();
  }, []);

  const handleDetails = (e) => {
    setUserDetails(e);
    setShowModal(true);
  };

  return (
    <PageLayout>
      <ContainerDetails>
        <HeaderDetails dealerDetails={location?.state?.dealer || dealer} />
      </ContainerDetails>
      <TeggMetrics
        totalClients={totalClients}
        totalCreated={totalCreated}
        totalActive={totalActive}
        totalDealers={0}
        orderMetrics={orderMetrics}
        loadingClients={loadingClients}
        loadingDealers={false}
        loadingMetrics={loadingMetrics}
      />
      <ResalesMetrics
        iccidInfo={iccidInfo}
        iccidLoading={iccidLoading}
        lines={lines}
        loadingLines={loadingLines}
      />
      {api.currentUser.AccessTypes[0] !== "CLIENT" && (
        <div style={{ margin: "1rem" }}>
          <div
            style={{
              width: "100%",
              textAlign: "center",
              backgroundColor: "#00D959",
              color: "#fff",
              borderRadius: "8px 8px 0 0",
              padding: "0.5rem",
            }}
          >
            <h4>{t("Resales.details.clientsForState")}</h4>
          </div>
          <div style={{ width: "100%" }}>
            <MapsData zoom={4} markerClick markers={markers} />
          </div>
        </div>
      )}
      <ContainerTable>
        <h2>{t("Resales.details.table.title")}</h2>
        <table id="customers">
          <thead>
            <tr>
              <th>{t("Resales.details.table.name")}</th>
              <th>{t("Resales.details.table.document")}</th>
              <th>{t("Resales.details.table.contact")}</th>
              <th>{t("Resales.details.table.details")}</th>
              <th>{t("Resales.details.table.edit")}</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((d) => (
                <tr key={d.Id}>
                  <td>{d.CompanyName || d.Name}</td>
                  <td>{d.Cnpj || d.Cpf}</td>
                  <td>{d.Name}</td>
                  <td align="center">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <BsInfoCircleFill
                        style={{ cursor: "pointer" }}
                        size={20}
                        onClick={() => handleDetails(d)}
                      />
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CiEdit
                        style={{ cursor: "pointer" }}
                        size={20}
                        onClick={() =>
                          navigate("/clients/edit", {
                            state: { clients: d },
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" align="center">
                  {t("Resales.details.table.notHaveClient")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
                <p>{t("Resales.details.table.itensPagination")}:</p>
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
      </ContainerTable>
      <div className="flex end">
        <Button onClick={() => navigate("/salesforce")}>
          {t("Resales.details.buttonGoback")}
        </Button>
      </div>
      <Dialog
        open={showModal}
        // onClose={() => console.log('fechar')}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {t("Resales.details.modal.title")}
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              width: "100%",
              border: "1px solid gray",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                <p>
                  {userDetails?.Type === "PF"
                    ? t("Resales.details.modal.pf")
                    : t("Resales.details.modal.pj")}
                </p>
                <p
                  style={{
                    color: userDetails?.Status === "Active" ? "green" : "red",
                  }}
                >
                  {userDetails?.Status === "Active"
                    ? t("Resales.details.modal.active")
                    : t("Resales.details.modal.disabled")}
                </p>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ width: "50%" }}>
                  <label>{t("Resales.details.modal.name")}</label>
                  <p>{userDetails?.Name}</p>
                </div>
                <div style={{ width: "50%" }}>
                  <label>{t("Resales.details.modal.email")}</label>
                  <p>{userDetails?.Email}</p>
                </div>
              </div>
              {userDetails?.Type === "PF" ? (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div style={{ width: "50%" }}>
                    <label>{t("Resales.details.modal.cpf")}</label>
                    <p>{userDetails?.Cpf && cpfBancFormat(userDetails?.Cpf)}</p>
                  </div>
                  <div style={{ width: "50%" }}>
                    <label>{t("Resales.details.modal.rg")}</label>
                    <p>{userDetails?.Rg}</p>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div style={{ width: "50%" }}>
                    <label>{t("Resales.details.modal.cnpj")}</label>
                    <p>
                      {userDetails?.Cnpj && cnpjBancFormat(userDetails?.Cnpj)}
                    </p>
                  </div>
                  <div style={{ width: "50%" }}>
                    <label>{t("Resales.details.modal.ie")}</label>
                    <p>{userDetails?.Ie}</p>
                  </div>
                </div>
              )}

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ width: "50%" }}>
                  <label>{t("Resales.details.modal.phone")}</label>
                  <p>
                    {userDetails?.Mobile && phoneFormat(userDetails.Mobile)}
                  </p>
                </div>
                <div style={{ width: "50%" }}>
                  <label>{t("Resales.details.modal.whatsapp")}</label>
                  <p>
                    {userDetails?.Whatsapp && phoneFormat(userDetails.Whatsapp)}
                  </p>
                </div>
              </div>
              <hr style={{ margin: "0.5rem" }} />
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                <p>{t("Resales.details.modal.address")}</p>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ width: "80%" }}>
                  <label>{t("Resales.details.modal.street")}</label>
                  <p>{userDetails?.StreetName}</p>
                </div>
                <div style={{ width: "20%" }}>
                  <label>{t("Resales.details.modal.number")}</label>
                  <p>{userDetails?.Number}</p>
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ width: "80%" }}>
                  <label>{t("Resales.details.modal.complement")}</label>
                  <p>{userDetails?.Complement}</p>
                </div>
                <div style={{ width: "20%" }}>
                  <label>{t("Resales.details.modal.postalCode")}</label>
                  <p>{userDetails?.PostalCode}</p>
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ width: "45%" }}>
                  <label>{t("Resales.details.modal.neighborhood")}</label>
                  <p>{userDetails?.District}</p>
                </div>
                <div style={{ width: "40%" }}>
                  <label>{t("Resales.details.modal.city")}</label>
                  <p>{userDetails?.City}</p>
                </div>
                <div style={{ width: "5%" }}>
                  <label>{t("Resales.details.modal.state")}</label>
                  <p>{userDetails?.State}</p>
                </div>
              </div>
              <hr style={{ margin: "0.5rem" }} />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  marginBottom: "0.5rem",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <label>{t("Resales.details.modal.dateRegister")}</label>
                  <p>
                    {userDetails?.CreatedAt &&
                      moment(userDetails?.CreatedAt).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div>
                  <label>{t("Resales.details.modal.resales")}</label>
                  <p>
                    {userDetails?.DealerId
                      ? userDetails?.Dealer?.CompanyName !== ""
                        ? userDetails?.Dealer?.CompanyName
                        : userDetails?.Dealer?.Name
                      : "TEGG"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setShowModal(false)}>
            {t("Resales.details.modal.buttonClose")}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

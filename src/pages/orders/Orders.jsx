import { useNavigate } from "react-router-dom";
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from "../../../globalStyles";
import api from "../../services/api";
import { useEffect, useState, useRef } from "react";
import { TableItens } from "./clientNew/NewOrder.styles";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
} from "@mui/material";
import Select from "react-select";
import { translateError } from "../../services/util";
import { OrderItensTable } from "./OrderItensTable";
import { InputSearch } from "./OrdersPending.styles";
import { CardOderItens } from "./CardOrderItens";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { PageTitles } from '../../components/PageTitle/PageTitle'

export const Orders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [modalLink, setModalLink] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState({ label: "10", value: 10 });
  const [total, setTotal] = useState(0);
  const [find, setFind] = useState("");
  const [status, setStatus] = useState({
    label: t("Order.status.all"),
    value: "",
  });
  const [freight, setFreight] = useState({
    label: t("Order.status.all"),
    value: "",
  });
  const fileRef = useRef(null);
  const [fileConfirm, setFileConfirm] = useState();
  // const [setPlan, plan] = useState();

  const search = () => {
    api.order
      .getAll(page, limit.value, find, status.value, freight.value)
      .then((res) => {
        setTotal(res.data?.meta?.totalPages);
        setOrders(res.data?.orders);
      })
      .catch((err) => translateError(err));
  };

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, limit, page, find, status, freight]);

  const handlePageSizeChange = (e) => {
    setLimit(e);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const generateLink = async () => {
    try {
      let element = "";
      if (api?.currentUser?.Type === "AGENT") {
        element = document.querySelector("#linkAgent");
      } else {
        element = document.querySelector("#linkDealer");
      }
      // Create a fake `textarea` and set the contents to the text
      // you want to copy
      const storage = document.createElement("textarea");
      storage.value = element.innerHTML;
      element.appendChild(storage);

      // Copy the text in the fake `textarea` and remove the `textarea`
      storage.select();
      storage.setSelectionRange(0, 99999);
      document.execCommand("copy");
      element.removeChild(storage);
      toast.info("Link copiado para área de transferência");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <ContainerWeb>
        <PageLayout>
          <PageTitles title="Pedidos" />
          <Button
            style={{ marginLeft: 20 }}
            onClick={async () => {
              if (
                api.currentUser.AccessTypes[0] !== "CLIENT" &&
                api.currentUser.AccessTypes[0] !== "AGENT"
              ) {
                navigate("/orders/new");
              } else {
                navigate("/orders/newbyclient");
              }
            }}
          >
            {api.currentUser.AccessTypes[0] === "DEALER"
              ? t("Order.newSale")
              : t("Order.newLabel")}
          </Button>
          {api.currentUser.AccessTypes[0] === "DEALER" && (
            <Button
              style={{ marginLeft: 20 }}
              onClick={async () => {
                navigate("/orders/newbydealer");
              }}
            >
              {api.currentUser.AccessTypes[0] === "DEALER" && "+ Compra"}
            </Button>
          )}
          {/* <Button style={{ marginLeft: 20 }} onClick={() => setModalLink(true)}>
            Link de interesse
          </Button> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <h5 style={{ marginRight: 10 }}>
                {t("Order.searchStatusLabel")}
              </h5>
              <div style={{ width: "10rem" }}>
                <Select
                  name="pages"
                  id="page-select"
                  options={[
                    { label: t("Order.status.all"), value: "" },
                    { label: t("Order.status.created"), value: "Created" },
                    { label: t("Order.status.confirmed"), value: "CONFIRMED" },
                    {
                      label: t("Order.status.paymentReceived"),
                      value: "RECEIVED",
                    },
                    { label: t("Order.status.pending"), value: "PENDING" },
                    { label: t("Order.status.overdue"), value: "OVERDUE" },
                    {
                      label: t("Order.status.awaitingResale"),
                      value: "AWAITINGPROCESSING",
                    },
                    {
                      label: t("Order.status.awaitingPayment"),
                      value: "AWAITING_PAYMENT",
                    },
                  ]}
                  value={status}
                  onChange={(e) => {
                    setStatus(e);
                  }}
                />
              </div>
              {api.currentUser.AccessTypes[0] !== "CLIENT" &&
                api.currentUser.AccessTypes[0] !== "AGENT" && (
                  <>
                    <h5 style={{ marginRight: 10, marginLeft: 10 }}>FRETE</h5>
                    <div style={{ width: "10rem" }}>
                      <Select
                        name="pages"
                        id="page-select"
                        options={[
                          { label: t("Order.status.all"), value: "" },
                          {
                            label: t("Order.status.receivedInBase"),
                            value: "Recebido na base - em separação",
                          },
                          {
                            label: t("Order.status.inRoute"),
                            value: "Em rota",
                          },
                          {
                            label: t("Order.status.finally"),
                            value: "Finalizado",
                          },
                        ]}
                        value={freight}
                        onChange={(e) => {
                          setFreight(e);
                        }}
                      />
                    </div>
                  </>
                )}
            </div>

            <InputSearch>
              <input
                placeholder={t("Order.searchPlaceHolder")}
                value={find}
                onChange={(e) => setFind(e.target.value)}
              />
              <img
                src="/assets/search4.png"
                style={{ marginRight: 10, zIndex: 11 }}
                // onClick={handleTypePass}
              />
            </InputSearch>
          </div>

          <TableItens style={{ marginTop: 20 }}>
            <tr>
              {api.currentUser.AccessTypes[0] !== "CLIENT" &&
                api.currentUser.AccessTypes[0] !== "AGENT" && (
                  <th>{t("Order.table.invoice")}</th>
                )}
              <th>{t("Order.table.createdAt")}</th>
              <th>{t("Order.table.seller")}</th>
              <th>{t("Order.table.client")}</th>
              <th>{t("Order.table.type")}</th>
              <th>{t("Order.table.value")}</th>
              <th>{t("Order.table.status")}</th>
              <th>{t("Order.table.statusFreight")}</th>
              <th>{t("Order.table.options")}</th>
            </tr>
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>
                  {t("Order.table.notHave")}
                </td>
              </tr>
            )}
            {orders.map((ord, ind) => (
              <OrderItensTable
                ord={ord}
                key={ind}
                search={search}
                fileConfirm={fileConfirm}
                fileRef={fileRef}
                setFileConfirm={setFileConfirm}
              />
            ))}
          </TableItens>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p>{t("Order.table.itensPagination")}:</p>
              <Select
                name="pages"
                id="page-select"
                options={[
                  { label: "5", value: "5" },
                  { label: "10", value: "10" },
                  { label: "30", value: "30" },
                  { label: "50", value: "50" },
                ]}
                value={limit}
                onChange={(e) => {
                  handlePageSizeChange(e);
                }}
              />
            </div>
            <div>
              <Pagination
                count={total}
                page={page}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                size="large"
              />
            </div>
          </div>
        </PageLayout>
      </ContainerWeb>
      <ContainerMobile>
        <div id="banner">
          <PageLayout>
          <PageTitles title="Pedidos" />
            <Button
              style={{ width: "100%", color: "#3d3d3d", fontSize: 20 }}
              onClick={async () => {
                if (
                  api.currentUser.AccessTypes[0] !== "CLIENT" &&
                  api.currentUser.AccessTypes[0] !== "AGENT"
                ) {
                  navigate("/orders/new");
                } else {
                  navigate("/orders/newbyclient");
                }
              }}
            >
              {t("Order.newLabel")}
            </Button>
            {api.currentUser.AccessTypes[0] !== "TEGG" && (
              <>
                {/* <h5 style={{ marginTop: '2rem', textAlign: 'center' }}>Pedidos</h5> */}
              </>
            )}
            <div
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              {/* {type === 'outros' && ( */}
              <InputSearch
                style={{
                  width: "100%",
                  margin: 0,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <input
                  placeholder={t("Order.searchPlaceHolder")}
                  value={find}
                  onChange={(e) => setFind(e.target.value)}
                />
                <img
                  src="/assets/search4.png"
                  style={{ marginRight: 10, zIndex: 11 }}
                  // onClick={handleTypePass}
                />
              </InputSearch>
              {/* )} */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <h5 style={{ marginRight: 10 }}>
                  {t("Order.searchStatusLabel")}
                </h5>
                <div style={{ width: "100%" }}>
                  <Select
                    name="pages"
                    id="page-select"
                    options={[
                      { label: t("Order.status.all"), value: "" },
                      { label: t("Order.status.created"), value: "Created" },
                      {
                        label: t("Order.status.confirmed"),
                        value: "CONFIRMED",
                      },

                      { label: t("Order.status.pending"), value: "PENDING" },
                      { label: t("Order.status.overdue"), value: "OVERDUE" },
                      {
                        label: t("Order.status.awaitingResale"),
                        value: "AWAITINGPROCESSING",
                      },
                      {
                        label: t("Order.status.awaitingPayment"),
                        value: "AWAITING_PAYMENT",
                      },
                      { label: t("Order.status.finally"), value: "PROCESSED" },
                    ]}
                    value={status}
                    onChange={(e) => {
                      setStatus(e);
                    }}
                  />
                </div>
              </div>
            </div>
            {orders.map((o) => (
              <CardOderItens key={o.Id} o={o} search={search} />
            ))}

            <div
              style={{
                // display: 'flex',
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={total}
                  page={page}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                  size="large"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "1rem",
                }}
              >
                <p>{t("Order.table.itensPagination")}:</p>
                <Select
                  menuPlacement="top"
                  isSearchable={false}
                  name="pages"
                  id="page-select"
                  options={[
                    { label: "5", value: "5" },
                    { label: "10", value: "10" },
                    { label: "30", value: "30" },
                    { label: "50", value: "50" },
                  ]}
                  value={limit}
                  onChange={(e) => {
                    handlePageSizeChange(e);
                  }}
                />
              </div>
            </div>
          </PageLayout>
        </div>
      </ContainerMobile>
      {console.log(api?.currentUser)}
      <Dialog open={modalLink}>
        <DialogTitle>Link personalizado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {api?.currentUser?.Type === "AGENT" ? (
              <>
                Esse é o seu link personalizado: <br />
                <span
                  style={{ fontWeight: "bold", cursor: 'pointer' }}
                  id="linkAgent"
                  value={`https://tegg.app/subscribe/${api?.currentUser?.MyFinalClientId}`}
                  onClick={generateLink}
                >
                  https://tegg.app/subscribe/{api?.currentUser?.MyFinalClientId}
                </span>
              </>
            ) : (
              <>
                Esse é o seu link personalizado: <br />
                <span
                  style={{ fontWeight: "bold", cursor: 'pointer' }}
                  id="linkDealer"
                  value={`https://tegg.app/subscribe/${api?.currentUser?.DealerId}`}
                  onClick={generateLink}
                >
                  https://tegg.app/subscribe/{api?.currentUser?.DealerId}
                </span>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalLink(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <input
        ref={fileRef}
        type="file"
        style={{ opacity: 0 }}
        onChange={() => {
          setFileConfirm(fileRef.current.files[0]);
        }}
        className="form-control"
      />
    </>
  );
};

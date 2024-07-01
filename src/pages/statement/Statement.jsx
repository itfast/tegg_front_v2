import { useEffect, useState } from "react";
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from "../../../globalStyles";
import Select from "react-select";
import ReactLoading from "react-loading";
import api from "../../services/api";
import {
  translateError,
  translateStatus,
  translateValue,
} from "../../services/util";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
} from "@mui/material";
import moment from "moment";
import { TableItens } from "../clients/new/NewClient.styles";
import { IoMdMore } from "react-icons/io";
import { toast } from "react-toastify";
import { InputSearch } from "../orders/OrdersPending.styles";
import { StatementMobile } from "./StatementMobile";
import { PageTitles } from '../../components/PageTitle/PageTitle'

export const Statement = () => {
  const [status, setStatus] = useState({ label: "Todos", value: "" });
  const [statement, setStatement] = useState([]);
  const [limit, setLimit] = useState({ label: "10", value: "10" });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalReceive, setModalReceive] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalRefund, setModalRefund] = useState(false);
  const [loading, setLoading] = useState(false);
  const [find, setFind] = useState("");
  const open = Boolean(anchorEl);
  const ITEM_HEIGHT = 48;

  const [tmpPayment, setTmpPayment] = useState();

  const handleClick = (event, value) => {
    setTmpPayment(value);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const search = () => {
    api.order
      .getStatement(limit.value, page, status.value, find)
      .then((res) => {
        setStatement(res.data?.payments);
        setTotal(res.data.meta?.totalPages);
      })
      .catch((err) => {
        translateError(err);
      });
  };

  useEffect(() => {
    search();
  }, [limit, page, status, find]);

  const returnClient = (client) => {
    if (client?.DealerPayer) {
      return client?.DealerPayer?.Name;
    } else {
      return client?.FinalClient?.Name || client?.Dealer?.Name;
    }
  };

  const receive = () => {
    setLoading(true);
    api.order
      .paymentMoney(tmpPayment.Id, tmpPayment.Amount)
      .then((res) => {
        toast.success(res.data.Message);
        setTmpPayment();
        setModalReceive(false);
        search();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteAction = () => {
    setLoading(true);
    api.order
      .deletePayment(tmpPayment.Id)
      .then((res) => {
        toast.success(res.data.Message);
        setTmpPayment();
        setModalDelete(false);
        search();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const refundAction = () => {
    setLoading(true);
    api.order
      .refundPayment(tmpPayment.Id)
      .then((res) => {
        toast.success(res.data.Message);
        setTmpPayment();
        setModalRefund(false);
        search();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    // <PageLayout>
    <>
      <ContainerWeb>
        <PageLayout>
        <PageTitles title='Extrato'/>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <h5 style={{ marginRight: 10 }}>STATUS</h5>
              <div style={{ width: "10rem" }}>
                <Select
                  name="pages"
                  id="page-select"
                  options={[
                    { label: "Todos", value: "" },
                    { label: "Pendente", value: "PENDING" },
                    { label: "Recebido", value: "RECEIVED" },
                    { label: "Confirmado", value: "CONFIRMED" },
                    {
                      label: "Recebido em dinheiro",
                      value: "RECEIVED_IN_CASH",
                    },
                    { label: "Atrasado", value: "OVERDUE" },
                    // {
                    //   label: 'Aguardando processamento',
                    //   value: 'AWAITINGPROCESSING',
                    // },
                  ]}
                  value={status}
                  onChange={(e) => {
                    setStatus(e);
                  }}
                />
              </div>
            </div>
            {/* <div> */}
            <InputSearch>
              <input
                placeholder="Cliente..."
                value={find}
                onChange={(e) => setFind(e.target.value)}
              />
              <img
                src="/assets/search4.png"
                style={{ marginRight: 10, zIndex: 11 }}
                // onClick={handleTypePass}
              />
            </InputSearch>
            {/* </div> */}
          </div>
          <TableItens style={{ marginTop: 20 }}>
            <tr>
              <th>Valor</th>
              <th>Criado</th>
              <th>Vencimento</th>
              <th>Pago em</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Previsão recebimento</th>
              <th>Cliente</th>
            </tr>
            {statement.length === 0 && (
              <tr>
                <td colSpan="7">
                  <h5 style={{ textAlign: "center" }}>Sem extrato</h5>{" "}
                </td>
              </tr>
            )}
            {statement.map((s) => (
              <tr key={s.Id} style={{ color: "#000" }}>
                <th style={{ fontWeight: "normal" }}>
                  {translateValue(s?.Amount)}
                </th>
                <th style={{ fontWeight: "normal" }}>
                  {moment(s?.CreatedAt).format("DD/MM/YYYY HH:mm")}
                </th>
                <th style={{ fontWeight: "normal" }}>
                  {moment(s?.DueDate).format("DD/MM/YYYY")}
                </th>
                <th style={{ fontWeight: "normal" }}>
                  {(s?.PaymentDate && s?.PaymentDate !== '') && moment(s?.PaymentDate).format("DD/MM/YYYY")}
                </th>
                <th style={{ fontWeight: "normal" }}>
                  {s.BillingType === "PIX"
                    ? "PIX"
                    : s.BillingType === "BOLETO"
                    ? "BOLETO"
                    : "CARTÃO DE CRÉDITO"}
                </th>
                <th style={{ fontWeight: "normal" }}>
                  {translateStatus(s.Status)}
                </th>
                <th style={{ fontWeight: "normal" }}>
                  {s.EstimatedCreditDate &&
                    moment(s.EstimatedCreditDate).format("DD/MM/YYYY")}
                </th>
                <th style={{ fontWeight: "normal" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>{returnClient(s.Order)}</div>
                    <div>
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? "long-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={(e) => handleClick(e, s)}
                        // onClick={() => console.log(ord)}
                      >
                        {/* <MoreVertIcon /> */}
                        <IoMdMore />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        MenuListProps={{
                          "aria-labelledby": "long-button",
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: "20ch",
                          },
                        }}
                      >
                        <MenuItem
                          disabled={
                            tmpPayment?.Status === "CONFIRMED" ||
                            tmpPayment?.Status === "RECEIVED" ||
                            tmpPayment?.Status === "RECEIVED_IN_CASH"
                          }
                          onClick={() => {
                            setAnchorEl(null);
                            setModalReceive(true);
                            // console.log(tmpPayment);
                          }}
                        >
                          Receber em dinheiro
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setAnchorEl(null);
                            setModalDelete(true);
                          }}
                        >
                          Deletar
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setAnchorEl(null);
                            setModalRefund(true);
                          }}
                        >
                          Estornar
                        </MenuItem>
                        {tmpPayment?.BillingType === "BOLETO" && (
                          <MenuItem
                            onClick={() => {
                              setAnchorEl(null);
                              window.open(tmpPayment?.BankSlipUrl, "_black");
                            }}
                          >
                            Boleto
                          </MenuItem>
                        )}
                        <MenuItem
                          disabled={!tmpPayment?.ReceiptFileUrl}
                          onClick={() => {
                            setAnchorEl(null);
                            window.open(
                              `https://teggtelecom.com/apihomolog/payment/files/${tmpPayment?.ReceiptFileUrl}`,
                              "_black"
                            );
                          }}
                        >
                          Comprovante
                        </MenuItem>
                      </Menu>
                    </div>
                  </div>
                </th>
              </tr>
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
              <p>Itens por página:</p>
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
                onChange={setLimit}
              />
            </div>
            <div>
              <Pagination
                count={total}
                page={page}
                onChange={(e, value) => {
                  setPage(value);
                }}
                variant="outlined"
                shape="rounded"
                size="large"
              />
            </div>
          </div>
        </PageLayout>
      </ContainerWeb>
      <ContainerMobile>
        <PageLayout>
        <PageTitles title='Extrato'/>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
              width: "100%",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <h5 style={{ marginRight: 10 }}>STATUS</h5>
              <div style={{ width: "100%" }}>
                <Select
                  name="pages"
                  id="page-select"
                  styles={{ width: "100%" }}
                  options={[
                    { label: "Todos", value: "" },
                    { label: "Pendente", value: "PENDING" },
                    { label: "Recebido", value: "RECEIVED" },
                    { label: "Confirmado", value: "CONFIRMED" },
                    {
                      label: "Recebido em dinheiro",
                      value: "RECEIVED_IN_CASH",
                    },
                    { label: "Atrasado", value: "OVERDUE" },
                    // {
                    //   label: 'Aguardando processamento',
                    //   value: 'AWAITINGPROCESSING',
                    // },
                  ]}
                  value={status}
                  onChange={(e) => {
                    setStatus(e);
                  }}
                />
              </div>
            </div>
            {/* <div> */}
            <InputSearch style={{ width: "100%", marginTop: "1rem" }}>
              <input
                placeholder="Cliente..."
                value={find}
                onChange={(e) => setFind(e.target.value)}
                style={{ width: "100%" }}
              />
              <img
                src="/assets/search4.png"
                style={{ marginRight: 10, zIndex: 11 }}
                // onClick={handleTypePass}
              />
            </InputSearch>
            {/* </div> */}
          </div>
          {/* <ContainerMobile style={{ width: "100%", height: "100%" }}> */}
              {statement.map((s) => (
                <StatementMobile
                  key={s.Id}
                  statement={s}
                  returnClient={returnClient}
                  search={search}
                  // setLoading={setLoadingDetails}
                  // setMsg={setMsg}
                  // getClients={getClients}
                />
              ))}
          <div
            style={{
              display: "flex",
              flexDirection: 'column',
              gap: 20,
              justifyContent: "center",
              alignItems: 'center',
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
              <p>Itens por página:</p>
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
                onChange={setLimit}
              />
            </div>
            <div>
              <Pagination
                count={total}
                page={page}
                onChange={(e, value) => {
                  setPage(value);
                }}
                variant="outlined"
                shape="rounded"
                size="large"
              />
            </div>
          </div>
        </PageLayout>
      </ContainerMobile>
      {/* RECEBER DINHEIRO */}
      <Dialog
        open={modalReceive}
        onClose={() => setModalReceive(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Recebimento</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ao confirmar um recebimento em dinheiro de uma cobrança que possua
            uma negativação em andamento uma taxa de ativação de serviço de
            negativação poderá ser cobrada. Deseja prosseguir?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalReceive(false)}>
            CANCELAR
          </Button>
          <Button notHover={loading} onClick={receive} autoFocus>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 15,
                }}
              >
                <ReactLoading type={"bars"} color={"#fff"} />
              </div>
            ) : (
              "RECEBER"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETAR */}
      <Dialog
        open={modalDelete}
        onClose={() => setModalDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Deletar</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja realmente excluir a cobrança (ASAAS) do cliente{" "}
            {tmpPayment &&
              returnClient(tmpPayment?.Order || tmpPayment?.PurchaseOrder)}{" "}
            no valor de {translateValue(tmpPayment?.Amount)}? Esta ação não
            podera ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalDelete(false)}>
            CANCELAR
          </Button>
          <Button
            notHover={loading}
            onClick={deleteAction}
            autoFocus
            style={{ backgroundColor: "red" }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 15,
                }}
              >
                <ReactLoading type={"bars"} color={"#fff"} />
              </div>
            ) : (
              "DELETAR"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ESTORNO */}
      <Dialog
        open={modalRefund}
        onClose={() => setModalRefund(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Estornar</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div
              style={{
                border: "1px dashed red",
                padding: "0.5rem",
                textAlign: "justify",
              }}
            >
              As taxas referentes à cobrança como a de compensação e de
              notificação não são devolvidas em caso de estorno. Portanto, caso
              você tenha acabado de receber uma cobrança em Pix e tente estornar
              o valor total, retornará erro e será necessário aumentar o próprio
              saldo para conseguir o estorno total.
            </div>{" "}
            <br />
            O estorno implicara também em remover o credito colocado na linha do
            cliente, caso esse pagamento seja referente a uma recarga.
            <br /> <br /> Deseja realemente estornar o pagamento do cliente{" "}
            {tmpPayment &&
              returnClient(tmpPayment?.Order || tmpPayment?.PurchaseOrder)}{" "}
            no valor de {translateValue(tmpPayment?.Amount)}? Esta ação não
            podera ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalRefund(false)}>
            CANCELAR
          </Button>
          <Button
            notHover={loading}
            onClick={refundAction}
            autoFocus
            style={{ backgroundColor: "red" }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 15,
                }}
              >
                <ReactLoading type={"bars"} color={"#fff"} />
              </div>
            ) : (
              "ESTORNAR"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

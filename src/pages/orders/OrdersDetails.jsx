import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from "../../../globalStyles";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { CardData, TableItens } from "./new/NewOrder.styles";
import { Chip } from "@mui/material";
import moment from "moment";
import {
  documentFormat,
  invertDate,
  phoneFormat,
  translateError,
  translatePaymentType,
  translateStatus,
  translateValue,
} from "../../services/util";
import { useTranslation } from "react-i18next";

export const OrdersDetails = () => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      api.order
        .getById(id)
        .then((res) => {
          console.log(res.data);
          setOrder(res.data);
        })
        .catch((err) => {
          translateError(err);
        });
    }
  }, []);

  const calcTotal = (itens) => {
    let tot = 0.0;
    itens?.forEach((item) => {
      tot += Number(item?.Amount);
    });
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(tot);
  };

  const hasIccids = (items) => {
    const has = items?.some((item) => item?.TrackerIccid?.length > 0);
    return has;
  };

  const hasSimcard = (items) => {
    const has = items?.some((item) =>
      item?.TrackerIccid?.some((e) => !e?.Iccid?.LPAUrl)
    );
    return has;
  };

  const hasEsim = (items) => {
    const has = items?.some((item) =>
      item?.TrackerIccid?.some((e) => e?.Iccid?.LPAUrl)
    );
    return has;
  };

  return (
    // <ContainerWeb>
    <PageLayout>
      <Button onClick={() => navigate("/orders")}>{t('Order.details.goback')}</Button>
      <div style={{ padding: "1rem" }}>
        <CardData>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            {t('Order.details.created')}:{" "}
            {moment(order[0]?.CreatedAt).format("DD/MM/YYYY HH:mm")}
          </div>
          {/* CLIENTE */}
          <div className="header_container">
            <div className="column-100">
              <h4>{t('Order.details.client')}</h4>
              <div className="header_content">
                <div>
                  <label style={{ fontWeight: "bold" }}>{t('Order.details.name')}</label>
                  <p>
                    {order[0]?.FinalClientId
                      ? order[0]?.FinalClient?.Name
                      : order[0]?.DealerPayer?.Name}
                  </p>
                </div>
                <div>
                  <label style={{ fontWeight: "bold" }}>{t('Order.details.email')}</label>
                  <p style={{ wordWrap: "anywhere" }}>
                    {order[0]?.FinalClientId
                      ? order[0]?.FinalClient?.Email
                      : order[0]?.DealerPayer?.Email}
                  </p>
                </div>
                <div></div>
                <div>
                  <label style={{ fontWeight: "bold" }}>{t('Order.details.contact')}</label>
                  <p>
                    {order[0]?.FinalClientId
                      ? order[0]?.FinalClient?.Mobile
                      : order[0]?.DealerPayer?.Mobile}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pagamento */}
          {order[0]?.Payments?.length > 0 && (
            <div className="header_container" style={{ marginTop: "0.5rem" }}>
              <div className="column-100">
                <h4>{t('Order.details.payment')}</h4>
                <div className="header_content">
                  <div>
                    <label style={{ fontWeight: "bold" }}>{t('Order.details.paymentType')}</label>
                    <p>
                      {
                        order[0]?.Payments &&
                          translatePaymentType(
                            order[0]?.Payments[0]?.BillingType
                          )
                        // : order[0]?.DealerPayer?.Name
                      }
                    </p>
                  </div>
                  <div>
                    <label style={{ fontWeight: "bold" }}>{t('Order.details.paymentDate')}</label>
                    <p style={{ wordWrap: "anywhere" }}>
                      {order[0]?.Payments[0]?.ClientPaymentDate && invertDate(order[0]?.Payments[0]?.ClientPaymentDate)}
                    </p>
                  </div>
                  <div></div>
                  <div>
                    <label style={{ fontWeight: "bold" }}>{t('Order.details.paymentStatus')}</label>
                    <p style={{ wordWrap: "anywhere" }}>
                      {order[0]?.Payments &&
                        translateStatus(order[0]?.Payments[0]?.Status)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <ContainerWeb style={{ width: "100%" }}>
            <div className="header_container" style={{ marginTop: "0.5rem" }}>
              <div className="column-100">
                <h4>{t('Order.details.products')}</h4>
                <div className="header_content">
                  <div style={{ width: "100%" }}>
                    <TableItens>
                      <tr>
                        <th>{t('Order.details.table.item')}</th>
                        <th>{t('Order.details.table.price')}</th>
                        <th>{t('Order.details.table.quantity')}</th>
                        <th>{t('Order.details.table.total')}</th>
                      </tr>
                      {order[0]?.OrderItems?.map((i) => (
                        <>
                          <tr key={i.Id}>
                            <td>{i?.Plan?.Name}</td>
                            <td>
                              {i?.Plan?.Amount &&
                                new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(i?.Plan?.Amount)}
                            </td>
                            <td>{i?.Quantity}</td>
                            <td>
                              {i?.Amount &&
                                new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(i?.Amount)}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="5">
                              <div
                                style={{
                                  marginLeft: 10,
                                  color: "black",
                                  display: "grid",
                                  gridTemplateColumns: "auto auto",
                                }}
                              >
                                <div style={{ width: "100%" }}>
                                {t('Order.details.table.products')}
                                  {i?.Plan?.Products?.map((c) => (
                                    <div key={c}>
                                      <span key={c.Id}>
                                        {c?.Product?.Name} -{" "}
                                        {translateValue(c?.Product?.Amount)}
                                      </span>
                                      <br />
                                    </div>
                                  ))}
                                </div>
                                {i?.ActivationDdd && i?.ActivationDoc && (
                                  <div style={{ width: "100%" }}>
                                    {t('Order.details.table.preActivation')}
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "start",
                                        gap: 10,
                                        width: "100%",
                                      }}
                                    >
                                      <div>{t('Order.details.table.ddd')}: {i?.ActivationDdd}</div>
                                      <div>{t('Order.details.table.document')}: {i?.ActivationDoc}</div>
                                    </div>
                                  </div>
                                )}
                                {i?.PortIn && (
                                  <div style={{ width: "100%" }}>
                                    {t('Order.details.table.portin')}
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "start",
                                        gap: 10,
                                      }}
                                    >
                                      <div>{t('Order.details.table.name')}: {i?.PortName}</div>
                                      <div>
                                      {t('Order.details.table.document')}: {documentFormat(i?.UserDoc)}
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "start",
                                        gap: 10,
                                      }}
                                    >
                                      <div>
                                      {t('Order.details.table.line')}: {phoneFormat(i?.Mobile)}
                                      </div>
                                      <div>{t('Order.details.table.operator')}: {i?.MobileOperator}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {/* </div> */}
                            </td>
                          </tr>
                        </>
                      ))}
                      {order[0]?.OrderItems?.length > 0 && (
                        <tr>
                          <td />
                          <td />
                          <td />
                          <td>{calcTotal(order[0]?.OrderItems)}</td>
                        </tr>
                      )}
                    </TableItens>
                  </div>
                </div>
              </div>
            </div>
          </ContainerWeb>
          <ContainerMobile
            style={{
              width: "100%",
              height: "100%",
              border: "1px solid #00d959",
              borderRadius: "8px",
              padding: "1rem",
              marginTop: "0.5rem",
            }}
          >
            <div
              // className='header_container'
              style={{
                marginTop: "0.5rem",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <h4>{t('Order.details.table.products')}</h4>
              {order[0]?.OrderItems?.map((o) => (
                <div
                  key={o.Id}
                  style={{
                    width: "90%",
                    backgroundColor: "#00D959",
                    textAlign: "center",
                    // color: '#3d3d3d',
                    padding: "0.5rem",
                    margin: "auto",
                    borderRadius: "8px",
                    marginTop: "0.2rem",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "16px",
                    }}
                  >
                    {/* <h5>icone</h5> */}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "16px",
                    }}
                  >
                    {/* <h5>icone</h5> */}
                  </div>
                  <h4 style={{ padding: "0.2rem", fontWeight: "bold" }}>
                    {o?.Plan?.Name}
                  </h4>
                  <h5>
                  {t('Order.details.table.unit')}:{" "}
                    {o?.Plan?.Amount &&
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(o?.Plan?.Amount)}
                  </h5>
                  <h5>{t('Order.details.table.qtd')}: {o?.Quantity}</h5>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <h4>{`${t('Order.details.table.total')}: ${
                      o?.Amount &&
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(o?.Amount)
                    }`}</h4>
                  </div>
                </div>
              ))}
            </div>
          </ContainerMobile>
          {/* </div>
            </div>
          </div> */}

          {/* ICCIDS */}
          {hasIccids(order[0]?.OrderItems) && (
            <div className="header_container" style={{ marginTop: "0.5rem" }}>
              <div className="column-100">
                <h4>ICCIDS</h4>
                {hasSimcard(order[0]?.OrderItems) && (
                  <>
                    <div className="header_content">
                      <div>
                        <label style={{ fontWeight: "bold" }}>{t('Order.details.table.sinCard')}</label>
                      </div>
                    </div>
                    <div
                      className="header_content"
                      style={{ justifyContent: "start" }}
                    >
                      {order[0]?.OrderItems?.map((p) =>
                        p?.TrackerIccid?.map(
                          (o) =>
                            !o?.Iccid?.LPAUrl && (
                              <div key={o?.Id}>
                                <p>
                                  <Chip
                                    sx={{
                                      margin: "1px",
                                      backgroundColor: "#00D959",
                                      color: "#fff",
                                      "& .MuiChip-deleteIcon": {
                                        color: "red",
                                        backgroundColor: "white",
                                        borderRadius: "50%",
                                      },
                                    }}
                                    key={o?.IccidId}
                                    label={o?.IccidId}
                                  />
                                </p>
                              </div>
                            )
                        )
                      )}
                    </div>
                  </>
                )}

                {hasEsim(order[0]?.OrderItems) && (
                  <>
                    <div className="header_content">
                      <div>
                        <label style={{ fontWeight: "bold" }}>{t('Order.details.table.esim')}</label>
                      </div>
                    </div>
                    <div
                      className="header_content"
                      style={{ justifyContent: "start" }}
                    >
                      {order[0]?.OrderItems?.map((p) =>
                        p?.TrackerIccid?.map(
                          (o) =>
                            o?.Iccid?.LPAUrl && (
                              <div key={o?.Id}>
                                <p>
                                  <Chip
                                    sx={{
                                      margin: "1px",
                                      backgroundColor: "#00D959",
                                      color: "#fff",
                                      "& .MuiChip-deleteIcon": {
                                        color: "red",
                                        backgroundColor: "white",
                                        borderRadius: "50%",
                                      },
                                    }}
                                    key={o?.IccidId}
                                    label={o?.IccidId}
                                  />
                                </p>
                              </div>
                            )
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ENDEREÇO */}
          {order[0]?.FreightStreetName && (
            <div className="header_container" style={{ marginTop: "0.5rem" }}>
              <div className="column-100">
                <h4>{t('Order.details.table.address')}</h4>
                <div className="header_content">
                  <div>
                    <label style={{ fontWeight: "bold" }}>
                    {t('Order.details.table.addressForeight')}
                    </label>
                    <p>
                      {order[0]?.FreightStreetName}, {order[0]?.FreightNumber} -{" "}
                      {order[0]?.FreightDistrict} - {order[0]?.FreightCity} -{" "}
                      {order[0]?.FreightState}
                    </p>
                    <p>{order[0]?.FreightComplement}</p>
                    <p>{order[0]?.FreightPostalCode}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardData>
      </div>
      {/* </ContainerDetails> */}
    </PageLayout>
    // </ContainerWeb>
  );
};

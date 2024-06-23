/* eslint-disable react/prop-types */
import { FaUsers } from "react-icons/fa";
import { BiSolidStoreAlt } from "react-icons/bi";
import { GiMoneyStack, GiTakeMyMoney } from "react-icons/gi";
import "./tegg_metrics.css";
import ReactLoading from "react-loading";
import api from "../../services/api";
import { useTranslation } from "react-i18next";

export const TeggMetrics = ({
  totalClients,
  totalCreated,
  totalActive,
  totalDealers,
  orderMetrics,
  loadingClients,
  loadingDealers,
  loadingMetrics,
}) => {
	const {t} = useTranslation()
  const translateValue = (value) => {
    let converted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));
    return converted;
  };

  return (
    <>
      {/* VENDAS CHIP */}
      <div className="card_container">
        {api.currentUser.AccessTypes[0] !== "CLIENT" && api.currentUser.AccessTypes[0] !== "AGENT"  && (
          <div className="card">
            <div className="card_title">
              <h4>
                {`${
                  (api.currentUser.AccessTypes[0] !== "CLIENT" && api.currentUser.AccessTypes[0] !== "AGENT") 
                    ? t('Metrics.sales')
                    : t('Metrics.purchases')
                }`}
              </h4>
            </div>
            <div className="card_content_box">
              <div className="card_icon">
                <GiMoneyStack size={50} color="#00D959" />
              </div>
              <hr />
              <div className="card_content">
                {/* <hr style={{ width: '50%' }} /> */}
                {/* style={{wordBreak: 'break-all'}} */}
                <h1>
                  {!loadingMetrics ? (
                    translateValue(
                      orderMetrics.Chips.Total.ConfirmedOrders +
                        orderMetrics.Chips.Total.ReceivedOrders
                    )
                  ) : (
                    <div className="loading">
                      <ReactLoading type={"bars"} color={"#000"} />
                    </div>
                  )}
                </h1>
                <h5>
                  {t('Metrics.total')}{" "}
                  {(api.currentUser.AccessTypes[0] !== "CLIENT" && api.currentUser.AccessTypes[0] !== "AGENT") 
                    ? t('Metrics.salesDownCase')
                    : t('Metrics.purchaseDownCase')}{" "}
                  {t('Metrics.accumulated')}
                </h5>
              </div>
            </div>
          </div>
        )}
        {api.currentUser.AccessTypes[0] !== "CLIENT" && api.currentUser.AccessTypes[0] !== "AGENT" && (
          <div className="card">
            <div className="card_title">
              <h4>
                {(api.currentUser.AccessTypes[0] !== "CLIENT" && api.currentUser.AccessTypes[0] !== "AGENT")
                  ? t('Metrics.sales')
                  : t('Metrics.purchases')}{" "}
                {t('Metrics.month')}
              </h4>
            </div>
            <div className="card_content_box">
              <div className="card_icon">
                <GiTakeMyMoney size={50} color="#00D959" />
              </div>
              <hr />
              <div className="card_content">
                <h1>
                  {!loadingMetrics ? (
                    translateValue(
                      orderMetrics.Chips.Month.ConfirmedOrders +
                        orderMetrics.Chips.Month.ReceivedOrders
                    )
                  ) : (
                    <div className="loading">
                      <ReactLoading type={"bars"} color={"#000"} />
                    </div>
                  )}
                </h1>
                <h5>
                  {t('Metrics.total')}{" "}
                  {(api.currentUser.AccessTypes[0] !== "CLIENT" && api.currentUser.AccessTypes[0] !== "AGENT")
                    ? t('Metrics.salesDownCase')
                    : t('Metrics.purchaseDownCase')}{" "}
                  {t('Metrics.monthDownCase')}
                </h5>
              </div>
            </div>
          </div>
        )}
        <div className="card">
          <div className="card_title">
            <h4>{t('Metrics.recharges')}</h4>
          </div>
          <div className="card_content_box">
            <div className="card_icon">
              <GiMoneyStack size={50} color="#00D959" />
            </div>
            <hr />
            <div className="card_content">
              {/* <hr style={{ width: '50%' }} /> */}
              <h1>
                {!loadingMetrics ? (
                  translateValue(
                    orderMetrics.Recharges.Total.ConfirmedOrders +
                      orderMetrics.Recharges.Total.ReceivedOrders
                  )
                ) : (
                  <div className="loading">
                    <ReactLoading type={"bars"} color={"#000"} />
                  </div>
                )}
              </h1>
              <h5>{t('Metrics.rechargesAccumulated')}</h5>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card_title">
            <h4>{t('Metrics.rechargesMonth')}</h4>
          </div>
          <div className="card_content_box">
            <div className="card_icon">
              <GiTakeMyMoney size={50} color="#00D959" />
            </div>
            <hr />
            <div className="card_content">
              {/* <hr style={{ width: '50%' }} /> */}
              <h1>
                {!loadingMetrics ? (
                  translateValue(
                    orderMetrics.Recharges.Month.ConfirmedOrders +
                      orderMetrics.Recharges.Month.ReceivedOrders
                  )
                ) : (
                  <div className="loading">
                    <ReactLoading type={"bars"} color={"#000"} />
                  </div>
                )}
              </h1>
              <h5>{t('Metrics.rechargesAccumulatedMonth')}</h5>
            </div>
          </div>
        </div>
      </div>
      {/* CLIENTES E REVENDAS */}
      {(api.currentUser.AccessTypes[0] !== "CLIENT" && api.currentUser.AccessTypes[0] !== "AGENT") && (
        <div className="card_container">
          {api.currentUser.AccessTypes[0] === "TEGG" &&
            location.pathname !== "/salesforce/details" && (
              <div className="card">
                <div className="card_title">
                  <h4>{t('Metrics.resales')}</h4>
                </div>

                <div className="card_content_box">
                  <div className="card_icon">
                    <BiSolidStoreAlt size={50} color="#00D959" />
                  </div>
                  <hr />
                  <div className="card_content">
                    {/* <hr style={{ width: '50%' }} /> */}
                    {!loadingDealers ? (
                      <h1>{totalDealers}</h1>
                    ) : (
                      <div className="loading">
                        <ReactLoading type={"bars"} color={"#000"} />
                      </div>
                    )}
                    <h5>{t('Metrics.resalesActives')}</h5>
                  </div>
                </div>
              </div>
            )}
          <div className="card">
            <div className="card_title">
              <h4>{t('Metrics.newClients')}</h4>
            </div>
            <div className="card_content_box">
              <div className="card_icon">
                <FaUsers size={50} color="#00D959" />
              </div>
              <hr />
              <div className="card_content">
                {!loadingClients ? (
                  <h1>{totalCreated}</h1>
                ) : (
                  <div className="loading">
                    <ReactLoading type={"bars"} color={"#000"} />
                  </div>
                )}
                <h5>{t('Metrics.newClientsMonth')}</h5>
                {/* <hr style={{ width: '50%' }} /> */}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card_title">
              <h4>{t('Metrics.clientsActives')}</h4>
            </div>
            <div className="card_content_box">
              <div className="card_icon">
                <FaUsers size={50} color="#00D959" />
              </div>
              <hr />
              <div className="card_content">
                {!loadingClients ? (
                  <h1>{totalActive}</h1>
                ) : (
                  <div className="loading">
                    <ReactLoading type={"bars"} color={"#000"} />
                  </div>
                )}
                <h5>{t('Metrics.totalClientsActives')}</h5>
                {/* <hr style={{ width: '50%' }} /> */}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card_title">
              <h4>{t('Metrics.totalClients')}</h4>
            </div>
            <div className="card_content_box">
              <div className="card_icon">
                <FaUsers size={50} color="#00D959" />
              </div>
              <hr />
              <div className="card_content">
                {!loadingClients ? (
                  <h1>{totalClients}</h1>
                ) : (
                  <div className="loading">
                    <ReactLoading type={"bars"} color={"#000"} />
                  </div>
                )}
                <h5>{t('Metrics.totalForClients')}</h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

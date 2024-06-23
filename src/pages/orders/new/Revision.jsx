import { toast } from 'react-toastify';
import { Button } from '../../../../globalStyles';
import api from '../../../services/api';
import {
  cleanNumber,
  qtdChips,
  translateError,
  translateValue,
} from '../../../services/util';
import { CardData, TableItens } from './NewOrder.styles';
import Chip from '@mui/material/Chip';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { useTranslation } from 'react-i18next';

/* eslint-disable react/prop-types */
export const Revision = ({
  automatic,
  orderItems,
  buyer,
  address,
  stoke,
  otherSend,
  goBackStep,
  typeOrder,
  plan,
}) => {
  const {t} = useTranslation()
  const [loading, setLoading] = useState(false);
  const [selectedEsim, setSelectedEsim] = useState([]);
  const [selectedSinCard, setSelectedSinCard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const listSincard = [];
    const listEsim = [];
    orderItems.forEach((oi) => {
      oi.iccids.forEach((iccid) => {
        if (iccid.type === 'sincard') {
          listSincard.push(iccid);
        } else {
          listEsim.push(iccid);
        }
      });
    });
    setSelectedEsim(listEsim);
    setSelectedSinCard(listSincard);
  }, [orderItems]);

  const qtdFinal = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt = qt + Number(qtdChips(it?.Products)) * it?.qtdItens;
    });
    return qt;
  };

  const priceFinal = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt = qt + it.finalPrice;
    });
    return translateValue(qt);
  };

  const qtdSinCards = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt =
        qt +
        Number(it?.qtdSinCard !== '' ? (it.qtdSinCard ? it.qtdSinCard : 0) : 0);
    });
    return qt;
  };
  const qtdESims = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt = qt + Number(it?.qtdEsim !== '' ? (it.qtdEsim ? it.qtdEsim : 0) : 0);
    });
    return qt;
  };

  const handleCreateOrder = () => {
    setLoading(true);
    api.order
      .create(
        buyer?.type === 'client' ? buyer?.value : null,
        api.currentUser.AccessTypes[0] === 'DEALER'
          ? api.currentUser?.DealerId
          : null,
        0,
        stoke === 'Transportadora',
        0,
        address,
        automatic
      )
      .then((res) => {
        setLoading(true);
        if (res.status == 201) {
          let orderId = res.data.OrderId;
          if (typeOrder === 'unit') {
            orderItems.forEach((item) => {
              const listIccid = [];
              item.iccids.forEach((item) => {
                listIccid.push(item.value);
              });
              api.order
                .addItem(
                  item.value,
                  item.qtdItens,
                  orderId,
                  item.Amount,
                  listIccid,
                  item?.qtdEsim !== '' ? item.qtdEsim : 0,
                  item?.qtdSinCard !== '' ? item.qtdSinCard : 0,
                  item?.portIn?.portIn,
                  null,
                  null,
                  item?.automatic?.isAutomatic ? item?.automatic?.ddd : null,
                  item?.automatic?.isAutomatic
                    ? cleanNumber(item.automatic?.cpf)
                    : null,
                  item?.portIn?.portIn
                    ? cleanNumber(item?.portIn?.oldNumber)
                    : null,
                  item?.portIn?.portIn ? item?.portIn?.operator : null,
                  item?.portIn?.portIn ? cleanNumber(item?.portIn?.cpf) : null,
                  item?.portIn?.portIn ? item?.portIn?.name : null
                )
                .then(() => {
                  toast.success(t('Order.new.review.msgSuccessItem'));
                  navigate('/orders');
                })
                .catch((err) => {
                  translateError(err);
                })
                .finally(() => setLoading(false));
            });
          } else {
            console.log('planilha');
            api.order
              .addPlan(orderId, plan)
              .then(() => {
                toast.success(t('Order.new.review.msgSuccessItem'));
                navigate('/orders');
              })
              .catch((err) => {
                translateError(err);
              })
              .finally(() => setLoading(false));
          }
        }
      })
      .catch((err) => {
        translateError(err);
        setLoading(false);
      });
  };

  return (
    <CardData>
      <h5>{t('Order.new.review.title')}</h5>
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h4>{t('Order.new.review.seller')}</h4>
            <h5>
              {buyer.type === 'client'
                ? `${t('Order.new.review.client')}: ${buyer?.label}`
                : `${t('Order.new.review.resale')}: ${buyer?.label}`}
            </h5>
          </div>
          <div>
            <h4>{t('Order.new.review.send')}</h4>
            <h5>
              {stoke === 'local'
                ? t('Order.new.review.sendByTegg')
                : t('Order.new.review.sendBySpeedFlow')}
            </h5>
          </div>
        </div>
        <h4 style={{ marginTop: '0.5rem' }}>{t('Order.new.review.delivery')}</h4>
        <h5>
          {otherSend === 'mãos' && address?.cep === ''
            ? t('Order.new.review.hands')
            : `${t('Order.new.review.street')}: ${address?.address},${address?.number}, ${t('Order.new.review.neighborhood')}: ${address?.district}, ${t('Order.new.review.city')}: ${address?.city} - ${address?.uf} - ${t('Order.new.review.postalCode')}: ${address?.cep}`}
        </h5>
        <h4 style={{ marginTop: '0.5rem' }}>{t('Order.new.review.itensForOrder')}</h4>
        {typeOrder === 'unit' && (
          <>
          {screen.width < 768 ? (
            <>
            {orderItems.length === 0 ? (
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#00D959',
                  textAlign: 'center',
                  color: 'white',
                  marginTop: '0.2rem',
                  minHeight: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <h5>{t('Order.new.review.notHaveItens')}</h5>
              </div>
            ) : (
              orderItems.map((o) => (
                <div
                  key={o.value}
                  style={{
                    width: '90%',
                    backgroundColor: '#00D959',
                    textAlign: 'center',
                    color: 'white',
                    padding: '0.5rem',
                    margin: 'auto',
                    borderRadius: '8px',
                    marginTop: '0.2rem',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '16px',
                    }}
                  >
                  </div>
                  <div
                    style={{ position: 'absolute', top: '8px', left: '16px' }}
                  >

                  </div>
                  <h3 style={{ padding: '0.2rem', fontWeight: 'bold' }}>
                    {o.label}
                  </h3>
                  <h5>{`${t('Order.new.review.price')}: ${translateValue(o.Amount)}`}</h5>
                  <h5>{`${t('Order.new.review.quantity')}: ${o.qtdItens}`}</h5>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                  >
                    <h5>{`${t('Order.new.review.sinCard')}: ${
                      o?.qtdSinCard === '' || !o?.qtdSinCard
                        ? '0'
                        : o?.qtdSinCard
                    }`}</h5>
                    <h5>{`${t('Order.new.review.esim')}: ${
                      o?.qtdEsim === '' || !o?.qtdEsim ? '0' : o?.qtdEsim
                    }`}</h5>
                  </div>
                  {o?.portIn?.portIn && (
                    <div style={{ width: '100%' }}>
                      <h4>{t('Order.new.review.portin')}</h4>
                      <h5>{t('Order.new.review.name')}: {o?.portIn?.name}</h5>
                      <h5>{t('Order.new.review.document')}: {o?.portIn?.cpf}</h5>
                      <h5>{t('Order.new.review.line')}: {o?.portIn?.oldNumber}</h5>
                      <h5>{t('Order.new.review.operator')}: {o?.portIn?.operator}</h5>
                    </div>
                  )}
                  {o?.automatic?.isAutomatic && (
                    <div style={{ width: '100%' }}>
                      <h4>{t('Order.new.review.preActivation')}</h4>
                      <h5>{t('Order.new.review.ddd')}: {o?.automatic?.ddd}</h5>
                      <h5>{t('Order.new.review.document')}: {o?.automatic?.cpf}</h5>
                    </div>
                  )}
                  <h4
                    style={{ marginTop: '0.2rem' }}
                  >{`${t('Order.new.review.total')}: ${translateValue(o.finalPrice)}`}</h4>
                </div>
              ))
            )}
            </>
          ) : (
            <>
            <div style={{ overflowX: window.innerWidth < 768 && 'scroll' }}>
            <TableItens>
              <tr>
                <th>Item</th>
                {window.innerWidth > 768 && <th>{t('Order.new.review.price')}</th>}
                {window.innerWidth > 768 && <th>{t('Order.new.review.quantityItens')}</th>}
                {window.innerWidth > 768 && <th>{t('Order.new.review.quantityIccids')}</th>}
                <th>{t('Order.new.review.total')}</th>
              </tr>
              {orderItems.length === 0 && (
                <tr>
                  {window.innerWidth > 768 && <td />}
                  {window.innerWidth > 768 && <td />}
                  {window.innerWidth > 768 && <td />}
                  <td />
                  <td />
                </tr>
              )}
              {orderItems.map((m, i) => (
                <>
                  <tr key={i}>
                    <td>{m.label}</td>
                    {window.innerWidth > 768 && (
                      <td>{translateValue(m.Amount)}</td>
                    )}
                    {window.innerWidth > 768 && <td>{m.qtdItens}</td>}
                    {window.innerWidth > 768 && (
                      <td>
                        <div>
                          {Number(m?.qtdSinCard) > 0 && (
                            <div>{t('Order.new.review.sinCard')}: {m?.qtdSinCard}</div>
                          )}
                          {Number(m?.qtdEsim) > 0 && (
                            <div>{t('Order.new.review.esim')}: {m?.qtdEsim}</div>
                          )}
                        </div>
                      </td>
                    )}
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <p>{translateValue(m.finalPrice)}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan='5'>
                      <div
                        style={{
                          marginLeft: 10,
                          color: 'black',
                          display: 'grid',
                          gridTemplateColumns: 'auto auto',
                        }}
                      >
                        <div style={{ width: '100%' }}>
                        {t('Order.new.review.products')}
                          {m?.Products?.map((c) => (
                            <div key={c}>
                              <span key={c.Id}>
                                {c?.Product?.Name} -{' '}
                                {translateValue(c?.Product?.Amount)}
                              </span>
                              <br />
                            </div>
                          ))}
                        </div>
                        {m?.automatic?.isAutomatic && (
                          <div style={{ width: '100%' }}>
                            {t('Order.new.review.preActivation')}
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'start',
                                gap: 10,
                                width: '100%',
                              }}
                            >
                              <div>{t('Order.new.review.ddd')}: {m?.automatic?.ddd}</div>
                              <div>{t('Order.new.review.document')}: {m?.automatic?.cpf}</div>
                            </div>
                          </div>
                        )}
                        {m?.portIn?.portIn && (
                          <div style={{ width: '100%' }}>
                            {t('Order.new.review.portin')}
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'start',
                                gap: 10,
                              }}
                            >
                              <div>{t('Order.new.review.name')}: {m?.portIn?.name}</div>
                              <div>{t('Order.new.review.document')}: {m?.portIn?.cpf}</div>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'start',
                                gap: 10,
                              }}
                            >
                              <div>{t('Order.new.review.line')}: {m?.portIn?.oldNumber}</div>
                              <div>{t('Order.new.review.operator')}: {m?.portIn?.operator}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </>
              ))}
              {orderItems.length > 0 && (
                <>
                  <tr>
                    <td />
                    {window.innerWidth > 768 && <td />}
                    <td>{qtdFinal(orderItems)}</td>
                    {window.innerWidth > 768 && (
                      <td>
                        <div>
                          {qtdSinCards(orderItems) > 0 && (
                            <div>{t('Order.new.review.sinCard')}: {qtdSinCards(orderItems)}</div>
                          )}
                          {qtdESims(orderItems) > 0 && (
                            <div>{t('Order.new.review.esim')}: {qtdESims(orderItems)}</div>
                          )}
                        </div>
                      </td>
                    )}
                    <td>{priceFinal(orderItems)}</td>
                  </tr>
                </>
              )}
            </TableItens>
          </div>
            </>
          )}
          </>
        )}
        {typeOrder !== 'unit' && (
          <div>
            <h5>{t('Order.new.review.plan')}</h5>
            <h5>{plan?.name}</h5>
          </div>
        )}

        {selectedSinCard?.length > 0 && (
          <>
            <h4 style={{ marginTop: '0.5rem' }}>
            {t('Order.new.review.haveSinCards')}
            </h4>
            <div
              style={{
                marginTop: '0.5rem',
                maxHeight: '200px',
                overflowY: 'scroll',
              }}
            >
              {selectedSinCard.map((i) => (
                <Chip
                  sx={{
                    margin: '1px',
                    backgroundColor: '#00D959',
                    color: '#fff',
                    '& .MuiChip-deleteIcon': {
                      color: 'red',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                    },
                  }}
                  key={i}
                  label={i.value}
                />
              ))}
            </div>
          </>
        )}

        {selectedEsim.length > 0 && (
          <>
            <h4 style={{ marginTop: '0.5rem' }}>
            {t('Order.new.review.haveEsim')}
            </h4>
            <div
              style={{
                marginTop: '0.5rem',
                maxHeight: '200px',
                overflowY: 'scroll',
              }}
            >
              {selectedEsim.map((i) => (
                <Chip
                  sx={{
                    margin: '1px',
                    backgroundColor: '#00D959',
                    color: '#fff',
                    '& .MuiChip-deleteIcon': {
                      color: 'red',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                    },
                  }}
                  key={i}
                  label={i.value}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className='flex end btn_invert'>
        <Button onClick={goBackStep} style={{width: screen.width < 768 && '100%'}}>{t('Order.new.review.buttonGoback')}</Button>
        <Button
          notHover
          onClick={() => {
            setLoading(true);
            handleCreateOrder();
          }}
          style={{width: screen.width < 768 && '100%'}}
        >
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 15,
              }}
            >
              <ReactLoading type={'bars'} color={'#fff'} />
            </div>
          ) : (
             t('Order.new.review.buttonCreateOrder')
          )}
        </Button>
      </div>
    </CardData>
  );
};

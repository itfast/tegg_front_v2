import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from '../../../globalStyles';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { CardData, TableItens } from './new/NewOrder.styles';
import { Chip } from '@mui/material';
import moment from 'moment';
import { translateError } from '../../services/util';

export const OrdersPendingDetails = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      api.purchaseorder
        .getById(id)
        .then((res) => {
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
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
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
      <Button onClick={() => navigate('/orders/pending')}>Voltar</Button>
      <div style={{ padding: '1rem' }}>
        <CardData>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            PEDIDO CRIADO: {moment(order?.CreatedAt).format('DD/MM/YYYY HH:mm')}
          </div>
          {/* CLIENTE */}
          <div className='header_container'>
            <div className='column-100'>
              <h4>CLIENTE</h4>
              <div className='header_content'>
                <div>
                  <label style={{ fontWeight: 'bold' }}>NOME</label>
                  <p>{order?.CreateByUsr?.Name}</p>
                </div>
                <div>
                  <label style={{ fontWeight: 'bold' }}>Email</label>
                  <p style={{ wordWrap: 'anywhere' }}>
                    {order?.CreateByUsr?.Email}
                  </p>
                </div>
                <div>
                  {/* <label style={{ fontWeight: 'bold' }}>
                    {data.Cnpj ? 'CNPJ' : 'CPF'}
                  </label> */}
                  {/* <p style={{ wordWrap: 'anywhere' }}>
                    {(data.Cnpj || data.Cpf) &&
                      documentFormat(data.Cnpj || data.Cpf)}
                  </p> */}
                </div>
                <div>
                  <label style={{ fontWeight: 'bold' }}>CONTATO</label>
                  <p>
                    {order?.CreateByUsr?.Type === 'CLIENT'
                      ? order?.FinalClient?.Mobile
                      : order?.Dealer?.Mobile}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUTOS */}
          {/* <div className='header_container' style={{ marginTop: '0.5rem' }}>
            <div className='column-100' >
              <h4>PRODUTOS</h4>
              <div className='header_content'> */}
          <ContainerWeb style={{ width: '100%' }}>
            <div className='header_container' style={{ marginTop: '0.5rem' }}>
              <div className='column-100'>
                <h4>PRODUTOS</h4>
                <div className='header_content'>
                  <div style={{ width: '100%' }}>
                    <TableItens>
                      <tr>
                        <th>Item</th>
                        <th>Preço unitário</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                      </tr>
                      {order?.PurchaseOrderItems?.map((i) => (
                        <tr key={i.Id}>
                          <td>{i?.Plan?.Name}</td>
                          <td>
                            {i?.Plan?.Amount &&
                              new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(i?.Plan?.Amount)}
                          </td>
                          <td>{i?.Quantity}</td>
                          <td>
                            {i?.Amount &&
                              new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(i?.Amount)}
                          </td>
                        </tr>
                      ))}
                      {order?.PurchaseOrderItems.length > 0 && (
                        <tr>
                          <td />
                          <td />
                          <td />
                          <td>{calcTotal(order?.PurchaseOrderItems)}</td>
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
              width: '100%',
              height: '100%',
              border: '1px solid #00d959',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '0.5rem',
            }}
          >
            <div
              // className='header_container'
              style={{
                marginTop: '0.5rem',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <h4>Produtos</h4>
              {order?.PurchaseOrderItems?.map((o) => (
                <div
                  key={o.Id}
                  style={{
                    width: '90%',
                    backgroundColor: '#00D959',
                    textAlign: 'center',
                    // color: '#3d3d3d',
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
                    {/* <h5>icone</h5> */}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '16px',
                    }}
                  >
                    {/* <h5>icone</h5> */}
                  </div>
                  <h4 style={{ padding: '0.2rem', fontWeight: 'bold' }}>
                    {o?.Plan?.Name}
                  </h4>
                  <h5>
                    UN:{' '}
                    {o?.Plan?.Amount &&
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(o?.Plan?.Amount)}
                  </h5>
                  <h5>QTD: {o?.Quantity}</h5>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                  >
                    <h4>{`TOTAL: ${
                      o?.Amount &&
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
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
          {hasIccids(order?.PurchaseOrderItems) && (
            <div className='header_container' style={{ marginTop: '0.5rem' }}>
              <div className='column-100'>
                <h4>ICCIDS</h4>
                {hasSimcard(order?.PurchaseOrderItems) && (
                  <>
                    <div className='header_content'>
                      <div>
                        <label style={{ fontWeight: 'bold' }}>SIMCARD</label>
                      </div>
                    </div>
                    <div
                      className='header_content'
                      style={{ justifyContent: 'start' }}
                    >
                      {order?.PurchaseOrderItems?.map((p) =>
                        p?.TrackerIccid?.map(
                          (o) =>
                            !o?.Iccid?.LPAUrl && (
                              <div key={o?.Id}>
                                <p>
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

                {hasEsim(order?.PurchaseOrderItems) && (
                  <>
                    <div className='header_content'>
                      <div>
                        <label style={{ fontWeight: 'bold' }}>E-SIM</label>
                      </div>
                    </div>
                    <div
                      className='header_content'
                      style={{ justifyContent: 'start' }}
                    >
                      {order?.PurchaseOrderItems?.map((p) =>
                        p?.TrackerIccid?.map(
                          (o) =>
                            o?.Iccid?.LPAUrl && (
                              <div key={o?.Id}>
                                <p>
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
          {order?.FreightStreetName && (
            <div className='header_container' style={{ marginTop: '0.5rem' }}>
              <div className='column-100'>
                <h4>ENDEREÇO</h4>
                <div className='header_content'>
                  <div>
                    <label style={{ fontWeight: 'bold' }}>
                      ENDEREÇO DE ENTREGA
                    </label>
                    <p>
                      {order?.FreightStreetName}, {order?.FreightNumber} -{' '}
                      {order?.FreightDistrict} - {order?.FreightCity} -{' '}
                      {order?.FreightState}
                    </p>
                    <p>{order?.FreightComplement}</p>
                    <p>{order?.FreightPostalCode}</p>
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

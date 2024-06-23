import { toast } from 'react-toastify';
import { Button } from '../../../../globalStyles';
import api from '../../../services/api';
import {
  cleanNumber,
  translateError,
  translateValue,
} from '../../../services/util';
import { CardData, TableItens } from './NewOrder.styles';
// import Chip from '@mui/material/Chip';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';

/* eslint-disable react/prop-types */
export const Revision = ({
  orderItems,
  address,
  goBackStep,
  handleNext,
  setOrderId,
}) => {
  const [loading, setLoading] = useState(false);
  // const [selectedEsim, setSelectedEsim] = useState([]);
  // const [selectedSinCard, setSelectedSinCard] = useState([]);

  // useEffect(() => {
  //   const listSincard = [];
  //   // const listEsim = [];
  //   // orderItems.forEach((oi) => {
  //   //   oi.iccids.forEach((iccid)=>{
  //   //     if(iccid.type === 'sincard'){
  //   //       listSincard.push(iccid);
  //   //     }else{
  //   //       listEsim.push(iccid);
  //   //     }
  //   //   }

  //   //   )
  //   //   })
  //   // setSelectedEsim(listEsim);
  //   setSelectedSinCard(listSincard);
  // }, [orderItems]);

  const qtdFinal = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt = qt + Number(it.qtdItens);
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

 
  console.log(orderItems);

 
  const handleCreateOrder = () => {
    setLoading(true);
    api.order
      .create(
        api.currentUser.MyFinalClientId,
        api.currentUser.AccessTypes[0] === 'DEALER'
          ? api.currentUser?.DealerId
          : null,
        0,
        false,
        0,
        address,
        false
      )
      .then((res) => {
        setLoading(true);
        if (res.status == 201) {
          let orderId = res.data.OrderId;
          setOrderId(orderId)
          orderItems.forEach((item) => {
            api.order
              .addItem(
                item.value,
                item.qtdItens,
                orderId,
                item.Amount,
                [],
                item?.iccids?.qtdEsim !== '' ? item?.iccids?.qtdEsim : 0,
                item?.iccids?.qtdSinCard !== '' ? item?.iccids?.qtdSinCard : 0,
                item?.portIn?.portIn,
                api.currentUser.MyFinalClientId,
                null,
                null,
                null,
                item?.portIn?.portIn ? cleanNumber(item?.portIn?.oldNumber) : null,
                item?.portIn?.portIn ? item?.portIn?.operator : null,
                item?.portIn?.portIn ? cleanNumber(item?.portIn?.cpf ) : null,
                item?.portIn?.portIn ? item?.portIn?.name : null
              )
              .then(() => {
                toast.success('Item adicionado com sucesso');
                handleNext();
              })
              .catch((err) => {
                translateError(err);
              })
              .finally(() => setLoading(false));
          });
        }
      })
      .catch((err) => {
        translateError(err);
        setLoading(false);
      });
  };


  const qtdSinCards = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt =
        qt +
        Number(
          it?.iccids?.qtdSinCard !== ''
            ? it.iccids?.qtdSinCard
              ? it.iccids?.qtdSinCard
              : 0
            : 0
        );
    });
    return qt;
  };
  const qtdESims = (itens) => {
    console.log(itens);
    let qt = 0;
    itens?.forEach((it) => {
      qt =
        qt +
        Number(
          it?.iccids?.qtdEsim !== ''
            ? it.iccids?.qtdEsim
              ? it.iccids?.qtdEsim
              : 0
            : 0
        );
    });
    return qt;
  };

  return (
    <CardData>
      <h5>REVISE SEU PEDIDO</h5>
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}></div>
        <h4 style={{ marginTop: '0.5rem' }}>ENTREGA</h4>
        {address.cep !== '' ? (
          <h5>
            {`Rua: ${address?.address},${address?.number}, Bairro: ${address?.district}, Cidade: ${address?.city} - ${address?.uf} - CEP: ${address?.cep}`}
          </h5>
        ) : (
          <h5>
            Após efetuar o pagamento os PDFs do(s) e-Sim comprado(s) serão
            enviados no seu email cadastrado.
          </h5>
        )}
        <h4 style={{ marginTop: '0.5rem' }}>ITENS DO PEDIDO</h4>
        {window.innerWidth < 769 ? (
          <>
            <h5>Itens do pedido</h5>
            {orderItems.length === 0 ? (
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#00D959',
                  textAlign: 'center',
                  color: 'white',
                  marginTop: '0.2rem',
                }}
              >
                <h5></h5>
                <h5>SEM ITENS NO PEDIDO</h5>
                <h5></h5>
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
                  <h3 style={{ padding: '0.2rem', fontWeight: 'bold' }}>
                    {o.label}
                  </h3>
                  <h5>{`Preço UN: ${translateValue(o.Amount)}`}</h5>
                  <h5>{`Quantidade: ${o.qtdItens}`}</h5>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                  >
                    <h5>{`SimCard: ${
                      o.iccids?.qtdSinCard === '' ? '0' : o.iccids?.qtdSinCard
                    }`}</h5>
                    <h5>{`e-Sim: ${
                      o.iccids?.qtdEsim === '' ? '0' : o.iccids?.qtdEsim
                    }`}</h5>
                  </div>
                  <h4 style={{ marginTop: '0.2rem' }}>{`Total: ${translateValue(
                    o.finalPrice
                  )}`}</h4>
                </div>
              ))
            )}
          </>
        ) : (
          <div style={{ overflowX: window.innerWidth < 768 && 'scroll' }}>
            <TableItens>
              <tr>
                <th>Item</th>
                {window.innerWidth > 768 && <th>Preço UN</th>}
                {window.innerWidth > 768 && <th>Quantidade</th>}
                {window.innerWidth > 768 && <th>Chips</th>}
                <th>Total</th>
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
                          {m?.iccids?.qtdEsim && (
                            <p>{`e-Sim: ${m?.iccids?.qtdEsim}`}</p>
                          )}
                          {m?.iccids?.qtdSinCard && (
                            <p>{`SimCard: ${m?.iccids?.qtdSinCard}`}</p>
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
                          Produtos
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
                        {m?.portIn?.portIn && (
                          <div style={{ width: '100%' }}>
                            Portabilidade
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'start',
                                gap: 10,
                              }}
                            >
                              <div>Nome: {m?.portIn?.name}</div>
                              <div>Documento: {m?.portIn?.cpf}</div>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'start',
                                gap: 10,
                              }}
                            >
                              <div>Número: {m?.portIn?.oldNumber}</div>
                              <div>Operadora: {m?.portIn?.operator}</div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* </div> */}
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
                      <div style={{color: 'black'}}>
                        {qtdSinCards(orderItems) > 0 && (
                          <div>SimCard: {qtdSinCards(orderItems)}</div>
                        )}
                        {qtdESims(orderItems) > 0 && (
                          <div>e-Sim: {qtdESims(orderItems)}</div>
                        )}
                      </div>
                    )}
                    <td>{priceFinal(orderItems)}</td>
                  </tr>
                </>
              )}
            </TableItens>
          </div>
        )}

        {/* {selectedSinCard?.length > 0 && (
          <>
            <h4 style={{ marginTop: '0.5rem' }}>
              CONTEM OS SEGUINTES ICCIDS (SimCard físico)
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
        )} */}
      </div>
      <div className='flex end btn_invert'>
        <Button
          onClick={goBackStep}
          style={{ width: window.innerWidth < 768 && '100%' }}
        >
          VOLTAR
        </Button>
        <Button
          notHover
          onClick={() => {
            // setLoading(true)
            if(!loading)
            handleCreateOrder();
          }}
          style={{ width: window.innerWidth < 768 && '100%' }}
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
            'CRIAR PEDIDO'
          )}
        </Button>
      </div>
    </CardData>
  );
};

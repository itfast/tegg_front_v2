/* eslint-disable react/prop-types */
import { Button } from '../../../../globalStyles';
import { CardData, InputData } from '../../resales/Resales.styles';
import ReactLoading from 'react-loading';
import AsyncSelect from 'react-select/async';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { translateError } from '../../../services/util';
import { AiFillDelete } from 'react-icons/ai';

export const EsimOrderData = ({ goBackStep, label }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedResaleBuying, setSelectedResaleBuying] = useState('');
  // const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [orderPrice, setOrderPrice] = useState(0);
  const [orderItems, setOrderItems] = useState([]);
  const [ddd, setDdd] = useState('');
  const [personal, setPersonal] = useState(false);

  // const [numberToSend, setNumberToSend] = useState(0);
  const [iccidsToSend, setIccidsToSend] = useState([]);
  const [sendChecked, setSendChecked] = useState([]);
  // const [numberToActivate, setNumberToActivate] = useState(0);
  const [iccidsToActivate, setIccidsToActivate] = useState([]);
  const [activateChecked, setActivateChecked] = useState([]);

  const buyer1Input = document.getElementById('buyer1');
  const buyer2Input = document.getElementById('buyer2');
  const productsInput = document.getElementById('products');
  const dddInput = document.getElementById('ddd');

  const translateValue = (value) => {
    let converted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value));
    return converted;
  };

  const canSendIccid = (iccid) => {
    if (
      iccid.Status === 'NOT USED'
      // || iccid.Status === "CREATED"
    ) {
      if (api.currentUser.AccessTypes[0] === 'TEGG') {
        if (iccid.DealerId === null && iccid.FinalClientId === null) {
          return true;
        }
      } else if (api.currentUser.AccessTypes[0] === 'DEALER') {
        if (iccid.FinalClientId === null) {
          return true;
        }
      }
    }
    return false;
  };

  const allChecked = () => {
    if (sendChecked.length !== 0 && activateChecked.length !== 0) {
      return (
        sendChecked.every((i) => i === true) &&
        activateChecked.every((i) => i === true)
      );
    } else if (sendChecked.length !== 0) {
      return sendChecked.every((i) => i === true);
    } else if (activateChecked.length !== 0) {
      return activateChecked.every((i) => i === true);
    }
    return false;
  };

  const loadClientsDealers = async (search) => {
    if (api.currentUser.AccessTypes[0] !== 'CLIENT') {
      const responseC = await api.client.getSome(1, 15, search);
      const clients = await responseC.data.finalClients;
      let responseD = [];
      let dealers = [];
      if (api.currentUser.AccessTypes[0] === 'TEGG') {
        responseD = await api.dealer.getSome(1, 15, search);
        dealers = await responseD.data.dealers;
      }
      // console.log("Clients", responseC.data);
      // console.log("Dealers", responseD.data);

      const array = [];
      if (clients.length !== 0) {
        const clientsObj = {
          label: 'Clientes',
          options: [],
        };
        for (const c of clients) {
          if (c.AssociatedResaleId === null) {
            clientsObj.options.push({
              value: c.Id,
              label: c.Name,
              type: 'client',
            });
          }
        }
        array.push(clientsObj);
      }
      if (dealers.length !== 0) {
        const dealersObj = {
          label: 'Revendas',
          options: [],
        };
        for (const d of dealers) {
          dealersObj.options.push({
            value: d.Id,
            label: d.CompanyName || d.Name,
            type: 'dealer',
          });
        }
        array.push(dealersObj);
      }
      return array;
    }
  };

  const loadPlans = async (search) => {
    const response = await api.plans.get();
    // console.log(response.data);
    let plans = [];
    if (
      api.currentUser.AccessTypes[0] === 'DEALER' &&
      location?.state?.personal !== true
    ) {
      plans = await response.data.filter((p) =>
        p.Products.every((prod) => prod.Product.SurfId !== null)
      );
    } else if (api.currentUser.AccessTypes[0] === 'CLIENT') {
      plans = await response.data.filter(
        (p) => p.Products.length === 1 && p.Products[0].Product.SurfId !== null
      );
    } else {
      plans = await response.data;
    }
    // console.log(response.data);
    const array = [];
    for (const p of plans) {
      array.push({
        value: p.Id,
        label: p.Name,
        Amount: p.Amount,
        Products: p.Products,
      });
    }

    return array;
  };

  const loadIccids = async (search) => {
    // console.log(loadedOptions);
    const response = await api.iccid.getSome(1, 10, search);
    // console.log(response.data.meta);
    const ids = await response.data.iccids;
    const array = [];
    for (const id of ids) {
      if (
        (api.currentUser.AccessTypes[0] === 'TEGG' && id.DealerId === null) ||
        api.currentUser.AccessTypes[0] === 'DEALER'
      ) {
        if (id.Status === 'NOT USED' && id.LPAUrl) {
          array.push({
            value: id.Iccid,
            label: id.Iccid,
          });
        }
      }
    }

    return array;
  };

  const handleIccidSendChange = (index, newValue) => {
    // console.log(index, newValue);
    let updatedValues = [...iccidsToSend];
    let updatedChecked = [...sendChecked];
    updatedValues[index] = newValue;
    updatedChecked[index] = false;
    // console.log(updatedValues);
    // console.log(updatedChecked);
    setIccidsToSend(updatedValues);
    setSendChecked(updatedChecked);
  };

  const checkSendIccid = (index) => {
    let exists = false;
    if (iccidsToSend[index] !== '') {
      for (let i = 0; i < iccidsToSend.length; i++) {
        if (i !== index) {
          if (iccidsToSend[index] === iccidsToSend[i]) {
            exists = true;
            break;
          }
        }
      }
      if (!exists) {
        for (let i = 0; i < iccidsToActivate.length; i++) {
          if (iccidsToSend[index] === iccidsToActivate[i]) {
            exists = true;
            break;
          }
        }
      }
      if (exists) {
        toast.error('Esse ICCID já foi selecionado, escolha outro.');
      } else {
        api.iccid
          .getSome(1, 1, iccidsToSend[index])
          .then((res) => {
            if (canSendIccid(res.data.iccids[0])) {
              toast.success('ICCID validado com sucesso');
              let updatedChecked = [...sendChecked];
              updatedChecked[index] = true;
              // console.log(updatedChecked);
              // console.log(iccidsToSend);
              setSendChecked(updatedChecked);
            } else {
              toast.error(
                'Esse ICCID não pode ser enviado, por favor escolha outro.'
              );
            }
          })
          .catch((err) => translateError(err));
      }
    } else {
      toast.error('Escolha um iccid para enviar');
    }
  };

  const checkActivateIccid = (index) => {
    let exists = false;
    if (iccidsToActivate[index] !== '') {
      for (let i = 0; i < iccidsToActivate.length; i++) {
        if (i !== index) {
          if (iccidsToActivate[index] === iccidsToActivate[i]) {
            exists = true;
            break;
          }
        }
      }
      if (!exists) {
        for (let i = 0; i < iccidsToSend.length; i++) {
          if (iccidsToActivate[index] === iccidsToSend[i]) {
            exists = true;
            break;
          }
        }
      }
      if (exists) {
        toast.error('Esse ICCID já foi selecionado, escolha outro.');
      } else {
        api.iccid
          .getSome(1, 1, iccidsToActivate[index])
          .then((res) => {
            if (canSendIccid(res.data.iccids[0])) {
              toast.success('ICCID validado com sucesso');
              let updatedChecked = [...activateChecked];
              updatedChecked[index] = true;
              // console.log(updatedChecked);
              // console.log(iccidsToSend);
              setActivateChecked(updatedChecked);
            } else {
              toast.error(
                'Esse ICCID não pode ser enviado, por favor escolha outro.'
              );
            }
          })
          .catch((err) => translateError(err));
      }
    } else {
      toast.error('Escolha um iccid para enviar');
    }
  };

  const handleIccidActivateChange = (index, newValue) => {
    // console.log(index, newValue);
    let updatedValues = [...iccidsToActivate];
    let updatedChecked = [...activateChecked];
    updatedValues[index] = newValue;
    updatedChecked[index] = false;
    // console.log(updatedValues);
    // console.log(updatedChecked);
    setIccidsToActivate(updatedValues);
    setActivateChecked(updatedChecked);
  };

  const createOrder = async () => {
    setLoading(true);
    let sendI = 0;
    let activateI = 0;
    if (api.currentUser.AccessTypes[0] === 'TEGG') {
      if (allChecked()) {
        if (selectedClient === '') {
          // console.log(orderItems);
          api.order
            .create(null, selectedResaleBuying, null, 0, false, 0)
            .then((res) => {
              if (res.status == 201) {
                let orderId = res.data.OrderId;
                // console.log("ID Pedido", orderId);
                orderItems.forEach((item) => {
                  const iccidArray = [];
                  item.Products.forEach((p) => {
                    if (p.Product.SurfId === null) {
                      iccidArray.push({
                        Iccid: iccidsToSend[sendI],
                        Awarded: 0,
                        AwardedSurfPlan: null,
                      });
                      sendI++;
                    } else {
                      iccidArray.push({
                        Iccid: iccidsToActivate[activateI],
                        Awarded: 1,
                        AwardedSurfPlan: p.Product.SurfId,
                      });
                      activateI++;
                    }
                  });
                  // console.log(item);
                  setLoading(true);
                  api.order
                    .addItem(
                      item.value,
                      ddd,
                      orderId,
                      item.Amount,
                      iccidArray,
                      'esim'
                    )
                    .then((res) => {
                      // console.log(res);
                      toast.success('Item adicionado com sucesso');
                      navigate('/orders');
                    })
                    .catch((err) => {
                      console.log(err);
                      toast.error(
                        'Não foi possível adicionar o item ao pedido'
                      );
                      // translateError(err)
                    })
                    .finally(() => setLoading(false));
                });
              }
            })
            .catch((err) => {
              translateError(err);
              setLoading(false);
            });
        } else {
          api.order
            .create(selectedClient, null, null, 0, false, 0)
            .then((res) => {
              if (res.status == 201) {
                let orderId = res.data.OrderId;
                // console.log("ID Pedido", orderId);
                orderItems.forEach((item) => {
                  // console.log(item);
                  const iccidArray = [];
                  item.Products.forEach((p) => {
                    if (p.Product.SurfId === null) {
                      iccidArray.push({
                        Iccid: iccidsToSend[sendI],
                        Awarded: 0,
                        AwardedSurfPlan: null,
                      });
                      sendI++;
                    } else {
                      iccidArray.push({
                        Iccid: iccidsToActivate[activateI],
                        Awarded: 0,
                        AwardedSurfPlan: p.Product.SurfId,
                      });
                      activateI++;
                    }
                  });
                  setLoading(true);
                  api.order
                    .addItem(
                      item.value,
                      ddd,
                      orderId,
                      item.Amount,
                      iccidArray,
                      'esim'
                    )
                    .then((res) => {
                      // console.log(res);
                      toast.success('Item adicionado com sucesso');
                      navigate('/orders');
                    })
                    .catch((err) => {
                      console.log(err);
                      toast.error(
                        'Não foi possível adicionar o item ao pedido'
                      );
                      // translateError(err)
                    })
                    .finally(() => setLoading(false));
                });
              }
            })
            .catch((err) => {
              translateError(err);
              setLoading(false);
            });
        }
      } else {
        toast.error('Existem ICCIDS que ainda não foram verificados');
        setLoading(false);
      }
    } else if (api.currentUser.AccessTypes[0] === 'DEALER') {
      if (allChecked()) {
        if (selectedClient !== '') {
          api.order
            .create(selectedClient, null, api.currentUser.DealerId, 0, false, 0)
            .then((res) => {
              if (res.status == 201) {
                let orderId = res.data.OrderId;
                // console.log("ID Pedido", orderId);
                orderItems.forEach((item) => {
                  const iccidArray = [];
                  item.Products.forEach((p) => {
                    if (p.Product.SurfId === null) {
                      iccidArray.push({
                        Iccid: iccidsToSend[sendI],
                        Awarded: 0,
                        AwardedSurfPlan: null,
                      });
                      sendI++;
                    } else {
                      iccidArray.push({
                        Iccid: iccidsToActivate[activateI],
                        Awarded: 0,
                        AwardedSurfPlan: p.Product.SurfId,
                      });
                      activateI++;
                    }
                  });
                  // console.log(item);
                  setLoading(true);
                  api.order
                    .addItem(
                      item.value,
                      ddd,
                      orderId,
                      item.Amount,
                      iccidArray,
                      'esim'
                    )
                    .then((res) => {
                      // console.log(res);
                      toast.success('Item adicionado com sucesso');
                      navigate('/orders');
                    })
                    .catch((err) => {
                      console.log(err);
                      toast.error(
                        'Não foi possível adicionar o item ao pedido'
                      );
                      // translateError(err)
                    })
                    .finally(() => setLoading(false));
                });
              }
            })
            .catch((err) => {
              translateError(err);
              setLoading(false);
            });
        } else {
          api.order
            .create(null, api.currentUser.DealerId, null, 0, false, 0)
            .then((res) => {
              if (res.status == 201) {
                let orderId = res.data.OrderId;
                // console.log("ID Pedido", orderId);
                orderItems.forEach((item) => {
                  const iccidArray = [];
                  item.Products.forEach((p) => {
                    if (p.Product.SurfId === null) {
                      iccidArray.push({
                        Iccid: iccidsToSend[sendI],
                        Awarded: 0,
                        AwardedSurfPlan: null,
                      });
                      sendI++;
                    } else {
                      iccidArray.push({
                        Iccid: iccidsToActivate[activateI],
                        Awarded: 1,
                        AwardedSurfPlan: p.Product.SurfId,
                      });
                      activateI++;
                    }
                  });
                  // console.log(item);
                  setLoading(true);
                  api.order
                    .addItem(
                      item.value,
                      ddd,
                      orderId,
                      item.Amount,
                      iccidArray,
                      'esim'
                    )
                    .then((res) => {
                      // console.log(res);
                      toast.success('Item adicionado com sucesso');
                      navigate('/orders');
                    })
                    .catch((err) => {
                      console.log(err);
                      toast.error(
                        'Não foi possível adicionar o item ao pedido'
                      );
                      // translateError(err)
                    })
                    .finally(() => setLoading(false));
                });
              }
            })
            .catch((err) => {
              translateError(err);
              setLoading(false);
            });
        }
      } else {
        toast.error('Existem ICCIDS que ainda não foram verificados');
        setLoading(false);
      }
    } else {
      // console.log(api.currentUser);
      const { data } = await api.iccid.checkFree('esim', 'all');
      if (data !== 0) {
        api.order
          .create(
            api.currentUser.MyFinalClientId,
            null,
            api.currentUser.hasOwnProperty('MyDealerId')
              ? api.currentUser.MyDealerId
              : null,
            0,
            false,
            0
          )
          .then((res) => {
            if (res.status == 201) {
              let orderId = res.data.OrderId;
              // console.log("ID Pedido", orderId);
              orderItems.forEach((item) => {
                setLoading(true);
                api.order
                  .addItem(item.value, ddd, orderId, item.Amount, [], 'esim')
                  .then((res) => {
                    // console.log(res);
                    toast.success('Item adicionado com sucesso');
                    navigate('/orders');
                  })
                  .catch((err) => {
                    console.log(err);
                    toast.error('Não foi possível adicionar o item ao pedido');
                    // translateError(err)
                  })
                  .finally(() => setLoading(false));
              });
            }
          })
          .catch((err) => {
            translateError(err);
            setLoading(false);
          });
      } else {
        toast.error(
          'Não existem e-SIMs disponíveis para compra, fale com seu vendedor para saber quando haverá estoque'
        );
        setLoading(false);
      }
    }
  };

  const handleAdd = () => {
    if (Object.keys(selectedPlan).length !== 0) {
      const array = [...orderItems];
      array.push(selectedPlan);

      const sendArray = [...iccidsToSend];
      const sendCheckArray = [...sendChecked];

      // let sendNum = numberToSend;
      const activateArray = [...iccidsToActivate];
      const activateCheckArray = [...activateChecked];

      // let activateNum = numberToActivate;
      selectedPlan.Products.forEach((p) => {
        if (p.Product.SurfId === null) {
          sendArray.push('');
          sendCheckArray.push(false);
        } else {
          activateArray.push('');
          activateCheckArray.push(false);
        }
      });
      let newVal = orderPrice + selectedPlan.Amount;
      setOrderPrice(newVal);
      // console.log(array);
      setOrderItems(array);
      setIccidsToSend(sendArray);
      setSendChecked(sendCheckArray);
      setIccidsToActivate(activateArray);
      setActivateChecked(activateCheckArray);
    } else {
      toast.error('Selecione ao menos um plano');
    }
  };

  const handleDelete = (index) => {
    const array = [...orderItems];
    const val = array[index].Amount;
    const newVal = orderPrice - val;
    // console.log(array);

    const sendArray = [...iccidsToSend];
    const sendCheckArray = [...sendChecked];
    // let sendNum = numberToSend;
    const activateArray = [...iccidsToActivate];
    const activateCheckArray = [...activateChecked];
    // let activateNum = numberToActivate;
    array[index].Products.forEach((p) => {
      if (p.Product.SurfId === null) {
        sendArray.pop();
        sendCheckArray.pop();
      } else {
        activateArray.pop();
        activateCheckArray.pop();
      }
    });

    array.splice(index, 1);
    setOrderItems(array);
    setOrderPrice(newVal);
    setIccidsToSend(sendArray);
    setIccidsToActivate(activateArray);
    setSendChecked(sendCheckArray);
    setActivateChecked(activateCheckArray);
  };

  const handleNext = () => {
    // console.log(selectedClient === "" && selectedResaleBuying === "");
    if (api.currentUser.AccessTypes[0] === 'TEGG') {
      if (!(selectedClient === '' && selectedResaleBuying === '')) {
        buyer1Input?.style.removeProperty('border-color');
        buyer2Input?.style.removeProperty('border-color');
        if (orderItems.length !== 0) {
          productsInput?.style.removeProperty('border-color');
          if (ddd !== '') {
            dddInput?.style.removeProperty('border-color');
            createOrder();
          } else {
            toast.error('Ddd é obrigatório');
            dddInput.style.borderColor = 'red';
          }
        } else {
          toast.error('Adicione ao menos um plano');
          productsInput.style.borderColor = 'red';
        }
      } else {
        toast.error('Comprador é obrigatório');
        buyer1Input.style.borderColor = 'red';
        buyer2Input.style.borderColor = 'red';
      }
    } else if (api.currentUser.AccessTypes[0] === 'DEALER') {
      if (personal) {
        if (orderItems.length !== 0) {
          productsInput?.style.removeProperty('border-color');
          if (ddd !== '') {
            dddInput?.style.removeProperty('border-color');
            createOrder();
          } else {
            toast.error('Ddd é obrigatório');
            dddInput.style.borderColor = 'red';
          }
        } else {
          toast.error('Adicione ao menos um plano');
          productsInput.style.borderColor = 'red';
        }
      } else {
        if (selectedClient !== '') {
          buyer1Input?.style.removeProperty('border-color');
          if (orderItems.length !== 0) {
            productsInput?.style.removeProperty('border-color');
            if (ddd !== '') {
              dddInput?.style.removeProperty('border-color');
              createOrder();
            } else {
              toast.error('Ddd é obrigatório');
              dddInput.style.borderColor = 'red';
            }
          } else {
            toast.error('Adicione ao menos um plano');
            productsInput.style.borderColor = 'red';
          }
        } else {
          toast.error('Comprador é obrigatório');
          buyer1Input.style.borderColor = 'red';
        }
      }
    } else {
      if (orderItems.length !== 0) {
        productsInput?.style.removeProperty('border-color');
        if (ddd !== '') {
          dddInput?.style.removeProperty('border-color');
          createOrder();
        } else {
          toast.error('Ddd é obrigatório');
          dddInput.style.borderColor = 'red';
        }
      } else {
        toast.error('Adicione ao menos um plano');
        productsInput.style.borderColor = 'red';
      }
    }
  };

  useEffect(() => {
    // console.log(api.currentUser);
    if (location?.state?.personal) {
      // console.log(location?.state?.personal);
      setPersonal(location?.state?.personal);
    }
  }, []);

  return (
    <CardData>
      <h2>{label}</h2>
      <br />
      {api.currentUser.AccessTypes[0] !== 'CLIENT' && (
        <div className='input_container'>
          <div className='input'>
            {!personal && (
              <>
                <label className='bold' style={{ fontSize: '1em' }}>
                  COMPRADOR
                </label>
                <AsyncSelect
                  loadOptions={loadClientsDealers}
                  placeholder='Selecionar ou buscar...'
                  defaultOptions
                  isClearable
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPosition={'fixed'}
                  onChange={(e) => {
                    // console.log(e);
                    if (e === null) {
                      setSelectedClient('');
                      setSelectedResaleBuying('');
                    } else {
                      if (e.type === 'dealer') {
                        setSelectedClient('');
                        setSelectedResaleBuying(e.value);
                      } else {
                        setSelectedClient(e.value);
                        setSelectedResaleBuying('');
                      }
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}
      <div className='input_container'>
        <div className='tb mr'>
          <label className='bold' style={{ fontSize: '1em' }}>
            ITENS DO PEDIDO
          </label>
          <table>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
            </tr>
            {orderItems.length === 0 && (
              <tr>
                <td>-</td>
                <td>-</td>
              </tr>
            )}
            {orderItems.map((m, i) => (
              <tr key={i}>
                <td>{m.label}</td>
                <td>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <p>{translateValue(m.Amount)}</p>
                    {location?.pathname === '/orders/new/esim' && (
                      <AiFillDelete
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          handleDelete(i);
                        }}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </table>
        </div>
        {location?.pathname === '/orders/new/esim' && (
          <div className='tb_addons'>
            <div className='tb_select'>
              <label className='bold' style={{ fontSize: '1em' }}>
                PRODUTOS
              </label>
              <AsyncSelect
                loadOptions={loadPlans}
                placeholder='Selecione...'
                defaultOptions
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPosition={'fixed'}
                isClearable
                onChange={(e) => {
                  // console.log(e);
                  setSelectedPlan(e || {});
                }}
              />
              <div className='tb_btn'>
                <Button
                  style={{
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => handleAdd()}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {api.currentUser.AccessTypes[0] !== 'CLIENT' && (
        <div>
          {iccidsToActivate.length !== 0 && (
            <div className='input_container_2'>
              <div className='input'>
                <label className='bold' style={{ fontSize: '1em' }}>
                  ICCIDS PARA ATIVAR
                </label>
                {iccidsToActivate.map((i, index) => (
                  <div key={index} className='input_container'>
                    <div className='tb_select_2'>
                      <AsyncSelect
                        isClearable
                        loadOptions={loadIccids}
                        defaultOptions
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPosition={'fixed'}
                        onChange={(e) => {
                          // console.log(e);
                          if (e !== null) {
                            handleIccidActivateChange(index, e.value);
                          } else {
                            handleIccidActivateChange(index, '');
                          }
                        }}
                      />
                    </div>
                    <Button
                      style={{ marginLeft: 10 }}
                      disabled={activateChecked[index]}
                      invert={activateChecked[index]}
                      onClick={() => checkActivateIccid(index)}
                    >
                      {!activateChecked[index] ? 'CHECAR' : 'VALIDADO'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {iccidsToSend.length !== 0 && (
            <div className='input_container_2'>
              <div className='input'>
                <label className='bold' style={{ fontSize: '1em' }}>
                  ICCIDS PARA ENVIAR
                </label>
                {iccidsToSend.map((i, index) => (
                  <div key={index} className='input_container'>
                    <div className='tb_select_2'>
                      <AsyncSelect
                        isClearable
                        loadOptions={loadIccids}
                        defaultOptions
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPosition={'fixed'}
                        onChange={(e) => {
                          // console.log(e);
                          if (e !== null) {
                            handleIccidSendChange(index, e.value);
                          } else {
                            handleIccidSendChange(index, '');
                          }
                        }}
                      />
                    </div>
                    <Button
                      style={{ marginLeft: 10 }}
                      disabled={sendChecked[index]}
                      invert={sendChecked[index]}
                      onClick={() => checkSendIccid(index)}
                    >
                      {!sendChecked[index] ? 'CHECAR' : 'VALIDADO'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div className='input_container end'>
        <div className='input_3 mr'>
          <label className='bold' style={{ fontSize: '1em' }}>
            VALOR
          </label>
          <InputData
            disabled={true}
            // type="number"
            placeholder='Valor do plano'
            className='input'
            value={translateValue(orderPrice)}
          />
        </div>
        <div className='input_3'>
          <label className='bold' style={{ fontSize: '1em' }}>
            DDD
          </label>
          <InputData
            type='number'
            id='ddd'
            placeholder='DDD*'
            className='input'
            value={ddd}
            onChange={(e) => setDdd(e.target.value)}
          />
        </div>
      </div>
      <div className='flex end btn_invert'>
        <Button invert onClick={goBackStep}>
          VOLTAR
        </Button>
        <Button notHover onClick={handleNext}>
          {loading ? (
            <div className='loading'>
              <ReactLoading type={'bars'} color={'#fff'} />
            </div>
          ) : (
            'CRIAR'
          )}
        </Button>
      </div>
    </CardData>
  );
};

/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ReactLoading from 'react-loading';
import AsyncSelect from 'react-select/async';
import { AiFillDelete } from 'react-icons/ai';
import { MdExpandMore } from 'react-icons/md';
import api from '../../../services/api';
import {
  cepFormat,
  translateError,
  translateValue,
} from '../../../services/util';
import { Button } from '../../../../globalStyles';
import { toast } from 'react-toastify';

export const OrderDataNew = () => {
  const [expanded, setExpanded] = useState(false);
  const [personal, setPersonal] = useState(false);
  const [cep, setCep] = useState('');
  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [freightValue, setFreightValue] = useState(0);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedResaleBuying, setSelectedResaleBuying] = useState('');
  const [freightCalculated, setFreightCalculated] = useState(false);

  const [orderItems, setOrderItems] = useState([]);
  const [orderPrice, setOrderPrice] = useState(0);
  const [iccidsToSend, setIccidsToSend] = useState([]);
  const [sendChecked, setSendChecked] = useState([]);
  const [iccidsToActivate, setIccidsToActivate] = useState([]);
  const [activateChecked, setActivateChecked] = useState([]);

  const [selectedPlan, setSelectedPlan] = useState({});

  const handleChange = (panel) => (event, isExpanded) => {
    console.log(panel, isExpanded);
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    console.log(expanded);
  }, [expanded]);

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

  const loadPlans = async () => {
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
    } else if (api.currentUser.AccessTypes[0] === 'CLIENT' || api.currentUser.AccessTypes[0] === 'AGENT') {
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

  const loadClientsDealers = async (search) => {
    console.log('load clientes');
    if (api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT') {
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

  const getAddress = (id, type) => {
    if (type === 'dealer') {
      api.dealer
        .getAddress(id)
        .then((res) => {
          // console.log(res.data);
          setCep(res.data.PostalCode);
          setUf(res.data.UF);
          setCity(res.data.City);
          setDistrict(res.data.District);
          setAddress(res.data.Address);
          setAddressNumber(res.data.Number);
          setAddressComplement(res.data.Complement || '');
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
          // toast.error(
          // 	"Não foi possível coletar as informações do endereço do cliente, tente novamente mais tarde"
          // );
        });
    } else {
      api.client
        .getAddress(id)
        .then((res) => {
          // console.log(res.data);
          setCep(cepFormat(res.data.PostalCode));
          setUf(res.data.UF);
          setCity(res.data.City);
          setDistrict(res.data.District);
          setAddress(res.data.Address);
          setAddressNumber(res.data.Number);
          setAddressComplement(res.data.Complement || '');
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
          // toast.error(
          // 	"Não foi possível coletar as informações do endereço do cliente, tente novamente mais tarde"
          // );
        });
    }
  };

  useEffect(() => {
    if (api.currentUser.AccessTypes[0] === 'CLIENT' || api.currentUser.AccessTypes[0] === 'AGENT') {
      getAddress(api.currentUser.MyFinalClientId, '');
    }
    if (location?.state?.personal) {
      // console.log(location?.state?.personal);
      getAddress(api.currentUser.MyFinalClientId, '');
      setPersonal(location?.state?.personal);
    }
  }, []);

  return (
    <div>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<MdExpandMore />}
          aria-controls='panel1bh-content'
          id='panel1bh-header'
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Comprador
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {selectedClient?.label || selectedResaleBuying?.label}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT' && (
            // <div className="input_container">
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
                      setExpanded('panel2');
                      if (e === null) {
                        setSelectedClient('');
                        setSelectedResaleBuying('');
                        setFreightValue(0);
                        setFreightCalculated(false);
                      } else {
                        if (e.type === 'dealer') {
                          setSelectedClient('');
                          setSelectedResaleBuying(e);
                        } else {
                          setSelectedClient(e);
                          setSelectedResaleBuying('');
                        }
                        getAddress(e.value, e.type);
                      }
                    }}
                  />
                </>
              )}
            </div>
            // </div>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary
          expandIcon={<MdExpandMore />}
          aria-controls='panel2bh-content'
          id='panel2bh-header'
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Itens</Typography>
          {/* <Typography sx={{ color: 'text.secondary' }}>
            You are currently not an owner
          </Typography> */}
        </AccordionSummary>
        <AccordionDetails>
          {/* <div className="input_container">
				<div className="tb mr"> */}
          {location?.pathname === '/orders/new/chip' && (
            // <div className="tb_addons">
            // <div className="tb_select">
            <div>
              {/* <label className="bold" style={{ fontSize: "1em" }}>
								
							</label> */}
              <div>
                <AsyncSelect
                  loadOptions={loadPlans}
                  placeholder='Selecione...'
                  defaultOptions
                  isClearable
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPosition={'fixed'}
                  onChange={(e) => {
                    // console.log(e);
                    setSelectedPlan(e || {});
                  }}
                />
              </div>
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
            // </div>
          )}
          <div>
            {/* <label className="bold" style={{ fontSize: "1em" }}>
						ITENS DO PEDIDO
					</label> */}
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
                      {location?.pathname === '/orders/new/chip' && (
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
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <AccordionSummary
          expandIcon={<MdExpandMore />}
          aria-controls='panel3bh-content'
          id='panel3bh-header'
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Advanced settings
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Filtering has been entirely disabled for whole web server
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel4'}
        onChange={handleChange('panel4')}
      >
        <AccordionSummary
          expandIcon={<MdExpandMore />}
          aria-controls='panel4bh-content'
          id='panel4bh-header'
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Personal data
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

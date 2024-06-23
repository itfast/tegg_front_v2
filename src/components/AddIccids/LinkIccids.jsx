/* eslint-disable react/prop-types */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import Radio from '@mui/joy/Radio';
import FormControl from '@mui/joy/FormControl';
import RadioGroup from '@mui/joy/RadioGroup';

import { Button } from '../../../globalStyles';
import { useEffect, useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import api from '../../services/api';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { MdExpandMore } from 'react-icons/md';
import { FaSimCard } from 'react-icons/fa6';
import { TableItens } from '../../pages/orders/new/NewOrder.styles';
import { translateError } from '../../services/util';
import ReactLoading from 'react-loading';

import { Tooltip } from 'react-tooltip';

// eslint-disable-next-line react/prop-types
export const LinkIccids = ({
  order,
  setOrder,
  setShowAddIccid,
  searchOrder,
}) => {
  const [selectedEsim, setSelectedEsim] = useState([]);
  const [selectedSinCard, setSelectedSinCard] = useState([]);
  const [sinCard, setSinCard] = useState();
  const [eSim, setEsim] = useState();
  const [expanded, setExpanded] = useState(false);
  const [showIccid, setShowIccid] = useState(false);
  const [tmpItem, setTmpItem] = useState();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const [stoke, setStoke] = useState('local');
  const [mustIccid, setMustIccid] = useState(true);
  const [mustAdress, setMustAdress] = useState(false);
  const [canTransport, setCanTransport] = useState(true);

  useEffect(() => {
    setMustIccid(
      !order?.OrderItems?.every((i) =>
        i?.Plan?.Products?.every((p) => p.Product?.Technology === 'NA')
      )
    );
    setMustAdress(
      !order?.OrderItems?.some((i) =>
        i?.Plan?.Products?.some((p) => p.Product?.Technology === 'NA')
      )
    );
    order?.OrderItems?.forEach((i) => console.log(i));
    setCanTransport(
      order?.OrderItems?.some((i) => i?.QuantitySimCard > 0)
    );
  }, [order]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const loadIccids = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const response = await api.iccid.getSome1(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search,
      'simcard',
      'AVAILABLE'
    );

    const hasMore = response.data.meta.total > vlr;
    const ids = await response.data.iccids;
    const array = [];
    for (const id of ids) {
      array.push({
        value: id.Iccid,
        label: id.Iccid,
      });
    }
    return {
      options: array,
      hasMore,
    };
  };

  const loadIccidsEsim = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const response = await api.iccid.getSome1(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search,
      'esim',
      'AVAILABLE'
    );
    const hasMore = response.data.meta.total > vlr;
    const ids = await response.data.iccids;
    const array = [];
    for (const id of ids) {
      array.push({
        value: id.Iccid,
        label: id.Iccid,
      });
    }
    return {
      options: array,
      hasMore,
    };
  };

  const canAdd = (qtd, type) => {
    const has = type === 'esim' ? selectedEsim.length : selectedSinCard.length;
    if (has < qtd) {
      return true;
    }
    return false;
  };

  const handleDeleteChip = (itens) => {
    const orig = _.cloneDeep(selectedSinCard);
    const find = orig.findIndex((o) => o.value === itens.value);
    orig.splice(find, 1);
    setSelectedSinCard(orig);
  };

  const handleDeleteEsim = (itens) => {
    const orig = _.cloneDeep(selectedEsim);
    const find = orig.findIndex((o) => o.value === itens.value);
    orig.splice(find, 1);
    setSelectedEsim(orig);
  };

  const linkIccids = () => {
    let mustEsim = 0;
    let mustSinCard = 0;
    let has = 0;

    // let hastotal = 0;
    order?.OrderItems?.forEach((item) => {
      mustEsim += item.QuantityEsim;
      mustSinCard += stoke === 'local' ? item.QuantitySimCard : 0;
      if (item?.iccids) {
        if (stoke === 'local') {
          has += item?.iccids?.length;
        } else {
          item?.iccids?.forEach((i) => {
            if (i.type === 'esim') {
              has += 1;
            }
          });
        }
      } else {
        has += 0;
      }
    });

    console.log(has === mustEsim + mustSinCard);

    if (has === mustEsim + mustSinCard) {
      if (stoke === 'Transportadora') {
        setLoading(true);
        api.order
          .transport(order.Id)
          .then((res) => {
            toast.success(res.data?.Message);
            setShowAddIccid(false);
            searchOrder();
          })
          .catch((err) => {
            translateError(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
      if (has >= 0) {
        setLoading(true);

        order.OrderItems?.forEach((it) => {
          if (it.iccids) {
            api.order
              .linkiccid(it.Id, it.iccids)
              .then((res) => {
                toast.success(res.data?.Message);
                setShowAddIccid(false);
                searchOrder();
              })
              .catch((err) => {
                translateError(err);
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            api.order
              .linkiccid(it.Id, [])
              .then((res) => {
                toast.success(res.data?.Message);
                setShowAddIccid(false);
                searchOrder();
              })
              .catch((err) => {
                console.log(err);
                console.log(it.Id, []);
                translateError(err);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        });
      } else {
        toast.error('Como atender pedido de blind?');
      }
    } else {
      toast.error(
        'O pedido ainda não está completo. Informe todos os iccids necessários'
      );
    }

    // api.purchaseorder.linkiccid()
  };

  const handleAddIccid = () => {
    setIsOpen(false);
    const orig = _.cloneDeep(order);
    const find = orig.OrderItems?.find((o) => o.Id === tmpItem.Id);
    const array = selectedSinCard.concat(selectedEsim);
    find.iccids = array;
    setOrder(orig);
    setTmpItem();
    setSelectedEsim([]);
    setSelectedSinCard([]);
    setShowIccid(false);
    // } else {
    //   toast.error('Adicione os ICCIDs que faltam');
    // }
  };

  return (
    <>
      <DialogTitle id='alert-dialog-title'>ITEMS DO PEDIDO</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {api.currentUser.AccessTypes[0] === 'TEGG' && (
            <>
              {canTransport && (
                <>
                  <h5>Selecione o local de onde os simcards serão enviados</h5>
                  <div style={{ display: 'flex', color: 'green' }}>
                    <FormControl>
                      <RadioGroup
                        defaultValue='outlined'
                        name='radio-buttons-group'
                        orientation='horizontal'
                        value={stoke}
                        onChange={(e) => setStoke(e.target.value)}
                      >
                        <Radio
                          color='success'
                          orientation='horizontal'
                          size='md'
                          variant='solid'
                          value='local'
                          label='Estoque local'
                        />
                        <Radio
                          color='success'
                          orientation='horizontal'
                          size='md'
                          variant='solid'
                          value='Transportadora'
                          label='Transportadora'
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </>
              )}
            </>
          )}
          <TableItens style={{ marginTop: '1rem' }}>
            <tr>
              <th>Item</th>
              <th>Quantidade itens</th>
              {mustIccid && <th>Quantidade ICCIDs</th>}
            </tr>
            {order?.OrderItems?.map((m, i) => (
              <>
                <tr key={i}>
                  <td>{m.Plan?.Name}</td>
                  <td>{m?.Quantity}</td>
                  {mustIccid && (
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          {m?.QuantityEsim > 0 && (
                            <h5>e-Sim: {m?.QuantityEsim}</h5>
                          )}
                          {m?.QuantitySimCard > 0 && (
                            <h5>SimCard: {m?.QuantitySimCard}</h5>
                          )}
                        </div>
                        <div>
                          {(m?.QuantityEsim > 0 || m?.QuantitySimCard > 0) && (
                            <FaSimCard
                              data-tooltip-id='my-tooltip'
                              data-tooltip-content='Adicione os itens que faltam no pedido'
                              // data-tooltip-place='up'
                              size={25}
                              style={{ cursor: 'pointer', color: 'blue' }}
                              onClick={() => {
                                setTmpItem(m);
                                setShowIccid(true);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
                {m.iccids?.length > 0 && (
                  <tr key={i}>
                    <td colSpan={5} style={{ padding: 0 }}>
                      <Accordion
                        sx={{
                          '& .MuiAccordion-root': {
                            height: 5,
                          },
                        }}
                        expanded={expanded === `panel${i}`}
                        onChange={handleChange(`panel${i}`)}
                      >
                        <AccordionSummary
                          expandIcon={<MdExpandMore />}
                          aria-controls='panel1bh-content'
                          id='panel1bh-header'
                        >
                          <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            ICCIDs vinculados ({m.iccids?.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div style={{ margin: 2 }}>
                            {m.iccids.map((iccid) => (
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
                                key={iccid.value}
                                label={iccid.label}
                              />
                            ))}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </TableItens>
          {(!mustAdress || canTransport) && (
            <div style={{ marginTop: '0.5rem' }}>
              <h5>Endereço de envio:</h5>
              <h5>
                {order?.FreightStreetName}, {order?.FreightNumber},{' '}
                {order?.FreightDistrict}
              </h5>
              <h5>
                {order?.FreightCity} - {order?.FreightState} -{' '}
                {order?.FreightPostalCode}
              </h5>
              {order?.FreightComplement && <h5>{order?.FreightComplement}</h5>}
            </div>
          )}
          <Tooltip
            id='my-tooltip'
            content='Hello world!'
            style={{ backgroundColor: 'rgb(255, 0, 0)', color: '#fff' }}
            isOpen={isOpen}
          />
          {/* <div
              key={o.Id}
              style={{
                width: '90%',
                backgroundColor: '#00D959',
                textAlign: 'center',
                color: '#3d3d3d',
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
                <IoMdMore onClick={(e) => handleClick(e, o)} />
              </div>
              <div style={{ position: 'absolute', top: '8px', left: '16px' }}>
                {/* <h5>icone</h5> */}
          {/* </div>
              <h4 style={{ padding: '0.2rem', fontWeight: 'bold' }}>
                {o?.FinalClient?.Name || o?.Dealer?.Name}
              </h4>
              <h3>{calcAmount(o?.OrderItems)}</h3>
              {o?.OrderItems?.map((i, ii) => (
                <h5 key={ii}>{i?.Plan?.Name}</h5>
              ))}
              <h4>{`Data: ${moment(new Date()).format(
                'DD/MM/YYYY - HH:mm'
              )}`}</h4>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
              </div>
              <h3 style={{ marginTop: '0.2rem' }}>
                {translateStatus(o.Status)}
              </h3>
            </div> */}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          invert
          onClick={() => {
            setShowAddIccid(false);
          }}
        >
          CANCELAR
        </Button>
        <Button onClick={linkIccids}>
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
            'FINALIZAR PEDIDO'
          )}
        </Button>
      </DialogActions>
      <Dialog
        open={showIccid}
        // onClose={() => setShowIccid(false)}
        fullWidth
      >
        <DialogTitle>ICCIDS</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <>
              <h5>ADICIONE ICCIDS AO ITEM {tmpItem?.Plan?.Name}</h5>
              {stoke === 'local' && tmpItem?.QuantitySimCard > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <div
                    style={{
                      display: window.innerWidth > 768 && 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <h5 style={{ marginRight: '1rem' }}>
                      VINCULE OS ICCIDS AO PEDIDO (CHIPS FÍSICOS)
                    </h5>
                  </div>

                  <div>
                    <AsyncPaginate
                      defaultOptions
                      cacheUniqs={selectedSinCard}
                      placeholder='Selecione os chips físicos'
                      noOptionsMessage={() => 'SEM ICCIDS PARA VINCULAR'}
                      value={sinCard}
                      loadOptions={loadIccids}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPosition={'fixed'}
                      onChange={(e) => {
                        setSinCard(null);
                        if (e !== null) {
                          if (canAdd(tmpItem.QuantitySimCard, 'simcard')) {
                            const find = selectedSinCard.findIndex(
                              (s) => s.value === e.value
                            );
                            let globalFind = -1;
                            for (
                              let i = 0;
                              i < order?.OrderItems?.length;
                              i++
                            ) {
                              if (order?.OrderItems[i]?.iccids) {
                                globalFind = order?.OrderItems[
                                  i
                                ]?.iccids?.findIndex(
                                  (ic) => ic.value === e.value
                                );
                              }
                              if (globalFind !== -1) {
                                break;
                              }
                            }
                            if (find === -1 && globalFind === -1) {
                              setSelectedSinCard([
                                ...selectedSinCard,
                                {
                                  label: e.label,
                                  value: e.value,
                                  type: 'sincard',
                                },
                              ]);
                            } else {
                              toast.error(
                                'ICCID já selecionado. Escolha outro.'
                              );
                            }
                          } else {
                            toast.error('Limite do pedido atingido');
                          }
                        }
                      }}
                    />
                  </div>
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
                        onDelete={() => handleDeleteChip(i)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {tmpItem?.QuantityEsim > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <div
                    style={{
                      display: window.innerWidth > 768 && 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <h5 style={{ marginRight: '1rem' }}>
                      VINCULE OS ICCIDS AO PEDIDO (e-Sim)
                    </h5>
                  </div>
                  <div>
                    <AsyncPaginate
                      defaultOptions
                      cacheUniqs={selectedEsim}
                      loadOptions={loadIccidsEsim}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPosition={'fixed'}
                      placeholder='Selecione os E-sim'
                      noOptionsMessage={() => 'SEM ICCIDS PARA VINCULAR'}
                      value={eSim}
                      onChange={(e) => {
                        if (e !== null) {
                          setEsim(null);
                          if (canAdd(tmpItem?.QuantityEsim, 'esim')) {
                            const find = selectedEsim.findIndex(
                              (s) => s.value === e.value
                            );
                            let globalFind = -1;
                            for (
                              let i = 0;
                              i < order?.OrderItems?.length;
                              i++
                            ) {
                              if (order?.OrderItems[i]?.iccids) {
                                globalFind = order?.OrderItems[
                                  i
                                ]?.iccids?.findIndex(
                                  (ic) => ic.value === e.value
                                );
                              }
                              if (globalFind !== -1) {
                                break;
                              }
                            }
                            if (find === -1 && globalFind === -1) {
                              setSelectedEsim([
                                ...selectedEsim,
                                {
                                  label: e?.label,
                                  value: e?.value,
                                  type: 'esim',
                                },
                              ]);
                            } else {
                              toast.error(
                                'ICCID já selecionado. Escolha outro.'
                              );
                            }
                          } else {
                            toast.error('Limite do pedido atingido');
                          }
                        }
                      }}
                    />
                  </div>
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
                        onDelete={() => handleDeleteEsim(i)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setSelectedEsim([]);
              setSelectedSinCard([]);
              setShowIccid(false);
              setIsOpen(false);
            }}
          >
            CANCELAR
          </Button>
          <Button onClick={handleAddIccid}>ADICIONAR</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

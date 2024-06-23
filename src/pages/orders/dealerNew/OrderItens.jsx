/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { CardData, InputData, TableItens } from './NewOrder.styles';
import { Tooltip } from 'react-tooltip';
import Select from 'react-select';
import { AiFillDelete } from 'react-icons/ai';
import { FaSimCard } from 'react-icons/fa6';

import { Button } from '../../../../globalStyles';
import { toast } from 'react-toastify';
import { qtdChips, translateValue } from '../../../services/util';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import _ from 'lodash';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

// eslint-disable-next-line react/prop-types
export const OrderItens = ({
  handleNextExt,
  goBackStep,
  mustIccid,
  orderItems,
  setOrderItems,
  setSelectedEsim,
  selectedSinCard,
  setSelectedSinCard,
}) => {
  const [selectedPlan, setSelectedPlan] = useState();
  const [qtdSinCard, setQtdSinCard] = useState('');
  const [qtdEsim, setQtdEsim] = useState('');
  const [isChange, setIsChange] = useState(false);
  const [planOpt, setPlanOpt] = useState([]);
  // const [originPlans, setOriginPlans] = useState([]);
  const [isSimcard, setIsSimcard] = useState(false);
  const [isESim, setIsESim] = useState(false);
  const [showModalQtd, setShowModalQtd] = useState(false);
  const [showAddIccid, setShowAddIccid] = useState(false);
  const [tmpItem, setTmpItem] = useState();
  const [qtdItens, setQtdItens] = useState(1);

  useEffect(() => {
    const loadPlans = async () => {
      const response = await api.plans.get(api.currentUser.DealerId);
      let plans = [];
      plans = await response.data;
      const array = [];
      for (const p of plans) {
        const find = orderItems?.findIndex((o) => o.value === p.Id);
        if (find === -1) {
          let isNull = false;
          for (let x = 0; x < p.Products.length; x++) {
            if (p.Products[x].Product.SurfId === null) {
              isNull = true;
              break;
            }
          }
          if (isNull && (p.Products.length > 2 || p.Products.length == 1)) {
            console.log(p);
            array.push({
              value: p.Id,
              label: p.Name,
              Amount: p.Amount,
              Products: p.Products,
              CanUse: p.CanUse,
            });
          }
        }
      }
      // setOriginPlans(array);
      setPlanOpt(array);
    };
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addPlans = (plan) => {
    if (plan !== null) {
      setSelectedPlan(plan || {});
      const array = [...orderItems];
      plan.id =
        array.length === 0 ? 1 : Number(array[array.length - 1]?.id) + 1;
      const openQtd = plan?.Products?.some(
        (p) => p.Product?.Technology === 'NA' || p.Product?.Technology === 'Streaming'
      );

      if (openQtd) {
        setShowModalQtd(true);
      } else {
        plan.qtdItens = 0;
        plan.finalPrice = 0;
        plan.iccids = {};
        plan.portIn = {};
        array.push(plan);
        setOrderItems(array);
        setTmpItem(plan);
        setShowAddIccid(true);
      }
    } else {
      // setPlanOpt(originPlans);
    }
  };

  const cleanAll = () => {
    setTmpItem();
    setQtdEsim('');
    setQtdSinCard('');
  };

  const handleNext = () => {
    if (orderItems.length > 0) {
      if (!canAddGlobal()) {
        handleNextExt();
      } else {
        toast.error('Informe mais Iccid para prosseguir com o pedido.');
      }
    } else {
      toast.error('Adicione pelo menos um item ao seu pedido');
    }
  };

  const handleAdd = () => {
    let openIccid = false;
    if (qtdItens > 0) {
      if (Object.keys(selectedPlan).length !== 0) {
        const array = [...orderItems];
        selectedPlan.qtdItens = qtdItens;
        selectedPlan.finalPrice = qtdItens * selectedPlan.Amount;
        selectedPlan.iccids = {};
        selectedPlan.portIn = {};
        array.push(selectedPlan);
        setOrderItems(array);

        // const orig = _.cloneDeep(planOpt);
        // const find = orig.findIndex((f) => f.value === selectedPlan.value);
        // orig.splice(find, 1);
        // setPlanOpt(orig);
        setTmpItem(selectedPlan);
        openIccid = selectedPlan?.Products?.some(
          (p) =>
            p.Product?.Technology === 'Físico' ||
            p.Product?.Technology === 'e-Sim'
        );

        if (mustIccid) setSelectedPlan(null);
      } else {
        toast.error('Selecione ao menos um plano');
      }
      setQtdItens(1);
      setShowModalQtd(false);
      if (mustIccid && openIccid) setShowAddIccid(true);
    } else {
      toast.error('A quantidade mínima permitida é 1');
    }
  };

  const completOrder = () => {
    const orig = _.cloneDeep(orderItems);
    const find = orig.find((o) => o.id === tmpItem.id);
    find.iccids = { qtdEsim: qtdEsim, qtdSinCard: qtdSinCard };

    // INICIO
    find.qtdItens =
      Number(qtdEsim !== '' ? qtdEsim : 0) +
      Number(qtdSinCard !== '' ? qtdSinCard : 0);
    find.finalPrice =
      (Number(qtdEsim !== '' ? qtdEsim : 0) +
        Number(qtdSinCard !== '' ? qtdSinCard : 0)) *
      find.Amount;
    // FIM

    if (selectedSinCard.length === 0) {
      if ((qtdSinCard !== '' || qtdSinCard !== '0') && qtdSinCard) {
        setSelectedSinCard([
          ...selectedSinCard,
          { orderId: tmpItem.value, sinCard: qtdSinCard },
        ]);
      }
    } else {
      const orig = _.cloneDeep(selectedSinCard);
      const has = orig.findIndex((s) => s.id === tmpItem.id);
      if (has > -1) {
        if (qtdSinCard === '' || qtdSinCard === '0') {
          orig.splice(has, 1);
        } else {
          orig[has].sinCard = qtdSinCard;
        }
        setSelectedSinCard(orig);
      } else {
        if ((qtdSinCard !== '' || qtdSinCard !== '0') && qtdSinCard) {
          setSelectedSinCard([
            ...selectedSinCard,
            { orderId: tmpItem.value, sinCard: qtdSinCard },
          ]);
        }
      }
    }

    setOrderItems(orig);
    setTmpItem();
    setQtdEsim('');
    setQtdSinCard('');
    setShowAddIccid(false);
    setSelectedPlan(null);
    setIsESim(false);
    setIsSimcard(false);
  };

  const handleAddIccid = () => {
    completOrder();
  };

  const handleDelete = (index) => {
    const array = [...orderItems];
    // const orig = _.cloneDeep(planOpt);
    const id = array[index];
    // orig.push(array[index]);
    // setPlanOpt(orig);

    array.splice(index, 1);
    setOrderItems(array);
    if (array.length === 0) {
      setSelectedEsim([]);
      setSelectedSinCard([]);
    } else {
      const sim = _.cloneDeep(selectedSinCard);
      const find = sim.findIndex((s) => s.orderId === id.value);
      if (find > -1) {
        sim.splice(find, 1);
        setSelectedSinCard(sim);
      }
    }
  };

  const qtdFinal = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt = qt + Number(it.qtdItens);
    });
    return qt;
  };

  // const qtdIccids = (itens) => {
  //   let qt = 0;
  //   itens?.forEach((it) => {
  //     qt = qt + Number(it.iccids?.qtdEsim) + Number(it.iccids?.qtdSinCard);
  //   });
  //   return qt;
  // };
  const qtdIccids = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt =
        qt +
        Number(it.iccids?.qtdEsim ? it.iccids?.qtdEsim : 0) +
        Number(it.iccids?.qtdSinCard ? it.iccids?.qtdSinCard : 0);
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

  // const canAddGlobal = () => {
  //   let qtdIccid = 0;
  //   orderItems.forEach((o) => {
  //     qtdIccid += o.Products.length * Number(o.qtdItens);
  //   });
  //   if (qtdIccids(orderItems) === qtdIccid) {
  //     return false;
  //   }
  //   return true;
  // };
  const canAddGlobal = () => {
    let qtdIccid = 0;
    orderItems.forEach((o) => {
      qtdIccid += qtdChips(o.Products) * Number(o.qtdItens);
    });
    if (qtdIccids(orderItems) === qtdIccid) {
      return false;
    }
    return true;
  };

  const handleAddChip = (type, value) => {
    console.log(type, value);
    if (type === 'sincard') {
      setQtdSinCard(value);
    } else {
      setQtdEsim(value);
    }
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
    <>
      <Tooltip id='add-iccid' />
      <CardData>
        <h5>ADICIONE ITENS AO SEU PEDIDO</h5>
        <div>
          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <Select
              options={planOpt}
              placeholder='Selecione...'
              value={selectedPlan}
              isOptionDisabled={(d) => d.CanUse === false}
              onChange={(e) => {
                addPlans(e);
              }}
            />
          </div>

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
                    minHeight: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <h5>SEM ITENS NO PEDIDO</h5>
                </div>
              ) : (
                orderItems.map((o, i) => (
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
                      <AiFillDelete
                        data-tooltip-id='add-iccid'
                        data-tooltip-content='Clique aqui para apagar este item do pedido!'
                        data-tooltip-place='top'
                        size={25}
                        style={{
                          cursor: 'pointer',
                          color: 'red',
                          marginLeft: 5,
                        }}
                        onClick={() => {
                          handleDelete(i);
                        }}
                      />
                    </div>
                    <div
                      style={{ position: 'absolute', top: '8px', left: '16px' }}
                    >
                      <FaSimCard
                        data-tooltip-id='add-iccid'
                        data-tooltip-content='Clique aqui para informar a tecnologia dos chips!'
                        data-tooltip-place='right'
                        size={25}
                        style={{ cursor: 'pointer', color: 'blue' }}
                        onClick={() => {
                          setIsChange(true);
                          setIsESim(o?.iccids?.qtdEsim !== '');
                          setIsSimcard(o?.iccids?.qtdSinCard !== '');
                          setQtdEsim(o?.iccids?.qtdEsim);
                          setQtdSinCard(o?.iccids?.qtdSinCard);
                          setTmpItem(o);
                          setShowAddIccid(true);
                        }}
                      />
                    </div>
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
                    <h4
                      style={{ marginTop: '0.2rem' }}
                    >{`Total: ${translateValue(o.finalPrice)}`}</h4>
                  </div>
                ))
              )}
            </>
          ) : (
            <div style={{ overflowX: window.innerWidth < 768 && 'scroll' }}>
              <TableItens>
                <tr>
                  <th>Item</th>
                  <th>Preço UN</th>
                  <th>Quantidade</th>
                  <th>Chips</th>
                  <th>Total</th>
                </tr>
                {orderItems.length === 0 && (
                  <tr>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                )}
                {orderItems.map((m, i) => (
                  <>
                    <tr key={i}>
                      <td>{m.label}</td>
                      <td>{translateValue(m.Amount)}</td>
                      <td>{m.qtdItens}</td>
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
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <p>{translateValue(m.finalPrice)}</p>
                          <div style={{ display: 'flex' }}>
                            {mustIccid &&
                              m?.Products?.some(
                                (p) =>
                                  p.Product?.Technology === 'Físico' ||
                                  p.Product?.Technology === 'e-Sim'
                              ) && (
                                <FaSimCard
                                  data-tooltip-id='add-iccid'
                                  data-tooltip-content='Clique aqui para informar a tecnologia dos chips!'
                                  data-tooltip-place='right'
                                  size={25}
                                  style={{ cursor: 'pointer', color: 'blue' }}
                                  onClick={() => {
                                    setIsChange(true);
                                    setIsESim(m?.iccids?.qtdEsim !== '');
                                    setIsSimcard(m?.iccids?.qtdSinCard !== '');
                                    setQtdEsim(m?.iccids?.qtdEsim);
                                    setQtdSinCard(m?.iccids?.qtdSinCard);
                                    setTmpItem(m);
                                    setShowAddIccid(true);
                                  }}
                                />
                              )}
                            <AiFillDelete
                              data-tooltip-id='add-iccid'
                              data-tooltip-content='Clique aqui para apagar este item do pedido!'
                              data-tooltip-place='top'
                              size={25}
                              style={{
                                cursor: 'pointer',
                                color: 'red',
                                marginLeft: 5,
                              }}
                              onClick={() => {
                                handleDelete(i);
                              }}
                            />
                          </div>
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
                      <td />
                      <td>{qtdFinal(orderItems)}</td>
                      <td>
                        <div>
                          {qtdSinCards(orderItems) > 0 && (
                            <div>SimCard: {qtdSinCards(orderItems)}</div>
                          )}
                          {qtdESims(orderItems) > 0 && (
                            <div>e-Sim: {qtdESims(orderItems)}</div>
                          )}
                        </div>
                      </td>
                      <td>{priceFinal(orderItems)}</td>
                    </tr>
                  </>
                )}
              </TableItens>
            </div>
          )}
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
            onClick={handleNext}
            style={{ width: window.innerWidth < 768 && '100%' }}
          >
            PRÓXIMO
          </Button>
        </div>
      </CardData>

      <Dialog
        open={showModalQtd}
        onClose={() => setShowModalQtd(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>ITENS</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Quantos itens {selectedPlan?.label} deseja adicionar ao pedido?
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '0.5rem',
              }}
            >
              <InputData
                id='qtd'
                type='number'
                placeholder='Quantidade de itens'
                style={{ width: '100%' }}
                autoFocus
                value={qtdItens}
                onChange={(e) => setQtdItens(e.target.value)}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setShowModalQtd(false)}>
            CANCELAR
          </Button>
          <Button onClick={handleAdd}>ADICIONAR</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showAddIccid}
        onClose={() => setShowAddIccid(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        fullWidth
      >
        <DialogTitle id='alert-dialog-title'>CHIPS</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {`Informe a tecnologia ${
              tmpItem?.Products?.length * Number(tmpItem?.qtdItens) > 1
                ? 'dos'
                : 'do'
            } ${
              tmpItem?.Products?.length * Number(tmpItem?.qtdItens) > 1
                ? tmpItem?.Products?.length * Number(tmpItem?.qtdItens)
                : ''
            } ${
              tmpItem?.Products?.length * Number(tmpItem?.qtdItens) > 1
                ? 'CHIPS'
                : 'CHIP'
            } que deseja para o ${tmpItem?.label}`}
            
            {mustIccid && orderItems.length > 0 && (
              <>
                <FormGroup
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        // disabled={tmpItem?.qtdItens > 1}
                        sx={{
                          '&.Mui-checked': {
                            color: 'green',
                          },
                        }}
                        checked={isSimcard}
                        onChange={(e) => {
                          setIsSimcard(e.target.checked);
                          if (!e.target.checked) {
                            setQtdSinCard('');
                          }
                        }}
                      />
                    }
                    label='SimCard'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        // disabled={tmpItem?.qtdItens > 1}
                        sx={{
                          '&.Mui-checked': {
                            color: 'green',
                          },
                        }}
                        checked={isESim}
                        onChange={(e) => {
                          setIsESim(e.target.checked);
                          if (!e.target.checked) {
                            setQtdEsim('');
                          }
                        }}
                      />
                    }
                    label='e-Sim'
                  />
                </FormGroup>
                {isSimcard && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <div
                      style={{
                        display: window.innerWidth > 768 && 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <h5 style={{ marginRight: '1rem' }}>
                        QUANTOS SIMCARD DESEJA?
                      </h5>
                    </div>

                    <div>
                      <InputData
                        id='qtd'
                        // disabled={disabledSincard}
                        type='number'
                        placeholder='SIMCARD (Chip físico) *'
                        style={{ width: '100%' }}
                        // className="input_2"
                        // defaultValue={1}
                        value={qtdSinCard}
                        onChange={(e) => {
                          handleAddChip('sincard', e.target.value);
                          // setQtdSinCard(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                )}
                {isESim && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <div
                      style={{
                        display: window.innerWidth > 768 && 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <h5 style={{ marginRight: '1rem' }}>
                        QUANTOS ESIM DESEJA?
                      </h5>
                    </div>
                    <div>
                      <InputData
                        id='qtd1'
                        type='number'
                        placeholder='e-Sim (Chip virtual) *'
                        style={{ width: '100%' }}
                        value={qtdEsim}
                        onChange={(e) => {
                          handleAddChip('esim', e.target.value);
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              !isChange && handleDelete(orderItems.length - 1);
              cleanAll();
              setShowAddIccid(false);
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

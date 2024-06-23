/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { Button } from '../../../globalStyles';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IoMdMore } from 'react-icons/io';
import moment from 'moment';
import { translateError } from '../../services/util';
import { InputData } from '../resales/Resales.styles';
import { CopyToClipboard } from "react-copy-to-clipboard";

export const OrderInfo = ({
  order,
  search,
  pageNum,
  pageSize,
  personalOrders,
}) => {
  const navigate = useNavigate();

  const [tmpOrder, setTmpOrder] = useState();
  const [orderToActivate, setOrderToActivate] = useState([]);
  const [showActivate, setShowActivate] = useState(false);

  const [itemsToShow, setItemsToShow] = useState([]);
  const [showItems, setShowItems] = useState(false);

  const [pixInf, setPixInf] = useState();
  const [showResendEmail, setShowResendEmail] = useState(false);
  const [showQrcodeLink, setShowQrcodeLink] = useState(false);
  const [showUpdateFreigh, setShowUpdateFreigh] = useState(false);
  const [loadingUpdateFreigh, setLoadingUpdateFreigh] = useState(false);
  const [loadingResendEmail, setLoadingResendEmail] = useState(false);
  const [loadingActiveIccid, setLoadingActiveIccid] = useState(false);

  const [showActiv, setShowActiv] = useState(false);
  const [tmpIccid, setTmpIccid] = useState();
  const [ddd, setDdd] = useState('');
  const [cpf, setCpf] = useState('');
  const [editCpf, setEditCpf] = useState(false);

  const [email, setEmail] = useState('');
  const [details, setDetails] = useState();
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'Created':
        return 'Pedido criado';
      case 'AWAITING_RISK_ANALYSIS':
        return 'Pagamento aguardando análise de risco';
      case 'APPROVED_BY_RISK_ANALYSIS':
        return 'Pagamento aprovado pela análise de risco';
      case 'REPROVED_BY_RISK_ANALYSIS':
        return 'Pagamento reprovado pela análise de risco';
      case 'PENDING':
        return 'Pagamento pendente';
      case 'UPDATED':
        return 'Pagamento atualizado';
      case 'CONFIRMED':
        return 'Pagamento confirmado';
      case 'RECEIVED':
        return 'Pagamento recebido';
      case 'ANTICIPATED':
        return 'Pagamento antecipado';
      case 'OVERDUE':
        return 'Pagamento vencido';
      case 'REFUNDED':
        return 'Pagamento estornado';
      case 'REFUND_IN_PROGRESS':
        return 'Estorno de pagamento em processamento';
      case 'RECEIVED_IN_CASH_UNDONE':
        return 'Recebimento em dinheiro desfeito';
      case 'CHARGEBACK_REQUESTED':
        return 'Chargeback recebido';
      case 'CHARGEBACK_DISPUTE':
        return 'Em disputa de chargeback';
      case 'AWAITING_CHARGEBACK_REVERSAL':
        return 'Aguardando repasse do adquirente';
      case 'DUNNING_RECEIVED':
        return 'Negativação recebida';
      case 'DUNNING_REQUESTED':
        return 'Negativação requisitada';
      case 'BANK_SLIP_VIEWED':
        return 'Boleto de cobrança visualizado pelo cliente';
      case 'CHECKOUT_VIEWED':
        return 'Fatura de cobrança visualizado pelo cliente';
      case 'CANCELED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const translatePlanType = (planType) => {
    let translated = '';
    planType === '4533'
      ? (translated = 'Plano 4GB')
      : planType === '4534'
      ? (translated = 'Basic 7GB')
      : planType === '4535'
      ? (translated = 'Start 13GB')
      : planType === '4536'
      ? (translated = 'Gold 21GB')
      : planType === '4537'
      ? (translated = 'Plus 44GB')
      : planType === '4511'
      ? (translated = 'Family 80GB')
      : planType === '4512'
      ? (translated = 'Ultra 100GB')
      : (translated = 'Desconhecido');

    return translated;
  };

  const orderHasChipsToActivate = (items) => {
    if (items?.length > 0) {
      return items.some((i) =>
        i.TrackerIccid.some((d) => d?.Iccid?.Status === 'NOT USED')
      );
    }
    return false;
  };

  const orderHasIccids = (items) => {
    if (items?.length > 0) {
      for (let i in items) {
        if (items[i].TrackerIccid?.length > 0) {
          return false;
        } else {
          return true;
        }
      }
      return true;
    }
  };

  const orderCanActivate = (payment) => {
    if (payment.BillingType === 'PIX') {
      return true;
    } else if (payment.BillingType === 'CREDIT_CARD') {
      return payment.Status === 'CONFIRMED' || payment.Status === 'RECEIVED';
    }
    return false;
  };

  const handleActivate = (o) => {
    const planArray = [];
    o.OrderItems.forEach((oI) => {
      oI.TrackerIccid.forEach((id) => {
        if (id.Iccid.Status === 'NOT USED') {
          planArray.push({
            planId: id.Iccid.AwardedSurfPlan,
            document: o.FinalClientId
              ? o.FinalClient.Cnpj || o.FinalClient.Cpf
              : o.DealerPayer.Cnpj || o.DealerPayer.Cpf,
            ddd: oI.Ddd,
            iccid: id.IccidId,
          });
        }
      });
    });

    if (planArray.length === 1) {
      navigate(
        `/iccids/logged/link?PlanId=${planArray[0].planId}&Document=${planArray[0].document}&Ddd=${planArray[0].ddd}`,
        {
          state: {
            iccids: [planArray[0].iccid],
          },
        }
      );
    } else {
      setOrderToActivate(planArray);
    }
  };

  const handleItems = (order) => {
    const array = [];
    setTmpOrder(order);
    order.OrderItems.forEach((oI) => {
      oI.TrackerIccid.forEach((id) => {
        array.push(id.Iccid);
      });
    });
    if (array.length === 0) {
      toast.info('Esse pedido não possui ICCIDS');
    } else {
      setItemsToShow(array);
    }
  };

  const handleUpdateFreigh = () => {
    setLoadingUpdateFreigh(true);
    api.order
      .checkFreightStatus(order.Id)
      .then((res) => {
        toast.success(res.data.Message);
        search(pageNum, 'all', pageSize);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoadingUpdateFreigh(false);
        setShowUpdateFreigh(false);
      });
  };

  useEffect(() => {
    if (orderToActivate.length !== 0) {
      setShowActivate(true);
    }
  }, [orderToActivate]);

  useEffect(() => {
    if (itemsToShow.length !== 0) {
      setShowItems(true);
    }
  }, [itemsToShow]);

  const generateLink = (e) => {
    api.order
      .payGetLink(e.Id)
      .then(async (res) => {
        setPixInf(res?.data?.QrCodePix);
        setShowQrcodeLink(true);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setAnchorEl(null));
  };

  const handleResend = (e) => {
    setDetails(e);
    setEmail(e?.FinalClient?.Email);
    setShowResendEmail(true);
  };

  // const handleCopy = async () => {
  //   try {
  //     if ('clipboard' in navigator) {
  //       await navigator.clipboard.writeText(pixInf?.payload);
  //     } else {
  //       document.execCommand('copy', true, pixInf?.payload);
  //     }
  //     toast.info('Pix copia e cola copiado para área de transferência');
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const sendEmail = () => {
    setLoadingResendEmail(true);

    api.order
      .resendEmail(details.Id, email)
      .then((res) => {
        toast.info(res.data?.Message);
        setShowResendEmail(false);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoadingResendEmail(false));
  };

  const handleActiv = () => {
    const cpfCnpjFinal = cpf.replace(/\D/g, '');
    if (ddd !== '') {
      if (cpfCnpjFinal.length === 11 || cpfCnpjFinal.length === 14) {
        setLoadingActiveIccid(true);
        api.iccid
          .activate(tmpIccid.Iccid, tmpIccid.AwardedSurfPlan, cpfCnpjFinal, ddd)
          .then((res) => {
            toast.success(res.data.Message);
            setItemsToShow([]);
            setShowActiv(false);
            setTmpIccid();
            setTmpOrder();
            search(pageNum, 'all', pageSize);
          })
          .catch((err) => {
            translateError(err)
          });
      } else {
        toast.error('Verifique o documento (CPF/CNPJ) informado.');
      }
    } else {
      toast.error('É necessário informar o DDD');
    }

    setLoadingActiveIccid(false);
  };

  const handleCpfCnpj = (e) => {
    const data = e.replace(/\D/g, '');
    if (data.length > 11) {
      setCpf(
        data
          .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
          .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2') // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
          .replace(/(\d{4})(\d)/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1')
      );
    } else {
      setCpf(
        data
          .replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1')
      );
    }
  };

  return (
    <>
      <tbody>
        <tr>
          <td>
            {order?.CreatedAt &&
              moment(order.CreatedAt).format('DD/MM/YYYY - HH:mm')}
          </td>
          <td>
            {order.DealerId !== null
              ? order.Dealer.CompanyName || order.Dealer.Name
              : 'TEGG'}
          </td>
          <td>
            {order.DealerPayerId !== null
              ? order.DealerPayer.CompanyName || order.DealerPayer.Name
              : order.FinalClient.Name}
          </td>
          <td>{order.Type === 0 ? 'Compra' : 'Recarga'}</td>
          <td>
            {order.Payments.length > 0
              ? translateStatus(order.Payments[0].Status)
              : ''}
          </td>
          <td>
            {order.Type === 1
              ? '-'
              : order.HaveFreight === false
              ? 'Pedido para retirada na loja física'
              : order.FreightInfo.length === 0
              ? 'Sem status de frete'
              : order.FreightInfo[0].Situation || 'Sem status de frete'}
          </td>
          <td>
            <div>
              <IconButton
                aria-label='more'
                id='long-button'
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup='true'
                onClick={handleClick}
              >
                <IoMdMore />
              </IconButton>
              <Menu
                id='long-menu'
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                  },
                }}
              >
                <MenuItem
                  disabled={order.FreightInfo.length === 0}
                  onClick={() => {
                    setAnchorEl(null);
                    setShowUpdateFreigh(true);
                  }}
                >
                  Atualizar status frete
                </MenuItem>
                {api.currentUser.AccessTypes[0] !== 'CLIENT' && (
                  <MenuItem
                    disabled={!(order?.Payments?.length === 0)}
                    onClick={() => {
                      setAnchorEl(null);
                      handleResend(order);
                    }}
                  >
                    Reenviar pedido via email
                  </MenuItem>
                )}
                {(api.currentUser.AccessTypes[0] === 'CLIENT' ||
                  (api.currentUser.AccessTypes[0] === 'DEALER' &&
                    personalOrders)) && (
                  <MenuItem
                    disabled={order.Payments.length !== 0}
                    onClick={() => {
                      if (order.Type === 0) {
                        navigate(`/orders/pay/${order.Id}`);
                      } else {
                        navigate(`/recharge/pay/${order.Id}`);
                      }
                      setAnchorEl(null);
                    }}
                  >
                    Pagar pedido
                  </MenuItem>
                )}
                {(api.currentUser.AccessTypes[0] === 'CLIENT' ||
                  (api.currentUser.AccessTypes[0] === 'DEALER' &&
                    personalOrders)) && (
                  <MenuItem
                    // disabled={
                    //   !(order.Payments.length > 0) &&
                    //   order.Type === 0 &&
                    //   orderHasChipsToActivate(order.OrderItems)
                    // }
                    // disabled={
                    //   !(
                    //     order.Payments.length !== 0 && order.Payments[0]?.Status !== 'PENDING'
                    //   ) &&
                    //   order.Type === 1 &&
                    //   orderHasChipsToActivate(order.OrderItems)
                    // }
                    disabled={order?.Payments?.length === 0 || order.Payments[0]?.Status === 'PENDING' || order.Type === 0}
                    onClick={() => {
                      if (orderCanActivate(order.Payments[0])) {
                        if (
                          order.OrderItems.every(
                            (oI) => oI.TrackerIccid.length === 0
                          )
                        ) {
                          toast.error(
                            'Você ainda não possui linhas para ativar nesse pedido'
                          );
                        } else {
                          if (
                            order.OrderItems.every((oI) =>
                              oI.TrackerIccid.every(
                                (id) => id.Iccid.Status !== 'NOT USED'
                              )
                            )
                          ) {
                            toast.info(
                              'Todas as linhas desse pedido já foram ativadas.'
                            );
                          } else {
                            handleActivate(order);
                          }
                        }
                      } else {
                        toast.error(
                          'Você ainda não realizou o pagamento desse pedido'
                        );
                      }
                      setAnchorEl(null);
                    }}
                  >
                    Ativar linha
                  </MenuItem>
                )}
                {api.currentUser.AccessTypes[0] === 'TEGG' && (
                  <MenuItem
                    disabled={orderHasIccids(order.OrderItems)}
                    onClick={() => {
                      setAnchorEl(null);
                      handleItems(order);
                    }}
                  >
                    Iccids do pedido
                  </MenuItem>
                )}
                {api.currentUser.AccessTypes[0] === 'DEALER' && (
                  <MenuItem
                    disabled={
                      orderHasIccids(order.OrderItems) ||
                      order.Status !== 'RECEIVED'
                    }
                    onClick={() => {
                      setAnchorEl(null);
                      handleItems(order);
                    }}
                  >
                    Iccids do pedido
                  </MenuItem>
                )}
                <MenuItem
                  disabled={!(order.Payments.length > 0)}
                  onClick={() => {
                    setAnchorEl(null);
                    window.open(order.Payments[0].InvoiceUrl, '_black');
                  }}
                >
                  Recibo
                </MenuItem>
                <MenuItem
                  disabled={!order?.NFe[0]?.PDFLink}
                  onClick={() => {
                    setAnchorEl(null);
                    window.open(order.NFe[0].PDFLink, '_black');
                  }}
                >
                  PDF NF-e
                </MenuItem>
                <MenuItem
                  disabled={!order?.NFe[0]?.XMLLink}
                  onClick={() => {
                    window.open(order.NFe[0].XMLLink, '_black');
                    setAnchorEl(null);
                  }}
                >
                  XML NF-e
                </MenuItem>
                {api.currentUser.AccessTypes[0] !== 'CLIENT' && (
                  <MenuItem
                    onClick={() => {
                      generateLink(order);
                    }}
                  >
                    Gerar Link Pix
                  </MenuItem>
                )}
              </Menu>
            </div>
          </td>
        </tr>
      </tbody>
      <Dialog
        open={showActivate}
        onClose={() => {
          setOrderToActivate([]);
          setShowActivate(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Escolha o plano para ativar
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ul style={{ listStyle: 'none' }}>
                {orderToActivate.length !== 0 ? (
                  orderToActivate.map((o, index) => (
                    <li key={index}>
                      <Button
                        onClick={() =>
                          navigate(
                            `/iccids/logged/link?PlanId=${o.planId}&Document=${o.document}&Ddd=${o.ddd}`,
                            {
                              state: {
                                iccids: [o.iccid],
                              },
                            }
                          )
                        }
                      >
                        {translatePlanType(o.planId)}
                      </Button>
                    </li>
                  ))
                ) : (
                  <li />
                )}
              </ul>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showItems}
        onClose={() => {
          setItemsToShow([]);
          setShowItems(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>ICCIDS do pedido</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflowY: 'scroll',
              }}
            >
              <ul style={{ listStyle: 'none' }}>
                {itemsToShow.length !== 0 ? (
                  itemsToShow.map((i, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: 20,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <p>
                          <span style={{ fontWeight: 'bold' }}>ICCID:</span>{' '}
                          {i.Iccid}
                        </p>
                        <Button
                          disabled={
                            i.Status !== 'NOT USED' || !i.AwardedSurfPlan
                          }
                          style={{ marginLeft: '1.5rem' }}
                          onClick={() => {
                            setTmpIccid(i);

                            handleCpfCnpj(
                              tmpOrder.FinalClientId
                                ? tmpOrder.FinalClient.Cnpj ||
                                    tmpOrder.FinalClient.Cpf
                                : tmpOrder.DealerPayer.Cnpj ||
                                    tmpOrder.DealerPayer.Cpf
                            );
                            setShowItems(false);
                            setShowActiv(true);
                          }}
                        >
                          Ativar
                        </Button>
                      </div>
                      <p>
                        <span style={{ fontWeight: 'bold' }}>Plano:</span>{' '}
                        {translatePlanType(i.AwardedSurfPlan)}
                      </p>
                    </li>
                  ))
                ) : (
                  <li />
                )}
              </ul>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showUpdateFreigh}
        onClose={() => {
          setShowUpdateFreigh(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Atualizar status do frete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deseja atualizar o status do frete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowUpdateFreigh(false);
            }}
          >
            FECHAR
          </Button>
          <Button onClick={() => handleUpdateFreigh()}>
            {loadingUpdateFreigh ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            ) : (
              'REENVIAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showActiv}
        onClose={() => {
          setShowActiv(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Informe o DDD</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Informe o DDD com o qual deseja ativar o ICCID {tmpIccid?.Iccid}
            <h5 style={{ marginTop: '1rem' }}>DDD</h5>
            <InputData
              id='ddd'
              type='number'
              style={{ width: '100%' }}
              placeholder='DDD'
              value={ddd}
              onChange={(e) => setDdd(e.target.value)}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1rem',
              }}
            >
              <h5>CPF/CNPJ</h5>
            </div>
            <InputData
              id='document'
              style={{ width: '100%' }}
              placeholder='CPF/CNPJ'
              disabled={!editCpf}
              value={cpf}
              onChange={(e) => handleCpfCnpj(e.target.value)}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      '&.Mui-checked': {
                        color: 'green',
                      },
                    }}
                    onChange={(e) => setEditCpf(e.target.checked)}
                  />
                }
                label='Editar CPF'
              />
            </FormGroup>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowActiv(false);
              setShowItems(true);
            }}
          >
            CANCELAR
          </Button>
          <Button onClick={handleActiv}>
            {loadingActiveIccid ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            ) : (
              'ATIVAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* QRCODE */}
      <Dialog
        open={showQrcodeLink}
        onClose={() => {
          setShowQrcodeLink(false);
        }}
      >
        <DialogTitle id='alert-dialog-title'>QrCode PIX</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {pixInf && (
              <img src={`data:image/png;base64,${pixInf?.encodedImage}`} />
            )}
          </div>
          <h5>
            Clique no link abaixo para copia-lo para área de transferência
          </h5>
          <div style={{ wordWrap: "", margin: '1rem' }}>
              {pixInf?.payload && (
                <CopyToClipboard
                  text={pixInf?.payload}
                  onCopy={() => toast.info("Pix copia e cola copiado para área de transferência")}
                >
                  <span style={{textAlign: 'center', wordWrap: 'anywhere'}}>{pixInf?.payload}</span>
                </CopyToClipboard>
              )}
            </div>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowQrcodeLink(false);
            }}
          >
            FECHAR
          </Button>
        </DialogActions>
      </Dialog>

      {/* REENVIO DE EMAIL */}
      <Dialog
        open={showResendEmail}
        onClose={() => {
          setShowResendEmail(false);
        }}
      >
        <DialogTitle id='alert-dialog-title'>Reenviar e-mail</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <InputData
              id='email'
              type='text'
              placeholder='Email'
              style={{ width: 250 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowResendEmail(false);
            }}
          >
            FECHAR
          </Button>
          <Button onClick={() => sendEmail()}>
            {loadingResendEmail ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            ) : (
              'Enviar'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

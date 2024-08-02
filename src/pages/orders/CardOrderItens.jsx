import moment from 'moment';
import {
  dataURLtoFile,
  translateError,
  translatePlanType,
  translateStatus,
} from '../../services/util';
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Menu,
  MenuItem,
} from '@mui/material';
import { FaFileUpload } from 'react-icons/fa';
import { FaCamera } from 'react-icons/fa';
import { Button } from '../../../globalStyles';
import { InputData } from '../resales/Resales.styles';
import ReactLoading from 'react-loading';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Webcam from 'react-webcam';
import { CopyToClipboard } from "react-copy-to-clipboard";

/* eslint-disable react/prop-types */
export const CardOderItens = ({ o, search }) => {
  const navigate = useNavigate();
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [orderTemp, setOrderTemp] = useState();
  // modals
  const [showUpdateFreigh, setShowUpdateFreigh] = useState(false);
  const [showResendEmail, setShowResendEmail] = useState(false);
  const [showQrcodeLink, setShowQrcodeLink] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const [loadingUpdateFreigh, setLoadingUpdateFreigh] = useState(false);
  const [loadingResendEmail, setLoadingResendEmail] = useState(false);
  const [loadingActiveIccid, setLoadingActiveIccid] = useState(false);

  const [email, setEmail] = useState('');
  const [details, setDetails] = useState();
  const [tmpOrder, setTmpOrder] = useState();
  const [orderToActivate, setOrderToActivate] = useState([]);
  const [showActivate, setShowActivate] = useState(false);
  const [itemsToShow, setItemsToShow] = useState([]);
  const [pixInf, setPixInf] = useState();

  const [showActiv, setShowActiv] = useState(false);
  const [tmpIccid, setTmpIccid] = useState();
  const [ddd, setDdd] = useState('');
  const [cpf, setCpf] = useState('');
  const [editCpf, setEditCpf] = useState(false);

  const [modalPhoto, setModalPhoto] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const [fileConfirm, setFileConfirm] = useState();
  const [imgSrc, setImgSrc] = useState();

  const sendConfirmation = () => {
    setLoading(true);
    console.log(o.Id);
    api.order
      .sendReceiptOrder(
        fileConfirm || dataURLtoFile(imgSrc, 'comprovante.png'),
        o.Id
      )
      .then((res) => {
        toast.success(res.data.Message);
        setFileConfirm();
        setImgSrc();
        setOpenConfirm(false);
      })
      .catch((err) => {
        console.log(err);
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  const calcAmount = (payment) => {
    let price = 0.0;
    payment?.forEach((p) => {
      price += Number(p.Amount);
    });
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  useEffect(() => {
    if (itemsToShow.length !== 0) {
      setShowItems(true);
    }
  }, [itemsToShow]);

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleResend = (e) => {
    setDetails(e);
    setEmail(e?.FinalClient?.Email);
    setShowResendEmail(true);
  };

  const orderHasChipsToActivate = (items) => {
    if (items?.length > 0) {
      return items.some((i) =>
        i.TrackerIccid.some((d) => d?.Iccid?.Status === 'NOT USED')
      );
    }
    return false;
  };

  const orderCanActivate = (payment) => {
    // ("PAY", payment);
    if (payment.BillingType === 'PIX') {
      // return payment.Status === "RECEIVED";
      return true;
    } else if (payment.BillingType === 'CREDIT_CARD') {
      // (payment.Status);
      return payment.Status === 'CONFIRMED' || payment.Status === 'RECEIVED';
    }
    return false;
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

  const handleItems = (order) => {
    const array = [];
    setTmpOrder(order);
    order.OrderItems.forEach((oI) => {
      oI.TrackerIccid.forEach((id) => {
        array.push(id.Iccid);
      });
    });
    // (array);
    if (array.length === 0) {
      toast.info('Esse pedido não possui ICCIDS');
    } else {
      setItemsToShow(array);
    }
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

  const generateLink = (e) => {
    api.order
      .payGetLink(e.Id)
      .then(async (res) => {
        setPixInf(res?.data?.QrCodePix);
        setShowQrcodeLink(true);
      })
      .catch((err) => {
        console.log(err);
        translateError(err);
      })
      .finally(() => setAnchorEl(null));
  };

  const handleUpdateFreigh = () => {
    setLoadingUpdateFreigh(true);
    api.order
      .checkFreightStatus(orderTemp.Id)
      .then((res) => {
        toast.success(res.data.Message);
        search();
      })
      .catch((err) => {
        console.log(err);
        toast.error('Não foi possível atualizar o status do frete');
      })
      .finally(() => {
        setLoadingUpdateFreigh(false);
        setShowUpdateFreigh(false);
      });
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
              : o.Dealer?.Cnpj || o.Dealer?.Cpf,
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
            // search(pageNum, 'all', pageSize);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        toast.error('Verifique o documento (CPF/CNPJ) informado.');
      }
    } else {
      toast.error('É necessário informar o DDD');
    }

    setLoadingActiveIccid(false);
  };

  return (
    <>
      <div
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
        onClick={handleClick}
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
        <div style={{ position: 'absolute', top: '8px', left: '16px' }}>
          {/* <h5>icone</h5> */}
        </div>
        <h2 style={{ padding: '0.2rem', fontWeight: 'bold' }}>{o.label}</h2>
        <h4>{`Data: ${moment(o.CreatedAt).format('DD/MM/YYYY - HH:mm')}`}</h4>
        <h4>{`VENDEDOR: ${
          o?.DealerId !== null
            ? o?.Dealer?.CompanyName || o?.Dealer?.Name
            : 'TEGG'
        }`}</h4>
        <h4>{`CLIENTE: ${o?.Dealer?.Name || o?.FinalClient?.Name
        }`}</h4>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <h4>{`Tipo: ${o.Type === 0 ? 'Compra' : 'Recarga'}`}</h4>
          <h4>{`Valor: ${calcAmount(o?.OrderItems)}`}</h4>
        </div>
        <h3 style={{ marginTop: '0.2rem' }}>{translateStatus(o.Status)}</h3>
      </div>
      {/* menu */}
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
        {/* <MenuItem
          disabled={o.FreightInfo.length === 0}
          onClick={() => {
            setAnchorEl(null);
            setOrderTemp(o);
            setShowUpdateFreigh(true);
          }}
        >
          Atualizar status frete
        </MenuItem> */}
        <MenuItem
          disabled={
            o?.Status === 'RECEIVED_IN_CASH' ||
            o?.Status === 'RECEIVED' ||
            o?.Status === 'CONFIRMED' ||
            o?.Status === 'PROCESSED' ||
            o?.Status === 'PROCESSING' ||
            o?.Status === 'Created'
          }
          onClick={() => {
            console.log(o);
            // setAnchorEl(null);
            // setOpenConfirm(true);
          }}
        >
          Informar pagamento
        </MenuItem>
        {api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT' && (
          <MenuItem
            disabled={!(o?.Payments?.length === 0)}
            onClick={() => {
              setAnchorEl(null);
              handleResend(o);
            }}
          >
            Reenviar pedido via email
          </MenuItem>
        )}
        {(api.currentUser.AccessTypes[0] === 'CLIENT' ||
        api.currentUser.AccessTypes[0] === 'AGENT' ||
          api.currentUser.AccessTypes[0] === 'DEALER') && (
          <MenuItem
            disabled={
              o.Payments.length !== 0 && o.Payments[0]?.Status !== 'PENDING'
            }
            onClick={() => {
              if (o.Type === 0) {
                navigate(`/orders/pay/${o.Id}`);
              } else {
                navigate(`/recharge/pay/${o.Id}`);
              }
              setAnchorEl(null);
            }}
          >
            {/* {console.log(o.Payments)} */}
            Pagar pedido
          </MenuItem>
        )}
        {api.currentUser.AccessTypes[0] === 'TEGG' && (
          <MenuItem
            disabled={
              o?.Status === 'RECEIVED_IN_CASH' ||
              o?.Status === 'RECEIVED' ||
              o?.Status === 'CONFIRMED' ||
              o?.Status === 'PROCESSED'
            }
            onClick={() => {
              console.log(api.currentUser);
              // setAnchorEl(null);
              window.open(
                `${window.location.href.substring(
                  0,
                  window.location.href.indexOf(location?.pathname)
                )}/orders/pay/${o.Id}`,
                '_black'
              );
            }}
          >
            Pagar
          </MenuItem>
        )}
        {(api.currentUser.AccessTypes[0] === 'CLIENT' ||
        api.currentUser.AccessTypes[0] === 'AGENT' ||
          api.currentUser.AccessTypes[0] === 'DEALER') && (
          <MenuItem
            // disabled={
            //   !(
            //     o.Payments.length !== 0 && o.Payments[0]?.Status !== 'PENDING'
            //   ) &&
            //   o.Type === 1 &&
            //   orderHasChipsToActivate(o.OrderItems)
            // }
            disabled={
              o?.Payments?.length === 0 ||
              o.Payments[0]?.Status === 'PENDING' ||
              o.Type === 0
            }
            onClick={() => {
              if (orderCanActivate(o.Payments[0])) {
                if (o.OrderItems.every((oI) => oI.TrackerIccid.length === 0)) {
                  toast.error(
                    'Você ainda não possui linhas para ativar nesse pedido'
                  );
                } else {
                  if (
                    o.OrderItems.every((oI) =>
                      oI.TrackerIccid.every(
                        (id) => id.Iccid.Status !== 'NOT USED'
                        // && id.Status !== "CREATED"
                      )
                    )
                  ) {
                    toast.info(
                      'Todas as linhas desse pedido já foram ativadas.'
                    );
                  } else {
                    handleActivate(o);
                  }
                }
              } else {
                toast.error('Você ainda não realizou o pagamento desse pedido');
              }
              setAnchorEl(null);
            }}
          >
            Ativar linha
          </MenuItem>
        )}
        {api.currentUser.AccessTypes[0] === 'TEGG' && (
          <MenuItem
            disabled={orderHasIccids(o.OrderItems)}
            onClick={() => {
              setAnchorEl(null);
              handleItems(o);
            }}
          >
            Iccids do pedido
          </MenuItem>
        )}
        {api.currentUser.AccessTypes[0] === 'DEALER' && (
          <MenuItem
            disabled={orderHasIccids(o.OrderItems) || o.Status !== 'RECEIVED'}
            onClick={() => {
              setAnchorEl(null);
              handleItems(o);
            }}
          >
            Iccids do pedido
          </MenuItem>
        )}
        <MenuItem
          disabled={!(o.Payments.length > 0)}
          onClick={() => {
            setAnchorEl(null);
            window.open(o.Payments[0].InvoiceUrl, '_black');
          }}
        >
          Recibo
        </MenuItem>
        <MenuItem
          disabled={!o?.NFe[0]?.PDFLink}
          onClick={() => {
            setAnchorEl(null);
            window.open(o.NFe[0].PDFLink, '_black');
          }}
        >
          PDF NF-e
        </MenuItem>
        <MenuItem
          disabled={!o?.NFe[0]?.XMLLink}
          onClick={() => {
            window.open(o.NFe[0].XMLLink, '_black');
            setAnchorEl(null);
          }}
        >
          XML NF-e
        </MenuItem>
        {api.currentUser.AccessTypes[0] !== 'CLIENT' || api.currentUser.AccessTypes[0] !== 'AGENT' && (
          <MenuItem
            // disabled={o?.Payments[0]?.Status === 'RECEIVED'}
            // disabled
            disabled={
              o?.Payments[0]?.Status === 'RECEIVED_IN_CASH' ||
              o?.Payments[0]?.Status === 'RECEIVED' ||
              o?.Payments[0]?.Status === 'CONFIRMED' ||
              o?.Payments[0]?.Status === 'PROCESSED' ||
              o?.Payments[0]?.Status === 'Created'
            }
            onClick={() => {
              generateLink(o);
            }}
          >
            Gerar Link Pix
          </MenuItem>
        )}
      </Menu>
      {/* fim menu */}
      {/* confirmar pagamento */}
      <Dialog
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
        fullWidth
      >
        <DialogTitle id='alert-dialog-title'>PAGAMENTO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <h5>Informe o arquivo</h5>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {imgSrc ? (
                <img src={imgSrc} />
              ) : (
                <InputData
                  disabled
                  placeholder='Arquivo...'
                  value={fileConfirm?.name}
                  style={{ width: '100%' }}
                />
              )}
              <FaFileUpload
                size={25}
                onClick={() => fileRef.current.click()}
                style={{
                  color: '#00D959',
                  marginLeft: '1rem',
                  cursor: 'pointer',
                }}
              />
              <FaCamera
                size={25}
                onClick={() => setModalPhoto(true)}
                style={{
                  color: '#00D959',
                  marginLeft: '1rem',
                  cursor: 'pointer',
                }}
              />
            </div>
          </DialogContentText>
          <DialogActions style={{ marginTop: '1rem' }}>
            <Button
              invert
              onClick={() => {
                setOpenConfirm(false);
                setFileConfirm();
                setImgSrc();
              }}
            >
              CANCELAR
            </Button>
            <Button onClick={sendConfirmation}>
              {loading ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 15,
                  }}
                >
                  <ReactLoading type={'bars'} color={'#00D959'} />
                </div>
              ) : (
                'CONFIRMAR'
              )}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {/* camera */}
      <Dialog open={modalPhoto}>
        <DialogContent>
          <Webcam
            audio={false}
            height={'100%'}
            screenshotFormat='image/jpeg'
            width={'100%'}
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: 'environment',
            }}
          >
            {({ getScreenshot }) => (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '2rem',
                }}
              >
                <Button
                  onClick={() => {
                    const imageSrc = getScreenshot();
                    setImgSrc(imageSrc);
                    setModalPhoto(false);
                  }}
                >
                  Capturar
                </Button>
              </div>
            )}
          </Webcam>
        </DialogContent>
      </Dialog>

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
                  <li>{''}</li>
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
        // fullWidth
      >
        <DialogTitle id='alert-dialog-title'>ICCIDS do pedido</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // overflowY: 'scroll',
                // maxHeight: '300px'
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
                        {console.log(i)}
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
                                : tmpOrder.Dealer?.Cnpj ||
                                    tmpOrder.Dealer?.Cpf
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
                  <li>{''}</li>
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
            {/* <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}> */}
            <h5 style={{ marginTop: '1rem' }}>DDD</h5>
            <InputData
              id='ddd'
              type='number'
              style={{ width: '100%' }}
              placeholder='DDD'
              // style={{ width: 250 }}
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
              // style={{ width: 250 }}
              value={cpf}
              onChange={(e) => handleCpfCnpj(e.target.value)}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      // color: pink[800],
                      // marginLeft: '1rem',
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
            {/* </div> */}
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
          {/* <DialogContentText id='alert-dialog-description'> */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {pixInf && (
              <img src={`data:image/png;base64,${pixInf?.encodedImage}`} />
            )}
          </div>
          {/* <div style={{justifyContent: 'center', padding: '2rem'}}> */}
          {/* <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}> */}
          <h4 style={{ fontWeight: "bold", color: "#00D959", textAlign: 'center', marginBottom: '1rem' }}>
                Clique no texto abaixo para copiar
              </h4>
          
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
          {/* </div> */}
          {/* </DialogContentText> */}
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
              // disabled={searched}
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
      <input
        ref={fileRef}
        type='file'
        style={{ opacity: 0 }}
        onChange={() => {
          console.log(fileRef.current.files[0]);
          setFileConfirm(fileRef.current.files[0]);
        }}
        className='form-control'
      />
    </>
  );
};

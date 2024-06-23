import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
} from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { IoMdMore } from 'react-icons/io';
import { toast } from 'react-toastify';
import api from '../../services/api';
import {
  dataURLtoFile,
  translateError,
  translateStatus,
} from '../../services/util';
import { Button } from '../../../globalStyles';
import ReactLoading from 'react-loading';
import { InputData } from '../resales/Resales.styles';
import { FaFileUpload } from 'react-icons/fa';
// import { FaCamera } from 'react-icons/fa';
import Webcam from 'react-webcam';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from "react-copy-to-clipboard";

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
/* eslint-disable react/prop-types */
export const OrderItensTable = ({
  ord,
  fileRef,
  fileConfirm,
  setFileConfirm,
}) => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();

  const [orderTemp, setOrderTemp] = useState();
  // modals
  const [showUpdateFreigh, setShowUpdateFreigh] = useState(false);
  const [showResendEmail, setShowResendEmail] = useState(false);
  const [showQrcodeLink, setShowQrcodeLink] = useState(false);
  const [showItems, setShowItems] = useState(false);
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

  const [loading, setLoading] = useState(false);

  const [modalPhoto, setModalPhoto] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  // const fileRef = useRef(null);
  // const [fileConfirm, setFileConfirm] = useState();
  const [imgSrc, setImgSrc] = useState();

  const sendConfirmation = () => {
    setLoading(true);
    api.order
      .sendReceiptOrder(
        fileConfirm || dataURLtoFile(imgSrc, 'comprovante.png'),
        ord.Id
      )
      .then((res) => {
        toast.success(res.data.Message);
        setFileConfirm();
        setImgSrc();
        setOpenConfirm(false);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
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

 

  const orderCanActivate = (payment) => {
    if (payment.BillingType === 'PIX') {
      return true;
    } else if (payment.BillingType === 'CREDIT_CARD') {
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
  //     toast.info(t('Order.table.copyPixMsg'));
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const sendEmail = () => {
    setLoadingResendEmail(true);

    console.log(details.Id, email);
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
      toast.info(t('Order.table.notHaveIccid'));
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
        translateError(err);
      })
      .finally(() => setAnchorEl(null));
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
            ddd: oI.ActivationDdd,
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
          })
          .catch((err) => {
            translateError(err);
          });
      } else {
        toast.error(t('Order.table.verifyDocument'));
      }
    } else {
      toast.error(t('Order.table.mustDDD'));
    }
    setLoadingActiveIccid(false);
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


  return (
    <>
      <tr>
        {(api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT') && (
          <td>{ord?.NFe[0]?.Number}</td>
        )}
        <td>{moment(ord.CreatedAt).format('DD/MM/YYYY HH:mm')}</td>
        <td>
          {ord.DealerId !== null
            ? ord.Dealer?.CompanyName || ord.Dealer?.Name
            : 'TEGG'}
        </td>
        <td>
          {ord.DealerId !== null
            ? ord?.Dealer?.CompanyName || ord.Dealer?.Name
            : ord?.FinalClient?.Name}
        </td>
        <td>{ord.Type === 0 ? t('Order.table.sale') : t('Order.table.recharge')}</td>
        <td>{calcAmount(ord?.OrderItems)}</td>
        <td>{translateStatus(ord.Status)}</td>
        <td>
          {ord.Type === 1
            ? '-'
            : ord.HaveFreight === false
            ? t('Order.table.store')
            : ord.FreightInfo.length === 0
            ? t('Order.table.notStatusFreight')
            : ord.FreightInfo[0].Situation || t('Order.table.notStatusFreight')}
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
              // onClick={() => console.log(ord)}
            >
              {/* <MoreVertIcon /> */}
              <IoMdMore />
            </IconButton>
          </div>
        </td>
      </tr>
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
        {(api.currentUser.AccessTypes[0] === 'CLIENT' ||
        api.currentUser.AccessTypes[0] === 'AGENT' ||
          api.currentUser.AccessTypes[0] === 'DEALER') && (
          <>
            {api.currentUser.AccessTypes[0] === 'DEALER' &&
              ord?.DealerPayerId === api.currentUser?.DealerId && (
                <MenuItem
                  disabled={
                    ord?.Status === 'RECEIVED_IN_CASH' ||
                    ord?.Status === 'RECEIVED' ||
                    ord?.Status === 'CONFIRMED' ||
                    ord?.Status === 'PROCESSED'
                  }
                  onClick={() => {
                    window.open(
                      `${window.location.href.substring(
                        0,
                        window.location.href.indexOf(location?.pathname)
                      )}/orders/pay/${ord.Id}`,
                      '_black'
                    );
                  }}
                >
                  {t('Order.table.buttonPay')}
                </MenuItem>
              )}

            <MenuItem
              disabled={
                ord?.Status === 'RECEIVED_IN_CASH' ||
                ord?.Status === 'RECEIVED' ||
                ord?.Status === 'CONFIRMED' ||
                ord?.Status === 'PROCESSED' ||
                ord?.Payments?.some((p) => p?.BillingType !== 'BOLETO') ||
                ord?.Payments?.length === 0
              }
              onClick={() => {
                setAnchorEl(null);
                window.open(ord?.Payments[0]?.BankSlipUrl, '_black');
              }}
            >
              {t('Order.table.buttonTicket')}
            </MenuItem>
            <MenuItem
              disabled={
                ord?.Status === 'RECEIVED_IN_CASH' ||
                ord?.Status === 'RECEIVED' ||
                ord?.Status === 'CONFIRMED' ||
                ord?.Status === 'PROCESSED' ||
                ord?.Status === 'AWAITINGPROCESSING' ||
                ord?.Status === 'PROCESSING' ||
                ord?.Status === 'CREATED' ||
                ord?.Status === 'Created'
              }
              onClick={() => {
                setAnchorEl(null);
                setOpenConfirm(true);
              }}
            >
              {t('Order.table.buttonInformPayment')}
            </MenuItem>
            <MenuItem
              disabled={
                ord?.Payments?.length === 0 ||
                ord.Payments[0]?.Status === 'PENDING' ||
                ord.Type === 0
              }
              onClick={() => {
                if (orderCanActivate(ord.Payments[0])) {
                  if (
                    ord.OrderItems.every((oI) => oI.TrackerIccid.length === 0)
                  ) {
                    toast.error(
                      t('Order.table.msgErrorNotLineActiv')
                    );
                  } else {
                    if (
                      ord.OrderItems.every((oI) =>
                        oI.TrackerIccid.every(
                          (id) => id.Iccid.Status !== 'NOT USED'
                          // && id.Status !== "CREATED"
                        )
                      )
                    ) {
                      toast.info(
                        t('Order.table.allActivated')
                      );
                    } else {
                      // console.log(ord)
                      handleActivate(ord);
                    }
                  }
                } else {
                  toast.error(
                    t('Order.table.notHavePayment')
                  );
                }
                setAnchorEl(null);
              }}
            >
              {t('Order.table.buttonActivate')}
            </MenuItem>
          </>
        )}
        {(api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT' )&& (
          <MenuItem
            // disabled={ord?.Status !== 'RECEIVED' }
            onClick={() => {
              setAnchorEl(null);
              console.log(ord);
              navigate(`/orders/${ord.Id}`)
              // setShowUpdateFreigh(true);
            }}
          >
            {t('Order.table.buttonDetails')}
          </MenuItem>
        )}

        {/* RECEIVED */}
        <MenuItem
          disabled={ord.FreightInfo.length === 0}
          onClick={() => {
            setAnchorEl(null);
            setOrderTemp(ord);
            setShowUpdateFreigh(true);
          }}
        >
          {t('Order.table.buttonDetailsFreight')}
        </MenuItem>
        {(api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT' )&& (
          <MenuItem
            disabled={
              ord?.Payments[0]?.Status === 'RECEIVED_IN_CASH' ||
              ord?.Payments[0]?.Status === 'RECEIVED' ||
              ord?.Payments[0]?.Status === 'CONFIRMED' ||
              ord?.Payments[0]?.Status === 'PROCESSED' ||
              ord?.Payments[0]?.Status === 'Created'
            }
            onClick={() => {
              generateLink(ord);
            }}
          >
             {t('Order.table.buttonLinkPix')}
          </MenuItem>
        )}

        {api.currentUser.AccessTypes[0] === 'TEGG' && (
          <MenuItem
            disabled={orderHasIccids(ord.OrderItems)}
            onClick={() => {
              setAnchorEl(null);
              handleItems(ord);
            }}
          >
             {t('Order.table.iccidsFromOrder')}
          </MenuItem>
        )}
         {(api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT') && (
          <MenuItem
            disabled={
              ord?.Payments[0]?.Status === 'RECEIVED_IN_CASH' ||
              ord?.Payments[0]?.Status === 'RECEIVED' ||
              ord?.Payments[0]?.Status === 'CONFIRMED' ||
              ord?.Payments[0]?.Status === 'PROCESSED' ||
              ord?.Payments[0]?.Status === 'Created'
            }
            onClick={() => {
              navigate(`/orders/pay/${ord?.Id}`)
            }}
          >
            {t('Order.table.pay')}
          </MenuItem>
        )}
        {api.currentUser.AccessTypes[0] === 'DEALER' && (
          <MenuItem
            disabled={
              orderHasIccids(ord.OrderItems) || ord.Status !== 'RECEIVED'
            }
            onClick={() => {
              setAnchorEl(null);
              handleItems(ord);
            }}
          >
            {t('Order.table.iccidsFromOrder')}
          </MenuItem>
        )}
        <MenuItem
          disabled={!ord?.NFe[0]?.PDFLink}
          onClick={() => {
            setAnchorEl(null);
            window.open(ord.NFe[0].PDFLink, '_black');
          }}
        >
         {t('Order.table.invoicePdf')}
        </MenuItem>
        {(api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT') && (
          <MenuItem
            disabled={!(ord?.Payments?.length === 0)}
            onClick={() => {
              setAnchorEl(null);
              handleResend(ord);
            }}
          >
           {t('Order.table.resendEmail')}
          </MenuItem>
        )}
        {(api.currentUser.AccessTypes[0] === 'CLIENT' || api.currentUser.AccessTypes[0] === 'AGENT') && (
          <MenuItem
            disabled={ord.Payments.length !== 0}
            onClick={() => {
              // if (ord.Type === 0) {
              navigate(`/orders/pay/${ord.Id}`);
              // } else {
              //   navigate(`/recharge/pay/${ord.Id}`);
              // }
              setAnchorEl(null);
            }}
          >
            {t('Order.table.payOrder')}
          </MenuItem>
        )}
        <MenuItem
          disabled={!(ord.Payments.length > 0)}
          onClick={() => {
            setAnchorEl(null);
            window.open(ord.Payments[0].InvoiceUrl, '_black');
          }}
        >
          {t('Order.table.receipt')}
        </MenuItem>
        <MenuItem
          disabled={!ord?.NFe[0]?.XMLLink}
          onClick={() => {
            window.open(ord.NFe[0].XMLLink, '_black');
            setAnchorEl(null);
          }}
        >
          {t('Order.table.invoiceXml')}
        </MenuItem>
      </Menu>
      {/* confirmar pagamento */}
      <Dialog
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
        fullWidth
      >
        <DialogTitle id='alert-dialog-title'>{t('Order.table.modalPayment.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <h5>{t('Order.table.modalPayment.informDocument')}</h5>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {imgSrc ? (
                <img src={imgSrc} />
              ) : (
                <InputData
                  disabled
                  placeholder={t('Order.table.modalPayment.documentPlaceHolder')}
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
              {t('Order.table.modalPayment.buttonCancel')}
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
                  <ReactLoading type={'bars'} color={'#fff'} />
                </div>
              ) : (
                t('Order.table.modalPayment.buttonConfirm')
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
                  {t('Order.table.modalPhoto.capture')}
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
        {t('Order.table.modalActive.title')}
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
        <DialogTitle id='alert-dialog-title'>{t('Order.table.modalShowItens.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflowY: 'scroll',
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
                          <span style={{ fontWeight: 'bold' }}>{t('Order.table.modalShowItens.iccid')}:</span>{' '}
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
                          {t('Order.table.modalShowItens.buttonActivate')}
                        </Button>
                      </div>
                      <p>
                        <span style={{ fontWeight: 'bold' }}>{t('Order.table.modalShowItens.plan')}:</span>{' '}
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
        <DialogTitle id='alert-dialog-title'>{t('Order.table.modalFreight.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {orderTemp?.FreightInfo[0]?.FreightDetails?.map((f) => (
              <>
                <div key={f.Id} style={{ display: 'flex' }}>
                  <h5>
                    {moment(f.OcurrenceDate).format('DD/MM/YYYY - HH:mm')}
                  </h5>
                  {f.OcurrenceDescription ===
                  'Entregue (Comprovante digitalizado)' ? (
                    <h5>
                      - {t('Order.table.modalFreight.received')}{' '}
                      <span
                        style={{
                          color: 'blue',
                          cursor:
                            orderTemp?.FreightInfo[0]?.ReceiptUrl && 'pointer',
                        }}
                        onClick={() =>
                          orderTemp?.FreightInfo[0]?.ReceiptUrl &&
                          window.open(
                            orderTemp?.FreightInfo[0]?.ReceiptUrl,
                            '_black'
                          )
                        }
                      >
                        {t('Order.table.modalFreight.receipt')}
                      </span>
                    </h5>
                  ) : (
                    <h5>- {f.OcurrenceDescription}</h5>
                  )}
                </div>
                {f.OcurrenceDescription === 'Entregue' && <h5>{f.Comments}</h5>}
              </>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowUpdateFreigh(false);
            }}
          >
            {t('Order.table.modalFreight.buttonClose')}
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
        <DialogTitle id='alert-dialog-title'>{t('Order.table.modalActiveIccid.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
          {t('Order.table.modalActiveIccid.msg')} {tmpIccid?.Iccid}
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
              <h5>{t('Order.table.modalActiveIccid.document')}</h5>
            </div>
            <InputData
              id='document'
              style={{ width: '100%' }}
              placeholder={t('Order.table.modalActiveIccid.document')}
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
                label={t('Order.table.modalActiveIccid.editCpf')}
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
            {t('Order.table.modalActiveIccid.buttonCancel')}
          </Button>
          <Button onClick={handleActiv}>
            {loadingActiveIccid ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            ) : (
              t('Order.table.modalActiveIccid.buttonActive')
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
        <DialogTitle id='alert-dialog-title'>{t('Order.table.modalPix.title')}</DialogTitle>
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
            <div style={{ wordWrap: "" }}>
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
            {t('Order.table.modalPix.buttonClose')}
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
        <DialogTitle id='alert-dialog-title'>{t('Order.table.modalSendMail.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <InputData
              id='email'
              type='text'
              placeholder={t('Order.table.modalSendMail.placeHolder')}
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
            {t('Order.table.modalSendMail.buttonClose')}
          </Button>
          <Button onClick={() => sendEmail()}>
            {loadingResendEmail ? (
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
              t('Order.table.modalSendMail.buttonSend')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

/* eslint-disable react/prop-types */
import moment from 'moment';
import api from '../../services/api';
import Webcam from 'react-webcam';
import { FaFileUpload } from 'react-icons/fa';
import { FaCamera } from 'react-icons/fa';
import { InputData, TableItens } from '../clients/new/NewClient.styles';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { useRef, useState } from 'react';
import { IoMdMore } from 'react-icons/io';
import Select from 'react-select';
import { Button } from '../../../globalStyles';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';
import {
  dataURLtoFile,
  translateError,
  translateStatus,
} from '../../services/util';

export const OrderItensTableClient = ({ orders }) => {
  const [tmpOrder, setTmpOrder] = useState();
  const [esim, setEsim] = useState();
  const [esimOpt, setEsimOpt] = useState([]);
  const [openEsim, setOpenEsim] = useState(false);
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showFreigh, setShowFreigh] = useState(false);

  const [loading, setLoading] = useState(false);

  const [modalPhoto, setModalPhoto] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const fileRef = useRef(null);
  const [fileConfirm, setFileConfirm] = useState();
  const [imgSrc, setImgSrc] = useState();

  const sendConfirmation = () => {
    setLoading(true);
    api.order
      .sendReceipt(
        fileConfirm || dataURLtoFile(imgSrc, 'comprovante.png'),
        tmpOrder.Id
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

  const searchEsim = (e) => {
    const list = [];
    e.PurchaseOrderItems?.forEach((item) => {
      item?.TrackerIccid?.forEach((i) => {
        if (i?.Iccid?.LPAUrl) {
          list.push({ label: i.IccidId, value: i.IccidId });
        }
      });
    });
    setEsimOpt(list);
  };

  const returnQtdEsim = (items) => {
    let eSim = 0;
    items.forEach((item) => {
      eSim += item.QuantityEsim;
    });
    return eSim;
  };

  const returnQtdSimCard = (items) => {
    let simCard = 0;
    items.forEach((item) => {
      simCard += item.QuantitySimCard;
    });
    return simCard;
  };

  const handleClick = (event, order) => {
    setTmpOrder(order);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getQrcode = () => {
    if (esim) {
      setLoading(true);
      api.iccid
        .getlpaqrcode(esim.value)
        .then((res) => {
          var blob = new Blob([res.data], { type: 'application/octet-stream' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.download = 'esim.pdf';
          a.href = url;
          document.body.appendChild(a);
          a.click();
          setOpenEsim(false);
          setEsim();
          toast.success('Download do pdf realizado com sucesso.');
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.error('Selecione um Iccid');
    }
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
      <TableItens style={{ marginTop: 20 }}>
        <tr>
          <th>Cliente</th>
          {api.currentUser.AccessTypes[0] === 'TEGG' && <th>REVENDA</th>}
          <th>Valor</th>
          <th>Status</th>
          <th>Itens DO PEDIDO</th>
          <th>Criação</th>
          <th>Status frete</th>
          <th>Iccids</th>
        </tr>
        {orders.length === 0 && (
          <tr>
            <td colSpan='7'>
              <h5 style={{ textAlign: 'center' }}>Sem pedidos</h5>{' '}
            </td>
          </tr>
        )}

        {orders.map((o) => (
          <tr key={o.Id}>
            <td>{o?.FinalClient?.Name || o?.Dealer?.Name}</td>
            {api.currentUser.AccessTypes[0] === 'TEGG' && (
              <td>{o?.Dealer?.Name || 'TEGG'}</td>
            )}
            <td>{calcAmount(o?.PurchaseOrderItems)}</td>
            <td>{translateStatus(o?.Status)}</td>
            <td>
              {o?.PurchaseOrderItems?.map((i, ii) => (
                <h5 key={ii}>{i?.Plan?.Name}</h5>
              ))}
            </td>
            <td>{moment(o?.CreatedAt).format('DD/MM/YYYY HH:mm')}</td>
            <td>
              {o.Type === 1
                ? '-'
                : o.HaveFreight === false
                ? 'Pedido para retirada na loja física'
                : o.FreightInfo.length === 0
                ? 'Sem status de frete'
                : o.FreightInfo[0].Situation || 'Sem status de frete'}
            </td>
            <td>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {console.log()}
                {o.PurchaseOrderItems?.some((p) =>
                  p?.Plan?.Products?.some(
                    (pr) => pr?.Product?.Technology !== 'NA'
                  )
                ) ? (
                  <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    {returnQtdSimCard(o?.PurchaseOrderItems) > 0 &&<h5>SimCard: {returnQtdSimCard(o?.PurchaseOrderItems)}</h5>}
                    {returnQtdEsim(o?.PurchaseOrderItems) > 0&&<h5>e-Sim: {returnQtdEsim(o?.PurchaseOrderItems)}</h5>}
                  </div>
                ): <div/>}

                <div>
                  <IconButton
                    aria-label='more'
                    id='long-button'
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup='true'
                    onClick={(e) => handleClick(e, o)}
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
                      },
                    }}
                  >
                    {tmpOrder?.Payments[0]?.BillingType === 'BOLETO' && (
                      <MenuItem
                        onClick={() => {
                          setAnchorEl(null);
                          window.open(
                            tmpOrder?.Payments[0]?.BankSlipUrl,
                            '_black'
                          );
                        }}
                      >
                        Boleto
                      </MenuItem>
                    )}

                    <MenuItem
                      disabled={
                        tmpOrder?.Status === 'RECEIVED_IN_CASH' ||
                        tmpOrder?.Status === 'RECEIVED' ||
                        tmpOrder?.Status === 'CONFIRMED' ||
                        tmpOrder?.Status === 'PROCESSED' ||
                        tmpOrder?.Status === 'AWAITINGPROCESSING' ||
                        tmpOrder?.Status === 'PROCESSING' ||
                        tmpOrder?.Status === 'CREATED' ||
                        tmpOrder?.Status === 'Created'
                      }
                      onClick={() => {
                        setAnchorEl(null);
                        setOpenConfirm(true);
                      }}
                    >
                      Informar pagamento
                    </MenuItem>

                    <MenuItem
                      disabled={!tmpOrder?.Payments[0]?.InvoiceUrl}
                      onClick={() => {
                        setAnchorEl(null);
                        window.open(
                          tmpOrder?.Payments[0]?.InvoiceUrl,
                          '_black'
                        );
                      }}
                    >
                      Recibo pagamento
                    </MenuItem>
                    <MenuItem
                      disabled={!tmpOrder?.NFe[0]?.PDFLink}
                      onClick={() => {
                        setAnchorEl(null);
                        window.open(tmpOrder?.NFe[0]?.PDFLink, '_black');
                      }}
                    >
                      PDF Nfe
                    </MenuItem>
                    <MenuItem
                      disabled={
                        !tmpOrder?.PurchaseOrderItems.some((s) =>
                          s?.TrackerIccid?.some((t) => t.Iccid.LPAUrl)
                        )
                      }
                      onClick={() => {
                        searchEsim(tmpOrder);
                        setAnchorEl(null);
                        setOpenEsim(true);
                      }}
                    >
                      e-Sim do pedido
                    </MenuItem>
                    <MenuItem
                      disabled={tmpOrder?.FreightInfo?.length === 0}
                      onClick={() => {
                        setAnchorEl(null);
                        setShowFreigh(true);
                      }}
                    >
                      Status frete
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </TableItens>
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
              {/* <FaCamera
                size={25}
                onClick={() => setModalPhoto(true)}
                style={{
                  color: '#00D959',
                  marginLeft: '1rem',
                  cursor: 'pointer',
                }}
              /> */}
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
        open={showFreigh}
        onClose={() => {
          setShowFreigh(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Detalhes do frete</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {tmpOrder?.FreightInfo[0]?.FreightDetails?.map((f) => (
              <>
                <div key={f.Id} style={{ display: 'flex' }}>
                  <h5>
                    {moment(f.OcurrenceDate).format('DD/MM/YYYY - HH:mm')}
                  </h5>
                  {f.OcurrenceDescription ===
                  'Entregue (Comprovante digitalizado)' ? (
                    <h5>
                      - Entregue{' '}
                      <span
                        style={{
                          color: 'blue',
                          cursor:
                            tmpOrder?.FreightInfo[0]?.ReceiptUrl && 'pointer',
                        }}
                        onClick={() =>
                          tmpOrder?.FreightInfo[0]?.ReceiptUrl &&
                          window.open(
                            tmpOrder?.FreightInfo[0]?.ReceiptUrl,
                            '_black'
                          )
                        }
                      >
                        (Comprovante digitalizado)
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
              setTmpOrder();
              setShowFreigh(false);
            }}
          >
            FECHAR
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEsim}
        onClose={() => {
          setOpenEsim(false);
          setEsim();
        }}
        fullWidth
      >
        <DialogTitle id='alert-dialog-title'>ESIM DO PEDIDO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Select
              name='pages'
              id='page-select'
              options={esimOpt}
              style={{ minWidth: '100px' }}
              value={esim}
              placeholder='Selecione o ESIm'
              onChange={(e) => {
                setEsim(e);
              }}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPosition={'fixed'}
            />
          </DialogContentText>
          <DialogActions style={{ marginTop: '1rem' }}>
            <Button
              invert
              onClick={() => {
                setOpenEsim(false);
                setEsim();
              }}
            >
              CANCELAR
            </Button>
            <Button onClick={getQrcode}>
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
                'GERAR PDF'
              )}
            </Button>
          </DialogActions>
        </DialogContent>
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

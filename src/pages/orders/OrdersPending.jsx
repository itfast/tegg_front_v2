import { useEffect, useState } from 'react';
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from '../../../globalStyles';
import api from '../../services/api';
import {
  // handleCopy,
  translateError,
  translateStatus,
} from '../../services/util';
import { TableItens } from './new/NewOrder.styles';
import moment from 'moment';
import Select from 'react-select';
import ReactLoading from 'react-loading';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Loading } from '../../components/loading/Loading';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IoMdMore } from 'react-icons/io';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
} from '@mui/material';
import { LinkIccids } from '../../components/AddIccids/LinkIccids';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CopyToClipboard } from "react-copy-to-clipboard";

export const OrdersPending = () => {
  const navigate = useNavigate();
  const [showQrcodeLink, setShowQrcodeLink] = useState(false);
  const [pixInf, setPixInf] = useState();
  const [orders, setOrders] = useState([]);
  const [tmpOrder, setTmpOrder] = useState();
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showAddIccid, setShowAddIccid] = useState(false);
  const [openEsim, setOpenEsim] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState({ label: '10', value: '10' });
  const [search, setSearch] = useState({
    label: 'Aguardando pela revenda',
    value: 'AWAITINGPROCESSING',
  });
  const [esim, setEsim] = useState();
  const [loading, setLoading] = useState(false);
  const [esimOpt, setEsimOpt] = useState([]);

  const [hasEsim, setHasEsim] = useState(0);
  const [hasSincard, setHasSincard] = useState(0);

  const [showStoke, setShowStoke] = useState(false);

  useEffect(() => {
    const sincard = api.iccid.getSome1(1, 10, '', 'simcard', 'AVAILABLE');
    const esim = api.iccid.getSome1(1, 10, '', 'esim', 'AVAILABLE');

    Promise.all([sincard, esim]).then((valores) => {
      console.log(valores);
      setHasSincard(valores[0].data?.meta?.total);
      setHasEsim(valores[1].data?.meta?.total);
    });
  }, []);

  const handlePageChange = (event, value) => {
    setPageNum(value);
    // searchOrders(value, 'all', pageSize);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e);
    setPageNum(1);
  };

  const handleClick = (event, order) => {
    setTmpOrder(order);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const searchOrder = () => {
  //   api.purchaseorder
  //     .getAll(pageNum, pageSize.value, '', search.value)
  //     .then((res) => {
  //       setMaxPages(res.data.meta.totalPages || 1);
  //       setOrders(res.data?.purchaseOrder);
  //     })
  //     .catch((err) => {
  //       translateError(err);
  //     });
  // };

  const searchOrder = () => {
    api.order
      .getAll(pageNum, pageSize.value, '', search.value, '')
      .then((res) => {
        setMaxPages(res.data.meta.totalPages || 1);
        console.log(res.data?.orders)
        setOrders(res.data?.orders);
      })
      .catch((err) => {
        translateError(err);
      });
  };

  useEffect(() => {
    searchOrder();
  }, [pageNum, pageSize, search]);

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

  const searchEsim = (e) => {
    const list = [];
    e.OrderItems?.forEach((item) => {
      item?.TrackerIccid?.forEach((i) => {
        if (i?.Iccid?.LPAUrl) {
          list.push({ label: i.IccidId, value: i.IccidId });
        }
      });
    });
    setEsimOpt(list);
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

  const hasStoke = () => {
    if (
      returnQtdEsim(tmpOrder?.OrderItems) > hasEsim ||
      returnQtdSimCard(tmpOrder?.OrderItems) > hasSincard
    ) {
      return false;
    } else {
      return true;
    }
  };

  const generateLink = (e) => {
    setLoading(true);
    api.purchaseorder
      .payGetLink(e.Id)
      .then(async (res) => {
        setPixInf(res?.data?.QrCodePix);
        setShowQrcodeLink(true);
      })
      .catch((err) => {
        console.log(err);
        translateError(err);
      })
      .finally(() => {
        setAnchorEl(null);
        setLoading(false);
      });
  };

  return (
    <>
      <ContainerWeb>
        <Loading open={loading} msg='Gerando link pix...' />
        <PageLayout>
          <h4>Pedidos de clientes</h4>
          <div
            style={{
              marginTop: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              // justifyContent: 'center',
            }}
          >
            <p style={{ marginRight: '1rem' }}>STATUS:</p>
            <div style={{ width: '300px' }}>
              <Select
                name='pages'
                id='page-select'
                options={[
                  { label: 'Criado', value: 'CREATED' },
                  { label: 'Aguardando pagamento', value: 'AWAITING_PAYMENT' },
                  {
                    label: 'Aguardando pela revenda',
                    value: 'AWAITINGPROCESSING',
                  },
                  { label: 'Finalizado', value: 'PROCESSED' },
                  { label: 'Todos', value: '' },
                ]}
                style={{ minWidth: '100px' }}
                value={search}
                onChange={(e) => {
                  setSearch(e);
                }}
              />
            </div>
          </div>
          <TableItens>
            <tr>
              <th>Cliente</th>
              {api.currentUser.AccessTypes[0] === 'TEGG' && <th>Revenda</th>}
              <th>Valor</th>
              <th>Status</th>
              <th>Itens do pedido</th>
              <th>Data criação</th>
              <th>Iccids</th>
            </tr>
            {orders.length === 0 && (
              <tr>
                <td colSpan='6'>
                  <h5 style={{ textAlign: 'center' }}>Sem pedidos pendentes</h5>{' '}
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.Id}>
                <td>{o?.FinalClient?.Name || o?.Dealer?.Name}</td>
                {api.currentUser.AccessTypes[0] === 'TEGG' && (
                  <td>{o?.Dealer?.Name || 'TEGG'}</td>
                )}
                <td>{calcAmount(o?.OrderItems)}</td>
                <td>{translateStatus(o?.Status)}</td>
                <td>
                  {o?.OrderItems?.map((i, ii) => (
                    <h5 key={ii}>{i?.Plan?.Name}</h5>
                  ))}
                </td>
                <td>{moment(o?.CreatedAt).format('DD/MM/YYYY HH:mm')}</td>
                <td>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    {o.OrderItems?.some((p) =>
                      p?.Plan?.Products?.some(
                        (pr) => pr?.Product?.Technology !== 'NA'
                      )
                    ) ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        {returnQtdSimCard(o?.OrderItems) > 0 && (
                          <h5>
                            SimCard: {returnQtdSimCard(o?.OrderItems)}
                          </h5>
                        )}
                        {returnQtdEsim(o?.OrderItems) > 0 && (
                          <h5>e-Sim: {returnQtdEsim(o?.OrderItems)}</h5>
                        )}
                      </div>
                    ) : (
                      <div />
                    )}

                    <div>
                      <IconButton
                        aria-label='more'
                        id='long-button'
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup='true'
                        onClick={(e) => handleClick(e, o)}
                      >
                        {/* <MoreVertIcon /> */}
                        <IoMdMore />
                      </IconButton>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </TableItens>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p>Itens por página:</p>
              <Select
                name='pages'
                id='page-select'
                options={[
                  { label: '5', value: '5' },
                  { label: '10', value: '10' },
                  { label: '30', value: '30' },
                  { label: '50', value: '50' },
                ]}
                value={pageSize}
                onChange={(e) => {
                  handlePageSizeChange(e);
                }}
              />
            </div>
            <div>
              <Pagination
                count={maxPages}
                page={pageNum}
                onChange={handlePageChange}
                variant='outlined'
                shape='rounded'
                size='large'
              />
            </div>
          </div>
        </PageLayout>
      </ContainerWeb>
      <ContainerMobile>
        <PageLayout>
          <h4>Pedidos de clientes</h4>
          <div
            style={{
              marginTop: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              // justifyContent: 'center',
            }}
          >
            <p style={{ marginRight: '1rem' }}>STATUS:</p>
            <div style={{ width: '300px' }}>
              <Select
                name='pages'
                id='page-select'
                options={[
                  { label: 'Criado', value: 'CREATED' },
                  { label: 'Aguardando pagamento', value: 'AWAITING_PAYMENT' },
                  {
                    label: 'Aguardando pela revenda',
                    value: 'AWAITINGPROCESSING',
                  },
                  { label: 'Finalizado', value: 'PROCESSED' },
                  { label: 'Todos', value: '' },
                ]}
                style={{ minWidth: '100px' }}
                value={search}
                onChange={(e) => {
                  setSearch(e);
                }}
              />
            </div>
          </div>
          {orders.map((o) => (
            <div
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
              </div>
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
              ></div>
              <h3 style={{ marginTop: '0.2rem' }}>
                {translateStatus(o.Status)}
              </h3>
            </div>
          ))}

          {/* PAGINAÇÃO */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p>Itens por página:</p>
              <Select
                name='pages'
                id='page-select'
                options={[
                  { label: '5', value: '5' },
                  { label: '10', value: '10' },
                  { label: '30', value: '30' },
                  { label: '50', value: '50' },
                ]}
                value={pageSize}
                onChange={(e) => {
                  handlePageSizeChange(e);
                }}
              />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Pagination
                count={maxPages}
                page={pageNum}
                onChange={handlePageChange}
                variant='outlined'
                shape='rounded'
                size='large'
              />
            </div>
          </div>
        </PageLayout>
      </ContainerMobile>
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
        <MenuItem
          // disabled={!hasStoke}
          disabled={tmpOrder?.Status !== 'AWAITINGPROCESSING'}
          onClick={() => {
            const stok = hasStoke();
            setAnchorEl(null);
            if (stok) {
              setShowAddIccid(true);
            } else {
              setShowStoke(true);
            }
          }}
        >
          Atender pedido
        </MenuItem>
        {tmpOrder?.Status === 'PROCESSED' && api.currentUser.AccessTypes[0] !== 'CLIENT' && (
          <MenuItem
            // disabled={!hasStoke}
            disabled={tmpOrder?.Status !== 'PROCESSED'}
            onClick={() => {
              navigate(`/orders/pending/${tmpOrder?.Id}`,{
                state: { order: tmpOrder },
              })
            }}
          >
            Detalhes
          </MenuItem>
        )}

        <MenuItem
          disabled={!tmpOrder?.Payments[0]?.InvoiceUrl}
          onClick={() => {
            setAnchorEl(null);
            window.open(tmpOrder?.Payments[0]?.InvoiceUrl, '_black');
          }}
        >
          Recibo pagamento
        </MenuItem>
        {api.currentUser.AccessTypes[0] !== 'CLIENT' && (
          <>
            <MenuItem
              // disabled={o?.Payments[0]?.Status === 'RECEIVED'}
              // disabled
              disabled={
                tmpOrder?.Payments[0]?.Status === 'RECEIVED_IN_CASH' ||
                tmpOrder?.Payments[0]?.Status === 'RECEIVED' ||
                tmpOrder?.Payments[0]?.Status === 'CONFIRMED' ||
                tmpOrder?.Payments[0]?.Status === 'PROCESSED' ||
                tmpOrder?.Payments[0]?.Status === 'Created'
              }
              onClick={() => {
                generateLink(tmpOrder);
              }}
            >
              Gerar Link Pix
            </MenuItem>
            <MenuItem
              // disabled={o?.Payments[0]?.Status === 'RECEIVED'}
              // disabled
              disabled={tmpOrder?.Payments[0]?.BillingType !== 'BOLETO'}
              onClick={() => {
                window.open(tmpOrder?.Payments[0]?.BankSlipUrl, '_black');
              }}
            >
              Recuperar Boleto
            </MenuItem>
          </>
        )}
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
          // disabled={tmpOrder?.PurchaseOrderItems?.forEach((p)=> {return p?.TrackerIccid?.find((t) => t.Iccid?.LPAUrl)})}
          disabled={
            !tmpOrder?.OrderItems.some((s) =>
              s?.TrackerIccid?.some((t) => t.Iccid.LPAUrl)
            )
          }
          onClick={() => {
            searchEsim(tmpOrder);
            setAnchorEl(null);
            setOpenEsim(true);
            // window.open(tmpOrder?.NFe[0]?.PDFLink, '_black');
          }}
        >
          e-Sim do pedido
        </MenuItem>
      </Menu>
      <Dialog
        open={showAddIccid}
        onClose={() => setShowAddIccid(false)}
        fullWidth
      >
        <LinkIccids
          order={tmpOrder}
          setOrder={setTmpOrder}
          setShowAddIccid={setShowAddIccid}
          searchOrder={searchOrder}
        />
      </Dialog>
      <Dialog open={showStoke} onClose={() => setShowStoke(false)} fullWidth>
        <DialogTitle>Estoque</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você não possui estoque suficiente para atender esse pedido. O seu
            estoque atual é de:
            <br />
            e-Sim: {hasEsim};<br />
            SimCard: {hasSincard};
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setShowStoke(false)}>
            Fechar
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
                  <ReactLoading type={'bars'} color={'#00D959'} />
                </div>
              ) : (
                'GERAR PDF'
              )}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

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
    </>
  );
};
